namespace IdeaFactory.Api.Services;

public interface ICopilotSkillRouter
{
    (string InsightType, string Ticker, string? Context) RouteIntent(string prompt);
}

public class CopilotSkillRouter : ICopilotSkillRouter
{
    private static readonly string[] TodayKeywords =
        ["today", "changed", "what happened", "daily", "movement", "update"];

    private static readonly string[] BriefKeywords =
        ["brief", "analysis", "research", "overview", "tell me about", "summary", "explore"];

    private static readonly string[] ExplainKeywords =
        ["explain", "why", "unusual", "anomaly", "spike", "crash", "drop", "surge", "reason"];

    private static readonly string[] KnownTickers =
        ["RELIANCE", "TCS", "HDFCBANK", "INFY", "TATAMOTORS", "ADANIENT",
         "SUNPHARMA", "WIPRO", "ICICIBANK", "HINDUNILVR", "BHARTIARTL", "KOTAKBANK"];

    public (string InsightType, string Ticker, string? Context) RouteIntent(string prompt)
    {
        var ticker = ExtractTicker(prompt);
        var insightType = ClassifyIntent(prompt);
        return (insightType, ticker, prompt);
    }

    private static string ClassifyIntent(string prompt)
    {
        var lower = prompt.ToLowerInvariant();

        if (ExplainKeywords.Any(k => lower.Contains(k)))
            return "explain";

        if (TodayKeywords.Any(k => lower.Contains(k)))
            return "today";

        if (BriefKeywords.Any(k => lower.Contains(k)))
            return "brief";

        // Default to chat for free-form questions
        return "chat";
    }

    private static string ExtractTicker(string prompt)
    {
        var upper = prompt.ToUpperInvariant();

        foreach (var ticker in KnownTickers)
        {
            if (upper.Contains(ticker))
                return ticker;
        }

        // Fallback: look for all-caps words that might be tickers
        var words = prompt.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        foreach (var word in words)
        {
            var cleaned = word.Trim('?', '.', ',', '!', '"', '\'');
            if (cleaned.Length >= 2 && cleaned.Length <= 15 && cleaned == cleaned.ToUpperInvariant()
                && cleaned.All(c => char.IsLetter(c)))
            {
                return cleaned;
            }
        }

        return "NIFTY";
    }
}
