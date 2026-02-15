namespace IdeaFactory.Api.Middleware;

public static class ComplianceRules
{
    public static readonly string[] ForbiddenTerms =
    [
        "buy",
        "sell",
        "hold",
        "strong buy",
        "strong sell",
        "outperform",
        "underperform",
        "overweight",
        "underweight",
        "target price",
        "price target",
        "stop loss",
        "guaranteed return",
        "sure shot",
        "multibagger",
        "wealth creator",
        "subscribe",
        "accumulate"
    ];

    public static readonly string[] ForbiddenResponsePatterns =
    [
        "you should buy",
        "you should sell",
        "i recommend",
        "we recommend",
        "my recommendation",
        "invest in",
        "guaranteed",
        "risk-free",
        "sure profit"
    ];

    public const string ComplianceViolationMessage =
        "This request contains terms that may constitute investment advice, " +
        "which is outside the scope of this system. This platform provides " +
        "AI-generated analysis for informational purposes only. " +
        "Please consult a SEBI-registered investment advisor for " +
        "personalized investment recommendations.";

    public const string SebiDisclaimerHeader = "X-SEBI-Disclaimer";
    public const string SebiDisclaimerValue =
        "Not investment advice. For informational purposes only.";

    public const string AuditTrailHeader = "X-Compliance-Audit";

    public static (bool IsClean, string? ViolatedTerm) ValidateInput(string input)
    {
        var lowerInput = input.ToLowerInvariant();

        foreach (var term in ForbiddenTerms)
        {
            if (ContainsWholeWord(lowerInput, term))
            {
                return (false, term);
            }
        }

        return (true, null);
    }

    public static (bool IsClean, string? ViolatedPattern) ValidateOutput(string output)
    {
        var lowerOutput = output.ToLowerInvariant();

        foreach (var pattern in ForbiddenResponsePatterns)
        {
            if (lowerOutput.Contains(pattern, StringComparison.OrdinalIgnoreCase))
            {
                return (false, pattern);
            }
        }

        return (true, null);
    }

    private static bool ContainsWholeWord(string text, string word)
    {
        var index = text.IndexOf(word, StringComparison.OrdinalIgnoreCase);
        while (index >= 0)
        {
            var before = index == 0 || !char.IsLetterOrDigit(text[index - 1]);
            var afterIndex = index + word.Length;
            var after = afterIndex >= text.Length || !char.IsLetterOrDigit(text[afterIndex]);

            if (before && after)
                return true;

            index = text.IndexOf(word, index + 1, StringComparison.OrdinalIgnoreCase);
        }

        return false;
    }
}
