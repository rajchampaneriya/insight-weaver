namespace IdeaFactory.Api.Models;

public record InsightRequest(
    string Ticker,
    string? Context = null,
    string? Question = null
);
