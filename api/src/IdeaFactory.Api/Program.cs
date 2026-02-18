using IdeaFactory.Api.Endpoints;
using IdeaFactory.Api.Middleware;
using IdeaFactory.Api.Services;
using Microsoft.Extensions.AI;

var builder = WebApplication.CreateBuilder(args);

// Aspire service defaults: health checks, telemetry, service discovery
builder.AddServiceDefaults();

// Redis cache via Aspire
builder.AddRedisClient("cache");

// Azure Table Storage via Aspire (Azurite in development)
builder.AddAzureTableServiceClient("tables");

// AI client: GitHub Copilot SDK adapter (implements IChatClient)
// Token check happens in CopilotChatClientAdapter constructor
builder.Services.AddSingleton<IChatClient, CopilotChatClientAdapter>();

// Application services
builder.Services.AddSingleton<IAuditService, TableStorageAuditService>();
builder.Services.AddSingleton<IFallbackInsightProvider, FallbackInsightProvider>();
builder.Services.AddSingleton<IAiInsightService, AiInsightService>();
builder.Services.AddSingleton<IMarketDataService, MarketDataService>();
builder.Services.AddSingleton<ICopilotSkillRouter, CopilotSkillRouter>();

// Rate limiting for AI endpoints
builder.Services.AddApiRateLimiting();

// CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                "http://localhost:8080",
                "http://localhost:5173",
                "http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Initialize Table Storage table
using (var scope = app.Services.CreateScope())
{
    var auditService = scope.ServiceProvider.GetRequiredService<IAuditService>();
    if (auditService is TableStorageAuditService tableAuditService)
    {
        await tableAuditService.InitializeAsync();
    }
}

// Pre-seed Redis cache with fallback AI responses for demo tickers
using (var scope = app.Services.CreateScope())
{
    var aiService = scope.ServiceProvider.GetRequiredService<IAiInsightService>();
    if (aiService is AiInsightService concreteAiService)
    {
        await concreteAiService.SeedFallbackCacheAsync();
    }
}

// Aspire default endpoints: /health, /alive
app.MapDefaultEndpoints();

// CORS
app.UseCors();

// Rate limiting
app.UseRateLimiter();

// Prudence compliance middleware (wraps all AI endpoints)
app.UsePrudence();

// Map endpoint groups
app.MapInsightEndpoints();
app.MapMarketEndpoints();
app.MapGovernanceEndpoints();
app.MapCopilotEndpoints();

app.Run();

// Make the implicit Program class public for WebApplicationFactory testing
public partial class Program { }
