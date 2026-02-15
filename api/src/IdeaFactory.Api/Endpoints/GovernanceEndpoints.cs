using IdeaFactory.Api.Services;

namespace IdeaFactory.Api.Endpoints;

public static class GovernanceEndpoints
{
    public static RouteGroupBuilder MapGovernanceEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/governance")
            .WithTags("Governance");

        group.MapGet("/report", async (
            IAuditService auditService,
            int? days) =>
        {
            var lookbackDays = days ?? 7;
            var to = DateTimeOffset.UtcNow;
            var from = to.AddDays(-lookbackDays);

            var report = await auditService.GetGovernanceReportAsync(from, to);
            return Results.Ok(report);
        })
        .WithName("GetGovernanceReport")
        .WithDescription("Returns a compliance audit summary for the specified period");

        group.MapGet("/audits", async (
            IAuditService auditService,
            int? days) =>
        {
            var lookbackDays = days ?? 1;
            var to = DateTimeOffset.UtcNow;
            var from = to.AddDays(-lookbackDays);

            var audits = await auditService.GetAuditsAsync(from, to);
            return Results.Ok(audits);
        })
        .WithName("GetAudits")
        .WithDescription("Returns raw audit records for the specified period");

        return group;
    }
}
