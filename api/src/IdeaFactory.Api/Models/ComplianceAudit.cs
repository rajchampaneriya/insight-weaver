using Azure;
using Azure.Data.Tables;

namespace IdeaFactory.Api.Models;

public class ComplianceAudit : ITableEntity
{
    public string PartitionKey { get; set; } = string.Empty;
    public string RowKey { get; set; } = string.Empty;
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }

    public string RequestPath { get; set; } = string.Empty;
    public string RequestMethod { get; set; } = string.Empty;
    public string PromptHash { get; set; } = string.Empty;
    public string ResponseHash { get; set; } = string.Empty;
    public string PolicyResult { get; set; } = string.Empty;
    public string? ViolationDetails { get; set; }
    public string? UserAgent { get; set; }
    public int ResponseStatusCode { get; set; }
    public long DurationMs { get; set; }

    public static ComplianceAudit Create(
        string requestPath,
        string requestMethod,
        string promptHash,
        string responseHash,
        string policyResult,
        string? violationDetails = null,
        string? userAgent = null,
        int responseStatusCode = 200,
        long durationMs = 0)
    {
        var now = DateTimeOffset.UtcNow;
        return new ComplianceAudit
        {
            PartitionKey = now.ToString("yyyy-MM-dd"),
            RowKey = $"{now:HH-mm-ss-fff}-{Guid.NewGuid():N}",
            RequestPath = requestPath,
            RequestMethod = requestMethod,
            PromptHash = promptHash,
            ResponseHash = responseHash,
            PolicyResult = policyResult,
            ViolationDetails = violationDetails,
            UserAgent = userAgent,
            ResponseStatusCode = responseStatusCode,
            DurationMs = durationMs
        };
    }
}
