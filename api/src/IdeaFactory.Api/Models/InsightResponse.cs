namespace IdeaFactory.Api.Models;

public record InsightResponse(
    string Ticker,
    string InsightType,
    string Content,
    string Disclaimer,
    DateTime GeneratedAt,
    string[] Sources
)
{
    public const string StandardDisclaimer =
        "This is AI-generated analysis for informational purposes only. " +
        "Not investment advice. Please consult a SEBI-registered investment " +
        "advisor before making any investment decisions.";
}
