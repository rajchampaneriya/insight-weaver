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

    // Competitor IT companies (TCS, INFY, WIPRO) excluded from dashboard views
    private static readonly string[] ExcludedItTickers = ["TCS", "INFY", "WIPRO"];

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

    private static readonly StockDetail[] UnusualMoversList = AllStocks
        .Where(s => !ExcludedItTickers.Contains(s.Ticker))
        .Take(8)
        .ToArray();

    private static readonly NewsItem[] News =
    [
        new("1", "Reliance Jio crosses 500M subscriber milestone, ARPU rises 12% QoQ", "Economic Times", "14 min ago", "positive", "RELIANCE"),
        new("2", "HDFC Bank reports robust Q3 deposit growth of 15% YoY", "Moneycontrol", "32 min ago", "positive", "HDFCBANK"),
        new("3", "RBI keeps repo rate unchanged at 6.5%, shifts stance to accommodative", "LiveMint", "1 hr ago", "neutral"),
        new("4", "Adani Enterprises wins new coal mining contract worth 12,000 Cr", "Business Standard", "1 hr ago", "positive", "ADANIENT"),
        new("5", "Tata Motors EV sales decline 18% in January, market share under pressure", "NDTV Profit", "2 hr ago", "negative", "TATAMOTORS"),
        new("6", "SEBI proposes new framework for ESG rating providers", "Reuters", "3 hr ago", "neutral"),
        new("7", "Bharti Airtel 5G rollout covers 500 cities, subscriber adds accelerate", "Economic Times", "3 hr ago", "positive", "BHARTIARTL"),
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
        ],
        ["TCS"] =
        [
            new("Q3 FY25", "64,259 Cr", "12,380 Cr", "5.6%", "19.3%"),
            new("Q2 FY25", "63,047 Cr", "12,105 Cr", "8.7%", "19.2%"),
            new("Q1 FY25", "62,613 Cr", "11,909 Cr", "9.1%", "19.0%"),
            new("Q4 FY24", "61,237 Cr", "11,392 Cr", "7.4%", "18.6%"),
        ],
        ["HDFCBANK"] =
        [
            new("Q3 FY25", "85,790 Cr", "16,736 Cr", "2.1%", "19.5%"),
            new("Q2 FY25", "84,026 Cr", "16,474 Cr", "5.3%", "19.6%"),
            new("Q1 FY25", "82,096 Cr", "16,175 Cr", "35.3%", "19.7%"),
            new("Q4 FY24", "78,738 Cr", "16,512 Cr", "37.1%", "21.0%"),
        ],
        ["INFY"] =
        [
            new("Q3 FY25", "41,764 Cr", "6,806 Cr", "11.4%", "16.3%"),
            new("Q2 FY25", "40,986 Cr", "6,506 Cr", "4.7%", "15.9%"),
            new("Q1 FY25", "39,315 Cr", "6,368 Cr", "7.1%", "16.2%"),
            new("Q4 FY24", "37,923 Cr", "7,969 Cr", "29.8%", "21.0%"),
        ],
        ["TATAMOTORS"] =
        [
            new("Q3 FY25", "1,13,575 Cr", "5,578 Cr", "-22.3%", "4.9%"),
            new("Q2 FY25", "1,01,450 Cr", "3,343 Cr", "-11.8%", "3.3%"),
            new("Q1 FY25", "1,08,048 Cr", "5,692 Cr", "73.7%", "5.3%"),
            new("Q4 FY24", "1,19,986 Cr", "7,558 Cr", "46.4%", "6.3%"),
        ],
        ["ADANIENT"] =
        [
            new("Q3 FY25", "23,350 Cr", "1,290 Cr", "42.6%", "5.5%"),
            new("Q2 FY25", "23,196 Cr", "1,742 Cr", "664.4%", "7.5%"),
            new("Q1 FY25", "25,472 Cr", "1,455 Cr", "116.1%", "5.7%"),
            new("Q4 FY24", "22,076 Cr", "898 Cr", "38.2%", "4.1%"),
        ],
        ["SUNPHARMA"] =
        [
            new("Q3 FY25", "13,675 Cr", "3,037 Cr", "25.8%", "22.2%"),
            new("Q2 FY25", "13,347 Cr", "3,040 Cr", "28.2%", "22.8%"),
            new("Q1 FY25", "12,652 Cr", "2,836 Cr", "40.2%", "22.4%"),
            new("Q4 FY24", "11,813 Cr", "2,655 Cr", "34.5%", "22.5%"),
        ],
        ["WIPRO"] =
        [
            new("Q3 FY25", "22,319 Cr", "3,354 Cr", "24.5%", "15.0%"),
            new("Q2 FY25", "22,302 Cr", "3,209 Cr", "21.2%", "14.4%"),
            new("Q1 FY25", "21,964 Cr", "3,003 Cr", "4.6%", "13.7%"),
            new("Q4 FY24", "22,208 Cr", "2,835 Cr", "-7.6%", "12.8%"),
        ],
        ["ICICIBANK"] =
        [
            new("Q3 FY25", "48,280 Cr", "11,792 Cr", "14.8%", "24.4%"),
            new("Q2 FY25", "46,081 Cr", "11,746 Cr", "14.5%", "25.5%"),
            new("Q1 FY25", "44,424 Cr", "11,059 Cr", "14.6%", "24.9%"),
            new("Q4 FY24", "42,907 Cr", "10,708 Cr", "17.4%", "25.0%"),
        ],
        ["HINDUNILVR"] =
        [
            new("Q3 FY25", "15,818 Cr", "2,984 Cr", "19.1%", "18.9%"),
            new("Q2 FY25", "15,319 Cr", "2,612 Cr", "2.2%", "17.0%"),
            new("Q1 FY25", "15,706 Cr", "2,538 Cr", "2.8%", "16.2%"),
            new("Q4 FY24", "14,693 Cr", "2,406 Cr", "-5.9%", "16.4%"),
        ],
        ["BHARTIARTL"] =
        [
            new("Q3 FY25", "45,129 Cr", "5,514 Cr", "97.6%", "12.2%"),
            new("Q2 FY25", "41,473 Cr", "3,593 Cr", "168.0%", "8.7%"),
            new("Q1 FY25", "38,506 Cr", "4,160 Cr", "234.0%", "10.8%"),
            new("Q4 FY24", "37,588 Cr", "2,841 Cr", "29.5%", "7.6%"),
        ],
        ["KOTAKBANK"] =
        [
            new("Q3 FY25", "16,050 Cr", "3,304 Cr", "10.5%", "20.6%"),
            new("Q2 FY25", "15,180 Cr", "3,344 Cr", "-0.5%", "22.0%"),
            new("Q1 FY25", "14,396 Cr", "6,250 Cr", "81.3%", "43.4%"),
            new("Q4 FY24", "13,269 Cr", "4,133 Cr", "18.3%", "31.1%"),
        ],
    };

    private static readonly Dictionary<string, PricePoint[]> PriceHistoryData = new()
    {
        ["RELIANCE"] =
        [
            new("Jan", 2680m), new("Feb", 2720m), new("Mar", 2650m),
            new("Apr", 2780m), new("May", 2830m), new("Jun", 2900m),
            new("Jul", 2850m), new("Aug", 2920m), new("Sep", 2880m),
            new("Oct", 2960m), new("Nov", 2910m), new("Dec", 2945m),
        ],
        ["TCS"] =
        [
            new("Jan", 3850m), new("Feb", 3920m), new("Mar", 3780m),
            new("Apr", 3960m), new("May", 4050m), new("Jun", 3890m),
            new("Jul", 3950m), new("Aug", 4100m), new("Sep", 4180m),
            new("Oct", 4050m), new("Nov", 4200m), new("Dec", 4128m),
        ],
        ["HDFCBANK"] =
        [
            new("Jan", 1520m), new("Feb", 1480m), new("Mar", 1540m),
            new("Apr", 1580m), new("May", 1620m), new("Jun", 1590m),
            new("Jul", 1650m), new("Aug", 1680m), new("Sep", 1640m),
            new("Oct", 1700m), new("Nov", 1660m), new("Dec", 1685m),
        ],
        ["INFY"] =
        [
            new("Jan", 1620m), new("Feb", 1580m), new("Mar", 1650m),
            new("Apr", 1700m), new("May", 1680m), new("Jun", 1740m),
            new("Jul", 1780m), new("Aug", 1820m), new("Sep", 1760m),
            new("Oct", 1850m), new("Nov", 1870m), new("Dec", 1892m),
        ],
        ["TATAMOTORS"] =
        [
            new("Jan", 920m), new("Feb", 960m), new("Mar", 880m),
            new("Apr", 850m), new("May", 810m), new("Jun", 790m),
            new("Jul", 820m), new("Aug", 780m), new("Sep", 760m),
            new("Oct", 740m), new("Nov", 730m), new("Dec", 748m),
        ],
        ["ADANIENT"] =
        [
            new("Jan", 2480m), new("Feb", 2550m), new("Mar", 2420m),
            new("Apr", 2380m), new("May", 2510m), new("Jun", 2580m),
            new("Jul", 2650m), new("Aug", 2520m), new("Sep", 2610m),
            new("Oct", 2550m), new("Nov", 2590m), new("Dec", 2634m),
        ],
        ["SUNPHARMA"] =
        [
            new("Jan", 1420m), new("Feb", 1480m), new("Mar", 1510m),
            new("Apr", 1550m), new("May", 1580m), new("Jun", 1620m),
            new("Jul", 1660m), new("Aug", 1640m), new("Sep", 1700m),
            new("Oct", 1720m), new("Nov", 1740m), new("Dec", 1756m),
        ],
        ["WIPRO"] =
        [
            new("Jan", 480m), new("Feb", 490m), new("Mar", 475m),
            new("Apr", 495m), new("May", 510m), new("Jun", 520m),
            new("Jul", 505m), new("Aug", 530m), new("Sep", 525m),
            new("Oct", 540m), new("Nov", 535m), new("Dec", 542m),
        ],
        ["ICICIBANK"] =
        [
            new("Jan", 1050m), new("Feb", 1080m), new("Mar", 1110m),
            new("Apr", 1090m), new("May", 1130m), new("Jun", 1160m),
            new("Jul", 1150m), new("Aug", 1190m), new("Sep", 1210m),
            new("Oct", 1220m), new("Nov", 1240m), new("Dec", 1245m),
        ],
        ["HINDUNILVR"] =
        [
            new("Jan", 2520m), new("Feb", 2480m), new("Mar", 2450m),
            new("Apr", 2470m), new("May", 2440m), new("Jun", 2420m),
            new("Jul", 2400m), new("Aug", 2390m), new("Sep", 2410m),
            new("Oct", 2380m), new("Nov", 2370m), new("Dec", 2380m),
        ],
        ["BHARTIARTL"] =
        [
            new("Jan", 1180m), new("Feb", 1220m), new("Mar", 1280m),
            new("Apr", 1310m), new("May", 1350m), new("Jun", 1380m),
            new("Jul", 1420m), new("Aug", 1460m), new("Sep", 1490m),
            new("Oct", 1520m), new("Nov", 1550m), new("Dec", 1580m),
        ],
        ["KOTAKBANK"] =
        [
            new("Jan", 1720m), new("Feb", 1740m), new("Mar", 1710m),
            new("Apr", 1730m), new("May", 1760m), new("Jun", 1780m),
            new("Jul", 1770m), new("Aug", 1790m), new("Sep", 1800m),
            new("Oct", 1810m), new("Nov", 1830m), new("Dec", 1820m),
        ],
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
