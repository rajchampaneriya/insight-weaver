using IdeaFactory.Api.Middleware;

namespace IdeaFactory.Api.Tests;

public class ComplianceRulesTests
{
    [Theory]
    [InlineData("What is the price of RELIANCE?", true)]
    [InlineData("Tell me about TCS financials", true)]
    [InlineData("How did INFY perform this quarter?", true)]
    [InlineData("Explain the unusual volume in HDFC", true)]
    [InlineData("What sectors are trending today?", true)]
    public void ValidateInput_CleanPrompts_ShouldPass(string input, bool expectedClean)
    {
        var (isClean, violatedTerm) = ComplianceRules.ValidateInput(input);

        Assert.Equal(expectedClean, isClean);
        Assert.Null(violatedTerm);
    }

    [Theory]
    [InlineData("Should I buy RELIANCE?", "buy")]
    [InlineData("Is it time to sell TCS?", "sell")]
    [InlineData("Should I hold INFY?", "hold")]
    [InlineData("What is the target price for HDFC?", "target price")]
    [InlineData("Set a stop loss at 2500", "stop loss")]
    [InlineData("Is RELIANCE a multibagger?", "multibagger")]
    [InlineData("Give me a guaranteed return stock", "guaranteed return")]
    [InlineData("Which stock should I accumulate?", "accumulate")]
    public void ValidateInput_ForbiddenTerms_ShouldBlock(string input, string expectedTerm)
    {
        var (isClean, violatedTerm) = ComplianceRules.ValidateInput(input);

        Assert.False(isClean);
        Assert.Equal(expectedTerm, violatedTerm);
    }

    [Theory]
    [InlineData("RELIANCE showed strong buying interest today")]
    [InlineData("The stock is being held by institutional investors")]
    public void ValidateInput_ForbiddenTermsInContext_ShouldNotFalsePositive(string input)
    {
        // "buying" should not match "buy" (whole-word matching)
        // "held" should not match "hold"
        var (isClean, _) = ComplianceRules.ValidateInput(input);

        Assert.True(isClean);
    }

    [Theory]
    [InlineData("The stock price moved up 5%. This is AI-generated analysis.", true)]
    [InlineData("Revenue grew 12% YoY. Not investment advice.", true)]
    public void ValidateOutput_CleanResponses_ShouldPass(string output, bool expectedClean)
    {
        var (isClean, violatedPattern) = ComplianceRules.ValidateOutput(output);

        Assert.Equal(expectedClean, isClean);
        Assert.Null(violatedPattern);
    }

    [Theory]
    [InlineData("You should buy this stock immediately", "you should buy")]
    [InlineData("I recommend investing in RELIANCE", "i recommend")]
    [InlineData("We recommend this stock for long term", "we recommend")]
    [InlineData("This is a guaranteed profit opportunity", "guaranteed")]
    [InlineData("This is a risk-free investment", "risk-free")]
    public void ValidateOutput_ForbiddenPatterns_ShouldBlock(string output, string expectedPattern)
    {
        var (isClean, violatedPattern) = ComplianceRules.ValidateOutput(output);

        Assert.False(isClean);
        Assert.Equal(expectedPattern, violatedPattern);
    }

    [Fact]
    public void ComplianceViolationMessage_ShouldMentionSebi()
    {
        Assert.Contains("SEBI", ComplianceRules.ComplianceViolationMessage);
    }

    [Fact]
    public void ForbiddenTerms_ShouldNotBeEmpty()
    {
        Assert.NotEmpty(ComplianceRules.ForbiddenTerms);
    }

    [Fact]
    public void ForbiddenResponsePatterns_ShouldNotBeEmpty()
    {
        Assert.NotEmpty(ComplianceRules.ForbiddenResponsePatterns);
    }
}
