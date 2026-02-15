using Microsoft.Extensions.AI;

namespace IdeaFactory.Api.Services;

public interface IAiInsightService
{
    Task<string> GenerateInsightAsync(string ticker, string insightType, string? context = null, CancellationToken cancellationToken = default);
}

public class AiInsightService : IAiInsightService
{
    private readonly IChatClient _chatClient;
    private readonly ILogger<AiInsightService> _logger;

    public AiInsightService(IChatClient chatClient, ILogger<AiInsightService> logger)
    {
        _chatClient = chatClient;
        _logger = logger;
    }

    public async Task<string> GenerateInsightAsync(
        string ticker,
        string insightType,
        string? context = null,
        CancellationToken cancellationToken = default)
    {
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
            for Indian equities (NSE/BSE). Structure your response in exactly 4 sections:

            1. **The Story**: What does this company do? Why might it be interesting to study?
            2. **The Numbers**: Key financial metrics (revenue, earnings, margins, debt ratios)
            3. **The Moat**: Competitive advantages or lack thereof
            4. **The Risks**: Key risks and concerns an investor should be aware of

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
}
