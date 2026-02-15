using System.ClientModel;
using Azure.AI.OpenAI;
using IdeaFactory.Api.Endpoints;
using IdeaFactory.Api.Middleware;
using IdeaFactory.Api.Services;
using Microsoft.Extensions.AI;
using OpenAI;

var builder = WebApplication.CreateBuilder(args);

// Aspire service defaults: health checks, telemetry, service discovery
builder.AddServiceDefaults();

// Redis cache via Aspire
builder.AddRedisClient("cache");

// Azure Table Storage via Aspire (Azurite in development)
builder.AddAzureTableServiceClient("tables");

// AI client configuration: GitHub Models (dev) or Azure OpenAI (prod)
builder.Services.AddChatClient(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var environment = sp.GetRequiredService<IHostEnvironment>();

    if (environment.IsDevelopment())
    {
        // GitHub Models: uses GITHUB_TOKEN and GitHub Models endpoint
        var githubToken = config["GITHUB_TOKEN"]
            ?? Environment.GetEnvironmentVariable("GITHUB_TOKEN")
            ?? throw new InvalidOperationException(
                "GITHUB_TOKEN is required for development AI. " +
                "Set it in user secrets or environment variables.");

        var client = new OpenAIClient(
            new ApiKeyCredential(githubToken),
            new OpenAIClientOptions
            {
                Endpoint = new Uri("https://models.inference.ai.azure.com")
            });

        return client.GetChatClient("gpt-4o-mini").AsIChatClient();
    }
    else
    {
        // Azure OpenAI for production
        var endpoint = config["AZURE_OPENAI_ENDPOINT"]
            ?? throw new InvalidOperationException("AZURE_OPENAI_ENDPOINT is required for production.");
        var key = config["AZURE_OPENAI_KEY"]
            ?? throw new InvalidOperationException("AZURE_OPENAI_KEY is required for production.");

        var client = new AzureOpenAIClient(
            new Uri(endpoint),
            new ApiKeyCredential(key));

        var modelName = config["AZURE_OPENAI_MODEL"] ?? "gpt-4o";
        return client.GetChatClient(modelName).AsIChatClient();
    }
});

// Application services
builder.Services.AddSingleton<IAuditService, TableStorageAuditService>();
builder.Services.AddSingleton<IAiInsightService, AiInsightService>();
builder.Services.AddSingleton<IMarketDataService, MarketDataService>();

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

// Aspire default endpoints: /health, /alive
app.MapDefaultEndpoints();

// CORS
app.UseCors();

// Prudence compliance middleware (wraps all AI endpoints)
app.UsePrudence();

// Map endpoint groups
app.MapInsightEndpoints();
app.MapMarketEndpoints();
app.MapGovernanceEndpoints();

app.Run();

// Make the implicit Program class public for WebApplicationFactory testing
public partial class Program { }
