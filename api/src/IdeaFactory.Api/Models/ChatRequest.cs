namespace IdeaFactory.Api.Models;

public record ChatRequest(
    string Question,
    string? Ticker = null
);

public record ChatResult(
    string Answer,
    string? Ticker,
    string Disclaimer,
    DateTime GeneratedAt
)
{
    public const string StandardDisclaimer =
        "This is AI-generated analysis for informational purposes only. " +
        "Not investment advice. Please consult a SEBI-registered investment " +
        "advisor before making any investment decisions.";
}
