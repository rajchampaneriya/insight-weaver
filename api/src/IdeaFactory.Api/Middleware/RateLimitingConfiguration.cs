using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

namespace IdeaFactory.Api.Middleware;

public static class RateLimitingConfiguration
{
    public const string AiEndpointPolicy = "ai-endpoint";
    public const string DefaultPolicy = "default";

    public static IServiceCollection AddApiRateLimiting(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            // Stricter rate limit for AI endpoints (expensive operations)
            options.AddFixedWindowLimiter(AiEndpointPolicy, limiter =>
            {
                limiter.PermitLimit = 10;
                limiter.Window = TimeSpan.FromMinutes(1);
                limiter.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                limiter.QueueLimit = 5;
            });

            // General rate limit for all other endpoints
            options.AddFixedWindowLimiter(DefaultPolicy, limiter =>
            {
                limiter.PermitLimit = 60;
                limiter.Window = TimeSpan.FromMinutes(1);
                limiter.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                limiter.QueueLimit = 10;
            });

            // Global concurrent request limiter
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 120,
                        Window = TimeSpan.FromMinutes(1)
                    }));

            options.OnRejected = async (context, cancellationToken) =>
            {
                context.HttpContext.Response.ContentType = "application/json";
                await context.HttpContext.Response.WriteAsJsonAsync(new
                {
                    error = "rate_limit_exceeded",
                    message = "Too many requests. Please try again later.",
                    retryAfter = context.Lease.TryGetMetadata(
                        MetadataName.RetryAfter, out var retryAfter)
                        ? retryAfter.TotalSeconds
                        : 60
                }, cancellationToken);
            };
        });

        return services;
    }
}
