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

public class MarketEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public MarketEndpointTests(WebApplicationFactory<Program> factory)
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
    public async Task GetMarketIndices_ReturnsIndicesAndSectors()
    {
        var response = await _client.GetAsync("/api/market/indices");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var overview = await response.Content.ReadFromJsonAsync<MarketOverviewResponse>();
        Assert.NotNull(overview);
        Assert.NotEmpty(overview.Indices);
        Assert.NotEmpty(overview.Sectors);
        Assert.Contains(overview.Indices, i => i.Name == "NIFTY 50");
        Assert.Contains(overview.Indices, i => i.Name == "SENSEX");
    }

    [Fact]
    public async Task GetUnusualMovers_ReturnsStockList()
    {
        var response = await _client.GetAsync("/api/market/movers");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var movers = await response.Content.ReadFromJsonAsync<StockDetail[]>();
        Assert.NotNull(movers);
        Assert.NotEmpty(movers);
        Assert.All(movers, m =>
        {
            Assert.False(string.IsNullOrEmpty(m.Ticker));
            Assert.False(string.IsNullOrEmpty(m.Name));
        });
    }

    [Fact]
    public async Task GetStockDetail_WithValidTicker_ReturnsDetail()
    {
        var response = await _client.GetAsync("/api/market/stock/RELIANCE");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var detail = await response.Content.ReadFromJsonAsync<StockDetailResponse>();
        Assert.NotNull(detail);
        Assert.Equal("RELIANCE", detail.Stock.Ticker);
        Assert.NotEmpty(detail.Earnings);
        Assert.NotEmpty(detail.PriceHistory);
    }

    [Fact]
    public async Task GetStockDetail_WithInvalidTicker_Returns404()
    {
        var response = await _client.GetAsync("/api/market/stock/INVALID");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetNewsFeed_ReturnsNewsItems()
    {
        var response = await _client.GetAsync("/api/market/news");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var news = await response.Content.ReadFromJsonAsync<NewsItem[]>();
        Assert.NotNull(news);
        Assert.NotEmpty(news);
    }

    [Fact]
    public async Task GetNewsFeed_FilteredByTicker_ReturnsFilteredResults()
    {
        var response = await _client.GetAsync("/api/market/news?ticker=RELIANCE");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var news = await response.Content.ReadFromJsonAsync<NewsItem[]>();
        Assert.NotNull(news);
        Assert.All(news, n => Assert.Equal("RELIANCE", n.Ticker));
    }

    [Fact]
    public async Task SearchStocks_ReturnsMatchingResults()
    {
        var response = await _client.GetAsync("/api/market/search?q=Tata");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var results = await response.Content.ReadFromJsonAsync<StockDetail[]>();
        Assert.NotNull(results);
        Assert.NotEmpty(results);
        Assert.All(results, s =>
            Assert.True(
                s.Name.Contains("Tata", StringComparison.OrdinalIgnoreCase) ||
                s.Ticker.Contains("TATA", StringComparison.OrdinalIgnoreCase)));
    }

    [Fact]
    public async Task SearchStocks_BySector_ReturnsResults()
    {
        var response = await _client.GetAsync("/api/market/search?q=IT");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var results = await response.Content.ReadFromJsonAsync<StockDetail[]>();
        Assert.NotNull(results);
        Assert.NotEmpty(results);
    }
}
