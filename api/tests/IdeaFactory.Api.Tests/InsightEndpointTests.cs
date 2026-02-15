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

public class InsightEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public InsightEndpointTests(WebApplicationFactory<Program> factory)
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
    public async Task TodayView_ReturnsInsightResponse()
    {
        var response = await _client.PostAsJsonAsync("/api/insight/today", new
        {
            Ticker = "RELIANCE"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var insight = await response.Content.ReadFromJsonAsync<InsightResponse>();
        Assert.NotNull(insight);
        Assert.Equal("RELIANCE", insight.Ticker);
        Assert.Equal("today", insight.InsightType);
        Assert.False(string.IsNullOrEmpty(insight.Content));
        Assert.False(string.IsNullOrEmpty(insight.Disclaimer));
    }

    [Fact]
    public async Task Brief_ReturnsInsightResponse()
    {
        var response = await _client.PostAsJsonAsync("/api/insight/brief", new
        {
            Ticker = "TCS"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var insight = await response.Content.ReadFromJsonAsync<InsightResponse>();
        Assert.NotNull(insight);
        Assert.Equal("TCS", insight.Ticker);
        Assert.Equal("brief", insight.InsightType);
    }

    [Fact]
    public async Task Explain_ReturnsInsightResponse()
    {
        var response = await _client.PostAsJsonAsync("/api/insight/explain", new
        {
            Ticker = "TATAMOTORS",
            Context = "Stock dropped 4% today"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var insight = await response.Content.ReadFromJsonAsync<InsightResponse>();
        Assert.NotNull(insight);
        Assert.Equal("TATAMOTORS", insight.Ticker);
        Assert.Equal("explain", insight.InsightType);
    }

    [Fact]
    public async Task Chat_ReturnsChatResult()
    {
        var response = await _client.PostAsJsonAsync("/api/insight/chat", new
        {
            Question = "What are the top performing IT stocks?",
            Ticker = "INFY"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<ChatResult>();
        Assert.NotNull(result);
        Assert.False(string.IsNullOrEmpty(result.Answer));
        Assert.False(string.IsNullOrEmpty(result.Disclaimer));
    }

    [Fact]
    public async Task Chat_WithoutTicker_ReturnsResult()
    {
        var response = await _client.PostAsJsonAsync("/api/insight/chat", new
        {
            Question = "How is the banking sector performing?"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<ChatResult>();
        Assert.NotNull(result);
        Assert.False(string.IsNullOrEmpty(result.Answer));
    }
}
