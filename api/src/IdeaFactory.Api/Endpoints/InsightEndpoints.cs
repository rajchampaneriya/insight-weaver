using IdeaFactory.Api.Models;
using IdeaFactory.Api.Services;

namespace IdeaFactory.Api.Endpoints;

public static class InsightEndpoints
{
    public static RouteGroupBuilder MapInsightEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/insight")
            .WithTags("Insights");

        group.MapPost("/today", async (
            InsightRequest request,
            IAiInsightService aiService) =>
        {
            var content = await aiService.GenerateInsightAsync(
                request.Ticker, "today", request.Context);

            return Results.Ok(new InsightResponse(
                Ticker: request.Ticker,
                InsightType: "today",
                Content: content,
                Disclaimer: InsightResponse.StandardDisclaimer,
                GeneratedAt: DateTime.UtcNow,
                Sources: ["AI Analysis"]
            ));
        })
        .WithName("GetTodayView")
        .WithDescription("AI-generated daily view for a stock");

        group.MapPost("/brief", async (
            InsightRequest request,
            IAiInsightService aiService) =>
        {
            var content = await aiService.GenerateInsightAsync(
                request.Ticker, "brief", request.Context);

            return Results.Ok(new InsightResponse(
                Ticker: request.Ticker,
                InsightType: "brief",
                Content: content,
                Disclaimer: InsightResponse.StandardDisclaimer,
                GeneratedAt: DateTime.UtcNow,
                Sources: ["AI Analysis"]
            ));
        })
        .WithName("GetInsightBrief")
        .WithDescription("Peter Lynch-style investment research brief");

        group.MapPost("/explain", async (
            InsightRequest request,
            IAiInsightService aiService) =>
        {
            var content = await aiService.GenerateInsightAsync(
                request.Ticker, "explain", request.Context);

            return Results.Ok(new InsightResponse(
                Ticker: request.Ticker,
                InsightType: "explain",
                Content: content,
                Disclaimer: InsightResponse.StandardDisclaimer,
                GeneratedAt: DateTime.UtcNow,
                Sources: ["AI Analysis"]
            ));
        })
        .WithName("ExplainMovement")
        .WithDescription("AI explanation for unusual stock movement");

        return group;
    }
}
