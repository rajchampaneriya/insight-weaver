using System.Net;
using System.Net.Http.Json;
using IdeaFactory.Api.Middleware;
using IdeaFactory.Api.Models;
using IdeaFactory.Api.Services;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace IdeaFactory.Api.Tests;

public class PrudenceMiddlewareTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public PrudenceMiddlewareTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureAppConfiguration((context, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["ConnectionStrings:cache"] = "localhost:6379",
                    ["ConnectionStrings:tables"] = "UseDevelopmentStorage=true"
                });
            });

            builder.ConfigureServices(services =>
            {
                // Replace AI service with a test stub (avoids Redis dependency)
                services.AddSingleton<IAiInsightService>(new StubAiInsightService());

                // Replace AI client with a test stub
                services.AddSingleton<IChatClient>(new TestChatClient());

                // Replace audit service with in-memory implementation
                services.AddSingleton<IAuditService>(new InMemoryAuditService());

                // Remove infrastructure health checks for test isolation
                services.Configure<HealthCheckServiceOptions>(options =>
                {
                    options.Registrations.Clear();
                });
            });
        });
    }

    [Fact]
    public async Task Insight_WithCleanPrompt_ShouldReturn200()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/insight/today", new
        {
            Ticker = "RELIANCE"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True(response.Headers.Contains(ComplianceRules.SebiDisclaimerHeader));
    }

    [Fact]
    public async Task Insight_WithForbiddenTerm_ShouldReturn422()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/insight/today", new
        {
            Ticker = "RELIANCE",
            Context = "Should I buy RELIANCE?"
        });

        Assert.Equal(HttpStatusCode.UnprocessableEntity, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<ComplianceErrorResponse>();
        Assert.Equal("compliance_violation", body?.Error);
        Assert.Contains("buy", body?.ViolatedTerm ?? "");
    }

    [Fact]
    public async Task Insight_Response_ShouldIncludeComplianceHeaders()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/insight/brief", new
        {
            Ticker = "TCS"
        });

        Assert.True(response.Headers.Contains(ComplianceRules.SebiDisclaimerHeader));
        Assert.True(response.Headers.Contains(ComplianceRules.AuditTrailHeader));
    }

    [Fact]
    public async Task HealthCheck_ShouldReturn200()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task AliveCheck_ShouldReturn200()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/alive");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GovernanceReport_ShouldReturn200()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/governance/report");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    private record ComplianceErrorResponse(string Error, string Message, string ViolatedTerm);
}

internal class TestChatClient : IChatClient
{
    public void Dispose() { }

    public ChatClientMetadata Metadata => new("test-model");

    public Task<ChatResponse> GetResponseAsync(
        IEnumerable<ChatMessage> chatMessages,
        ChatOptions? options = null,
        CancellationToken cancellationToken = default)
    {
        var response = new ChatResponse(new ChatMessage(ChatRole.Assistant,
            "RELIANCE Industries showed a 2.3% increase today. " +
            "This is AI-generated analysis for informational purposes only. Not investment advice."));
        return Task.FromResult(response);
    }

    public IAsyncEnumerable<ChatResponseUpdate> GetStreamingResponseAsync(
        IEnumerable<ChatMessage> chatMessages,
        ChatOptions? options = null,
        CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public object? GetService(Type serviceType, object? serviceKey = null) => null;
}

internal class StubAiInsightService : IAiInsightService
{
    public Task<string> GenerateInsightAsync(string ticker, string insightType, string? context = null,
        CancellationToken cancellationToken = default)
    {
        return Task.FromResult(
            $"{ticker} showed a 2.3% increase today. " +
            "This is AI-generated analysis for informational purposes only. Not investment advice.");
    }

    public Task<string> ChatAsync(string question, string? ticker = null,
        CancellationToken cancellationToken = default)
    {
        return Task.FromResult(
            "This is a test response. Not investment advice.");
    }
}

internal class InMemoryAuditService : IAuditService
{
    private readonly List<ComplianceAudit> _audits = [];

    public Task RecordAuditAsync(ComplianceAudit audit)
    {
        _audits.Add(audit);
        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<ComplianceAudit>> GetAuditsAsync(DateTimeOffset from, DateTimeOffset to)
    {
        var result = _audits
            .Where(a => a.Timestamp >= from && a.Timestamp <= to)
            .ToList();
        return Task.FromResult<IReadOnlyList<ComplianceAudit>>(result);
    }

    public Task<GovernanceReport> GetGovernanceReportAsync(DateTimeOffset from, DateTimeOffset to)
    {
        return Task.FromResult(new GovernanceReport(
            TotalRequests: _audits.Count,
            PassedRequests: _audits.Count(a => a.PolicyResult == "PASS"),
            BlockedRequests: _audits.Count(a => a.PolicyResult == "BLOCKED"),
            OutputViolations: _audits.Count(a => a.PolicyResult == "OUTPUT_VIOLATION"),
            From: from,
            To: to,
            RecentViolations: []
        ));
    }
}
