using System.Net;
using System.Net.Http.Json;
using IdeaFactory.Api.Models;
using IdeaFactory.Api.Services;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace IdeaFactory.Api.Tests;

public class CopilotEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public CopilotEndpointTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureAppConfiguration((_, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["ConnectionStrings:cache"] = "localhost:6379",
                    ["ConnectionStrings:tables"] = "UseDevelopmentStorage=true"
                });
            });

            builder.ConfigureServices(services =>
            {
                services.AddSingleton<IAiInsightService>(new StubAiInsightService());
                services.AddSingleton<IChatClient>(new TestChatClient());
                services.AddSingleton<IAuditService>(new InMemoryAuditService());
                services.Configure<HealthCheckServiceOptions>(options =>
                {
                    options.Registrations.Clear();
                });
            });
        }).CreateClient();
    }

    [Fact]
    public async Task Resolve_WithTodayIntent_RoutesToTodayInsight()
    {
        var response = await _client.PostAsJsonAsync("/copilot/resolve", new
        {
            Prompt = "What changed for RELIANCE today?"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<CopilotResponse>();
        Assert.NotNull(result);
        Assert.Equal("today", result.InsightType);
        Assert.Equal("RELIANCE", result.Ticker);
        Assert.False(string.IsNullOrEmpty(result.Content));
        Assert.False(string.IsNullOrEmpty(result.Disclaimer));
    }

    [Fact]
    public async Task Resolve_WithBriefIntent_RoutesToBriefInsight()
    {
        var response = await _client.PostAsJsonAsync("/copilot/resolve", new
        {
            Prompt = "Give me a brief on TCS"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<CopilotResponse>();
        Assert.NotNull(result);
        Assert.Equal("brief", result.InsightType);
        Assert.Equal("TCS", result.Ticker);
    }

    [Fact]
    public async Task Resolve_WithExplainIntent_RoutesToExplainInsight()
    {
        var response = await _client.PostAsJsonAsync("/copilot/resolve", new
        {
            Prompt = "Why did TATAMOTORS drop 4%?"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<CopilotResponse>();
        Assert.NotNull(result);
        Assert.Equal("explain", result.InsightType);
        Assert.Equal("TATAMOTORS", result.Ticker);
    }

    [Fact]
    public async Task Resolve_WithChatIntent_RoutesToChat()
    {
        var response = await _client.PostAsJsonAsync("/copilot/resolve", new
        {
            Prompt = "How is the banking sector performing?"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<CopilotResponse>();
        Assert.NotNull(result);
        Assert.Equal("chat", result.InsightType);
    }

    [Fact]
    public async Task Resolve_WithForbiddenTerm_IsBlockedByPrudence()
    {
        var response = await _client.PostAsJsonAsync("/copilot/resolve", new
        {
            Prompt = "Should I buy RELIANCE?"
        });

        Assert.Equal(HttpStatusCode.UnprocessableEntity, response.StatusCode);
    }

    [Fact]
    public async Task Skills_ReturnsAvailableSkills()
    {
        var response = await _client.GetAsync("/copilot/skills");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
