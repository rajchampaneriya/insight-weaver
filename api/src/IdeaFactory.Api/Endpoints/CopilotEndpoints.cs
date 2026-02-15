using IdeaFactory.Api.Middleware;
using IdeaFactory.Api.Models;
using IdeaFactory.Api.Services;

namespace IdeaFactory.Api.Endpoints;

public static class CopilotEndpoints
{
    public static RouteGroupBuilder MapCopilotEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/copilot")
            .WithTags("Copilot Extension")
            .RequireRateLimiting(RateLimitingConfiguration.AiEndpointPolicy);

        group.MapPost("/resolve", async (
            CopilotRequest request,
            ICopilotSkillRouter router,
            IAiInsightService aiService) =>
        {
            var (insightType, ticker, context) = router.RouteIntent(request.Prompt);

            string content;
            if (insightType == "chat")
            {
                content = await aiService.ChatAsync(request.Prompt, ticker);
            }
            else
            {
                content = await aiService.GenerateInsightAsync(ticker, insightType, context);
            }

            return Results.Ok(new CopilotResponse(
                Content: content,
                InsightType: insightType,
                Ticker: ticker,
                Disclaimer: CopilotResponse.StandardDisclaimer,
                GeneratedAt: DateTime.UtcNow
            ));
        })
        .WithName("ResolveCopilotQuery")
        .WithDescription("Resolve a Copilot Extension query with skill routing");

        group.MapGet("/skills", () =>
        {
            return Results.Ok(new
            {
                skills = new[]
                {
                    new { name = "today", description = "Get today's view for a stock (price, volume, sector context)" },
                    new { name = "brief", description = "Get a Peter Lynch-style investment research brief" },
                    new { name = "explain", description = "Explain unusual price/volume movement for a stock" },
                    new { name = "chat", description = "Free-form questions about Indian equities" }
                },
                tickers = new[] { "RELIANCE", "TCS", "HDFCBANK", "INFY", "TATAMOTORS", "ADANIENT",
                    "SUNPHARMA", "WIPRO", "ICICIBANK", "HINDUNILVR", "BHARTIARTL", "KOTAKBANK" }
            });
        })
        .WithName("ListCopilotSkills")
        .WithDescription("List available Copilot Extension skills and supported tickers");

        return group;
    }
}
