using IdeaFactory.Api.Models;

namespace IdeaFactory.Api.Services;

public interface IAuditService
{
    Task RecordAuditAsync(ComplianceAudit audit);
    Task<IReadOnlyList<ComplianceAudit>> GetAuditsAsync(DateTimeOffset from, DateTimeOffset to);
    Task<GovernanceReport> GetGovernanceReportAsync(DateTimeOffset from, DateTimeOffset to);
}

public record GovernanceReport(
    int TotalRequests,
    int PassedRequests,
    int BlockedRequests,
    int OutputViolations,
    DateTimeOffset From,
    DateTimeOffset To,
    IReadOnlyList<ViolationSummary> RecentViolations
);

public record ViolationSummary(
    string RequestPath,
    string PolicyResult,
    string? ViolationDetails,
    DateTimeOffset? Timestamp
);
