using IdeaFactory.Api.Models;

namespace IdeaFactory.Api.Services;

public interface IMarketDataService
{
    MarketOverviewResponse GetMarketOverview();
    StockDetail[] GetUnusualMovers();
    StockDetail? GetStock(string ticker);
    StockDetailResponse? GetStockDetail(string ticker);
    NewsItem[] GetNewsFeed(string? ticker = null);
    StockDetail[] SearchStocks(string query);
}

public class MarketDataService : IMarketDataService
{
    private static readonly MarketIndex[] Indices =
    [
        new("NIFTY 50", 24856.15m, 142.30m, 0.58m),
        new("SENSEX", 81903.42m, 468.75m, 0.58m),
        new("NIFTY BANK", 53412.80m, -89.40m, -0.17m),
        new("NIFTY IT", 42130.55m, 312.90m, 0.75m),
    ];

    private static readonly SectorPerformance[] Sectors =
    [
        new("IT", 1.2m),
        new("Pharma", 0.8m),
        new("FMCG", 0.3m),
        new("Auto", -0.4m),
        new("Bank", -0.2m),
        new("Metal", 1.5m),
        new("Energy", -0.7m),
        new("Realty", 0.6m),
    ];

    private static readonly StockDetail[] AllStocks =
    [
        new("RELIANCE", "Reliance Industries", "NSE", "Energy", 2945.60m, 87.30m, 3.05m, 15200000, 8500000, "19.9L Cr", 28.4m, 3024.90m, 2220.30m, DateTime.UtcNow),
        new("TCS", "Tata Consultancy Services", "NSE", "IT", 4128.75m, -62.15m, -1.48m, 4800000, 2100000, "14.9L Cr", 32.1m, 4592.25m, 3311.05m, DateTime.UtcNow),
        new("HDFCBANK", "HDFC Bank", "NSE", "Banking", 1685.20m, 24.80m, 1.49m, 12600000, 9800000, "12.8L Cr", 19.6m, 1794.00m, 1363.55m, DateTime.UtcNow),
        new("INFY", "Infosys", "NSE", "IT", 1892.30m, 45.60m, 2.47m, 8900000, 5200000, "7.8L Cr", 29.8m, 1989.40m, 1358.35m, DateTime.UtcNow),
        new("TATAMOTORS", "Tata Motors", "NSE", "Auto", 748.90m, -31.20m, -4.00m, 22100000, 11400000, "2.7L Cr", 8.2m, 1072.00m, 608.30m, DateTime.UtcNow),
        new("ADANIENT", "Adani Enterprises", "NSE", "Conglomerate", 2634.50m, 128.40m, 5.12m, 6700000, 3100000, "3.0L Cr", 72.3m, 3743.90m, 2142.00m, DateTime.UtcNow),
        new("SUNPHARMA", "Sun Pharma", "NSE", "Pharma", 1756.80m, 18.90m, 1.09m, 3200000, 2800000, "4.2L Cr", 38.5m, 1960.60m, 1208.25m, DateTime.UtcNow),
        new("WIPRO", "Wipro", "NSE", "IT", 542.15m, -8.30m, -1.51m, 7400000, 5600000, "2.8L Cr", 24.7m, 585.65m, 388.70m, DateTime.UtcNow),
        new("ICICIBANK", "ICICI Bank", "NSE", "Banking", 1245.30m, 12.40m, 1.01m, 8900000, 7200000, "8.7L Cr", 18.2m, 1310.00m, 898.45m, DateTime.UtcNow),
        new("HINDUNILVR", "Hindustan Unilever", "NSE", "FMCG", 2380.60m, -5.20m, -0.22m, 2100000, 1900000, "5.6L Cr", 56.8m, 2859.00m, 2172.05m, DateTime.UtcNow),
        new("BHARTIARTL", "Bharti Airtel", "NSE", "Telecom", 1580.45m, 22.10m, 1.42m, 5600000, 4100000, "9.4L Cr", 74.3m, 1778.00m, 1098.65m, DateTime.UtcNow),
        new("KOTAKBANK", "Kotak Mahindra Bank", "NSE", "Banking", 1820.90m, -14.30m, -0.78m, 3400000, 2800000, "3.6L Cr", 21.4m, 1942.00m, 1544.15m, DateTime.UtcNow),
    ];

    private static readonly StockDetail[] UnusualMoversList = AllStocks[..8];

    private static readonly NewsItem[] News =
    [
        new("1", "Reliance Jio crosses 500M subscriber milestone, ARPU rises 12% QoQ", "Economic Times", "14 min ago", "positive", "RELIANCE"),
        new("2", "TCS warns of slower deal pipeline amid global macro uncertainty", "Moneycontrol", "32 min ago", "negative", "TCS"),
        new("3", "RBI keeps repo rate unchanged at 6.5%, shifts stance to accommodative", "LiveMint", "1 hr ago", "neutral"),
        new("4", "Adani Enterprises wins new coal mining contract worth 12,000 Cr", "Business Standard", "1 hr ago", "positive", "ADANIENT"),
        new("5", "Tata Motors EV sales decline 18% in January, market share under pressure", "NDTV Profit", "2 hr ago", "negative", "TATAMOTORS"),
        new("6", "SEBI proposes new framework for ESG rating providers", "Reuters", "3 hr ago", "neutral"),
        new("7", "Infosys bags $2B deal with European financial services firm", "Economic Times", "3 hr ago", "positive", "INFY"),
        new("8", "Sun Pharma receives FDA approval for new generic drug", "Moneycontrol", "4 hr ago", "positive", "SUNPHARMA"),
    ];

    private static readonly Dictionary<string, QuarterlyEarning[]> EarningsData = new()
    {
        ["RELIANCE"] =
        [
            new("Q3 FY25", "2,35,800 Cr", "18,540 Cr", "12.4%", "7.9%"),
            new("Q2 FY25", "2,28,400 Cr", "17,820 Cr", "8.2%", "7.8%"),
            new("Q1 FY25", "2,21,700 Cr", "16,950 Cr", "6.1%", "7.6%"),
            new("Q4 FY24", "2,15,200 Cr", "15,400 Cr", "4.8%", "7.2%"),
        ]
    };

    private static readonly Dictionary<string, PricePoint[]> PriceHistoryData = new()
    {
        ["RELIANCE"] =
        [
            new("Jan", 2680m), new("Feb", 2720m), new("Mar", 2650m),
            new("Apr", 2780m), new("May", 2830m), new("Jun", 2900m),
            new("Jul", 2850m), new("Aug", 2920m), new("Sep", 2880m),
            new("Oct", 2960m), new("Nov", 2910m), new("Dec", 2945m),
        ]
    };

    // Default price history for stocks without specific data
    private static PricePoint[] GenerateDefaultPriceHistory(decimal currentPrice)
    {
        var months = new[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };
        var random = new Random(currentPrice.GetHashCode());
        var basePrice = currentPrice * 0.9m;
        return months.Select(m =>
            new PricePoint(m, Math.Round(basePrice + (decimal)(random.NextDouble() * (double)(currentPrice * 0.2m)), 2))
        ).ToArray();
    }

    // Default earnings for stocks without specific data
    private static readonly QuarterlyEarning[] DefaultEarnings =
    [
        new("Q3 FY25", "N/A", "N/A", "N/A", "N/A"),
        new("Q2 FY25", "N/A", "N/A", "N/A", "N/A"),
        new("Q1 FY25", "N/A", "N/A", "N/A", "N/A"),
        new("Q4 FY24", "N/A", "N/A", "N/A", "N/A"),
    ];

    public MarketOverviewResponse GetMarketOverview() =>
        new(Indices, Sectors);

    public StockDetail[] GetUnusualMovers() =>
        UnusualMoversList;

    public StockDetail? GetStock(string ticker) =>
        AllStocks.FirstOrDefault(s =>
            s.Ticker.Equals(ticker, StringComparison.OrdinalIgnoreCase));

    public StockDetailResponse? GetStockDetail(string ticker)
    {
        var stock = GetStock(ticker);
        if (stock is null) return null;

        var earnings = EarningsData.GetValueOrDefault(stock.Ticker, DefaultEarnings);
        var priceHistory = PriceHistoryData.GetValueOrDefault(stock.Ticker, GenerateDefaultPriceHistory(stock.Price));
        var news = News.Where(n => n.Ticker == stock.Ticker).ToArray();

        return new StockDetailResponse(stock, earnings, priceHistory, news);
    }

    public NewsItem[] GetNewsFeed(string? ticker = null) =>
        ticker is null
            ? News
            : News.Where(n => n.Ticker?.Equals(ticker, StringComparison.OrdinalIgnoreCase) == true).ToArray();

    public StockDetail[] SearchStocks(string query) =>
        AllStocks.Where(s =>
            s.Ticker.Contains(query, StringComparison.OrdinalIgnoreCase) ||
            s.Name.Contains(query, StringComparison.OrdinalIgnoreCase) ||
            s.Sector.Contains(query, StringComparison.OrdinalIgnoreCase)
        ).ToArray();
}
