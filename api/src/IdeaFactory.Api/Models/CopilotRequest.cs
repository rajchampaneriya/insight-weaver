namespace IdeaFactory.Api.Models;

public record CopilotRequest(
    string Prompt,
    string? Skill = null
);

public record CopilotResponse(
    string Content,
    string InsightType,
    string Ticker,
    string Disclaimer,
    DateTime GeneratedAt
)
{
    public const string StandardDisclaimer =
        "This is AI-generated analysis for informational purposes only. " +
        "Not investment advice. Please consult a SEBI-registered investment " +
        "advisor before making any investment decisions.";
}
