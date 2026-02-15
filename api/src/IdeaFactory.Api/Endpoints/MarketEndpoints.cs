using IdeaFactory.Api.Services;

namespace IdeaFactory.Api.Endpoints;

public static class MarketEndpoints
{
    public static RouteGroupBuilder MapMarketEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/market")
            .WithTags("Market Data");

        group.MapGet("/indices", (IMarketDataService marketService) =>
        {
            var overview = marketService.GetMarketOverview();
            return Results.Ok(overview);
        })
        .WithName("GetMarketIndices")
        .WithDescription("Returns market indices and sector performance");

        group.MapGet("/movers", (IMarketDataService marketService) =>
        {
            var movers = marketService.GetUnusualMovers();
            return Results.Ok(movers);
        })
        .WithName("GetUnusualMovers")
        .WithDescription("Returns stocks with unusual price/volume activity");

        group.MapGet("/stock/{ticker}", (
            string ticker,
            IMarketDataService marketService) =>
        {
            var detail = marketService.GetStockDetail(ticker);
            return detail is not null
                ? Results.Ok(detail)
                : Results.NotFound(new { error = "Stock not found", ticker });
        })
        .WithName("GetStockDetail")
        .WithDescription("Returns detailed stock data including earnings and price history");

        group.MapGet("/news", (
            string? ticker,
            IMarketDataService marketService) =>
        {
            var news = marketService.GetNewsFeed(ticker);
            return Results.Ok(news);
        })
        .WithName("GetNewsFeed")
        .WithDescription("Returns news feed, optionally filtered by ticker");

        group.MapGet("/search", (
            string q,
            IMarketDataService marketService) =>
        {
            var results = marketService.SearchStocks(q);
            return Results.Ok(results);
        })
        .WithName("SearchStocks")
        .WithDescription("Search stocks by ticker, name, or sector");

        return group;
    }
}
