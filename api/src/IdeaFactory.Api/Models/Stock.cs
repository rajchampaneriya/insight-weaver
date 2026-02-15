namespace IdeaFactory.Api.Models;

public record Stock(
    string Ticker,
    string Name,
    string Exchange,
    string Sector,
    decimal Price,
    decimal Change,
    decimal ChangePercent,
    long Volume,
    decimal MarketCap,
    DateTime LastUpdated
);
