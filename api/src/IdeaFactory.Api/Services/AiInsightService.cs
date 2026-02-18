using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.AI;
using StackExchange.Redis;

namespace IdeaFactory.Api.Services;

public interface IAiInsightService
{
    Task<string> GenerateInsightAsync(string ticker, string insightType, string? context = null, CancellationToken cancellationToken = default);
    Task<string> ChatAsync(string question, string? ticker = null, CancellationToken cancellationToken = default);
}

public class AiInsightService : IAiInsightService
{
    private readonly IChatClient _chatClient;
    private readonly IConnectionMultiplexer _redis;
    private readonly ILogger<AiInsightService> _logger;
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(15);

    public AiInsightService(
        IChatClient chatClient,
        IConnectionMultiplexer redis,
        ILogger<AiInsightService> logger)
    {
        _chatClient = chatClient;
        _redis = redis;
        _logger = logger;
    }

    public async Task<string> GenerateInsightAsync(
        string ticker,
        string insightType,
        string? context = null,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = BuildCacheKey(ticker, insightType, context);
        var cached = await GetCachedAsync(cacheKey);
        if (cached is not null)
        {
            _logger.LogInformation(
                "Cache hit for {InsightType} insight on {Ticker}",
                insightType, ticker);
            return cached;
        }

        var systemPrompt = GetSystemPrompt(insightType);
        var userPrompt = BuildUserPrompt(ticker, insightType, context);

        _logger.LogInformation(
            "Generating {InsightType} insight for {Ticker}",
            insightType, ticker);

        var messages = new List<ChatMessage>
        {
            new(ChatRole.System, systemPrompt),
            new(ChatRole.User, userPrompt)
        };

        var response = await _chatClient.GetResponseAsync(
            messages,
            cancellationToken: cancellationToken);

        var result = response.Text ?? string.Empty;
        await SetCacheAsync(cacheKey, result);
        return result;
    }

    public async Task<string> ChatAsync(
        string question,
        string? ticker = null,
        CancellationToken cancellationToken = default)
    {
        var systemPrompt = GetSystemPrompt("chat");
        var userPrompt = ticker is not null
            ? $"Regarding {ticker} on Indian exchanges (NSE/BSE): {question}"
            : question;

        _logger.LogInformation("Chat query: {Question}", question);

        var messages = new List<ChatMessage>
        {
            new(ChatRole.System, systemPrompt),
            new(ChatRole.User, userPrompt)
        };

        var response = await _chatClient.GetResponseAsync(
            messages,
            cancellationToken: cancellationToken);

        return response.Text ?? string.Empty;
    }

    private static string GetSystemPrompt(string insightType) => insightType switch
    {
        "today" => """
            You are a financial research analyst specializing in Indian equities (NSE/BSE).
            Your role is to provide a concise daily view of a stock's activity.
            Focus on factual observations: price movement, volume changes, sector trends,
            and any notable corporate actions or news.

            STRICT RULES:
            - NEVER provide buy, sell, or hold recommendations
            - NEVER suggest target prices or stop losses
            - NEVER use phrases like "you should invest" or "I recommend"
            - Always state that this is for informational purposes only
            - All monetary values must be in INR
            - Reference NSE/BSE exchanges only
            - End every response with the disclaimer: "This is AI-generated analysis for informational purposes only. Not investment advice."
            """,

        "brief" => """
            You are a financial research analyst creating a Peter Lynch-style investment brief
            for Indian equities (NSE/BSE). Structure your response in exactly 4 sections using
            the EXACT headings shown below (including the double asterisks):

            **The Story**
            What does this company do? Why might it be interesting to study?

            **The Numbers**
            Key financial metrics (revenue, earnings, margins, debt ratios)

            **The Moat**
            Competitive advantages or lack thereof

            **The Risks**
            Key risks and concerns an investor should be aware of

            FORMATTING RULES:
            - Use EXACTLY these four headings: **The Story**, **The Numbers**, **The Moat**, **The Risks**
            - Place each heading on its own line followed by a newline
            - Do NOT use markdown heading syntax (# or ##), use bold (**) only
            - Do NOT number the sections
            - Write 2-4 paragraphs per section

            STRICT RULES:
            - NEVER provide buy, sell, or hold recommendations
            - NEVER suggest target prices
            - Present facts and analysis, let the reader form their own conclusions
            - All monetary values must be in INR
            - Reference NSE/BSE exchanges only
            - End every response with the disclaimer: "This is AI-generated analysis for informational purposes only. Not investment advice."
            """,

        "explain" => """
            You are a financial research analyst explaining unusual market movements
            in Indian equities (NSE/BSE). When a stock shows unusual price or volume
            activity, provide possible explanations based on available information.

            STRICT RULES:
            - NEVER provide buy, sell, or hold recommendations
            - Present multiple possible explanations when uncertain
            - Clearly distinguish between confirmed facts and speculation
            - All monetary values must be in INR
            - Reference NSE/BSE exchanges only
            - End every response with the disclaimer: "This is AI-generated analysis for informational purposes only. Not investment advice."
            """,

        "chat" => """
            You are a financial research assistant specializing in Indian equities (NSE/BSE).
            Answer questions about stocks, market trends, earnings, and corporate actions.
            Provide factual, well-sourced analysis. Cite specific data points when available.

            STRICT RULES:
            - NEVER provide buy, sell, or hold recommendations
            - NEVER suggest target prices or stop losses
            - NEVER use phrases like "you should invest" or "I recommend"
            - Always state that this is for informational purposes only
            - All monetary values must be in INR
            - Reference NSE/BSE exchanges only
            - Be concise but thorough
            - End every response with the disclaimer: "This is AI-generated analysis for informational purposes only. Not investment advice."
            """,

        _ => """
            You are a financial research analyst specializing in Indian equities (NSE/BSE).
            Provide factual, well-researched analysis. Never provide investment recommendations.
            All monetary values in INR. End every response with: "This is AI-generated analysis for informational purposes only. Not investment advice."
            """
    };

    private static string BuildUserPrompt(string ticker, string insightType, string? context) =>
        insightType switch
        {
            "today" => $"Provide today's view for {ticker} on the Indian stock market (NSE/BSE).",
            "brief" => $"Create a Peter Lynch-style investment research brief for {ticker} listed on Indian exchanges (NSE/BSE).",
            "explain" => $"Explain the unusual movement for {ticker} on Indian exchanges. Context: {context ?? "No additional context provided."}",
            _ => $"Analyze {ticker} on the Indian stock market. {context ?? ""}"
        };

    private static string BuildCacheKey(string ticker, string insightType, string? context)
    {
        var raw = $"insight:{insightType}:{ticker}:{context ?? ""}";
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(raw));
        return $"insight:{insightType}:{ticker}:{Convert.ToHexString(hash)[..16]}";
    }

    private async Task<string?> GetCachedAsync(string key)
    {
        try
        {
            var db = _redis.GetDatabase();
            var value = await db.StringGetAsync(key);
            return value.HasValue ? value.ToString() : null;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Redis cache read failed for key {Key}", key);
            return null;
        }
    }

    private async Task SetCacheAsync(string key, string value)
    {
        try
        {
            var db = _redis.GetDatabase();
            await db.StringSetAsync(key, value, CacheTtl);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Redis cache write failed for key {Key}", key);
        }
    }
}
