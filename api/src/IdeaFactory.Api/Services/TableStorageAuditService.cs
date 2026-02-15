using Azure.Data.Tables;
using IdeaFactory.Api.Models;

namespace IdeaFactory.Api.Services;

public class TableStorageAuditService : IAuditService
{
    private readonly TableClient _tableClient;
    private readonly ILogger<TableStorageAuditService> _logger;
    private const string TableName = "ComplianceAudit";

    public TableStorageAuditService(
        TableServiceClient tableServiceClient,
        ILogger<TableStorageAuditService> logger)
    {
        _logger = logger;
        _tableClient = tableServiceClient.GetTableClient(TableName);
    }

    public async Task InitializeAsync()
    {
        await _tableClient.CreateIfNotExistsAsync();
    }

    public async Task RecordAuditAsync(ComplianceAudit audit)
    {
        try
        {
            await _tableClient.AddEntityAsync(audit);
            _logger.LogInformation(
                "Audit recorded: {PartitionKey}/{RowKey} - {PolicyResult}",
                audit.PartitionKey, audit.RowKey, audit.PolicyResult);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Failed to record audit: {PartitionKey}/{RowKey}",
                audit.PartitionKey, audit.RowKey);
        }
    }

    public async Task<IReadOnlyList<ComplianceAudit>> GetAuditsAsync(
        DateTimeOffset from, DateTimeOffset to)
    {
        var fromPartition = from.ToString("yyyy-MM-dd");
        var toPartition = to.ToString("yyyy-MM-dd");

        var audits = new List<ComplianceAudit>();

        var query = _tableClient.QueryAsync<ComplianceAudit>(
            filter: $"PartitionKey ge '{fromPartition}' and PartitionKey le '{toPartition}'");

        await foreach (var audit in query)
        {
            audits.Add(audit);
        }

        return audits;
    }

    public async Task<GovernanceReport> GetGovernanceReportAsync(
        DateTimeOffset from, DateTimeOffset to)
    {
        var audits = await GetAuditsAsync(from, to);

        var totalRequests = audits.Count;
        var passedRequests = audits.Count(a => a.PolicyResult == "PASS");
        var blockedRequests = audits.Count(a => a.PolicyResult == "BLOCKED");
        var outputViolations = audits.Count(a => a.PolicyResult == "OUTPUT_VIOLATION");

        var recentViolations = audits
            .Where(a => a.PolicyResult != "PASS")
            .OrderByDescending(a => a.Timestamp)
            .Take(20)
            .Select(a => new ViolationSummary(
                a.RequestPath,
                a.PolicyResult,
                a.ViolationDetails,
                a.Timestamp))
            .ToList();

        return new GovernanceReport(
            totalRequests,
            passedRequests,
            blockedRequests,
            outputViolations,
            from,
            to,
            recentViolations);
    }
}
