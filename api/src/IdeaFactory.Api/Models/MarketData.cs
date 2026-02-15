namespace IdeaFactory.Api.Models;

public record MarketIndex(
    string Name,
    decimal Value,
    decimal Change,
    decimal ChangePercent
);

public record SectorPerformance(
    string Name,
    decimal Change
);

public record NewsItem(
    string Id,
    string Headline,
    string Source,
    string Time,
    string Sentiment,
    string? Ticker = null
);

public record StockDetail(
    string Ticker,
    string Name,
    string Exchange,
    string Sector,
    decimal Price,
    decimal Change,
    decimal ChangePercent,
    long Volume,
    long AvgVolume,
    string MarketCap,
    decimal Pe,
    decimal High52W,
    decimal Low52W,
    DateTime LastUpdated
);

public record QuarterlyEarning(
    string Quarter,
    string Revenue,
    string Pat,
    string EpsGrowth,
    string Margin
);

public record PricePoint(
    string Date,
    decimal Price
);

public record MarketOverviewResponse(
    MarketIndex[] Indices,
    SectorPerformance[] Sectors
);

public record StockDetailResponse(
    StockDetail Stock,
    QuarterlyEarning[] Earnings,
    PricePoint[] PriceHistory,
    NewsItem[] News
);
