using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;
using IdeaFactory.Api.Models;
using IdeaFactory.Api.Services;

namespace IdeaFactory.Api.Middleware;

public class PrudenceMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<PrudenceMiddleware> _logger;

    private static readonly HashSet<string> MonitoredPaths =
    [
        "/api/insight",
        "/api/chat",
        "/copilot"
    ];

    public PrudenceMiddleware(RequestDelegate next, ILogger<PrudenceMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, IAuditService auditService)
    {
        if (!ShouldMonitor(context.Request.Path))
        {
            await _next(context);
            return;
        }

        var stopwatch = Stopwatch.StartNew();
        var requestBody = await ReadRequestBody(context.Request);
        var promptHash = ComputeHash(requestBody);

        // Validate input against compliance rules
        var (isClean, violatedTerm) = ComplianceRules.ValidateInput(requestBody);
        if (!isClean)
        {
            _logger.LogWarning(
                "Prudence: Blocked request to {Path} due to forbidden term: {Term}",
                context.Request.Path, violatedTerm);

            stopwatch.Stop();

            var audit = ComplianceAudit.Create(
                requestPath: context.Request.Path,
                requestMethod: context.Request.Method,
                promptHash: promptHash,
                responseHash: string.Empty,
                policyResult: "BLOCKED",
                violationDetails: $"Forbidden term detected: {violatedTerm}",
                userAgent: context.Request.Headers.UserAgent,
                responseStatusCode: 422,
                durationMs: stopwatch.ElapsedMilliseconds);

            await auditService.RecordAuditAsync(audit);

            context.Response.StatusCode = 422;
            context.Response.ContentType = "application/json";
            context.Response.Headers.Append(
                ComplianceRules.SebiDisclaimerHeader,
                ComplianceRules.SebiDisclaimerValue);
            context.Response.Headers.Append(
                ComplianceRules.AuditTrailHeader,
                $"{audit.PartitionKey}/{audit.RowKey}");

            await context.Response.WriteAsJsonAsync(new
            {
                error = "compliance_violation",
                message = ComplianceRules.ComplianceViolationMessage,
                violatedTerm
            });
            return;
        }

        // Add SEBI compliance headers to all monitored responses
        context.Response.Headers.Append(
            ComplianceRules.SebiDisclaimerHeader,
            ComplianceRules.SebiDisclaimerValue);

        // Capture response body for audit
        var originalBodyStream = context.Response.Body;
        using var responseBodyStream = new MemoryStream();
        context.Response.Body = responseBodyStream;

        await _next(context);

        // Read response body for auditing
        responseBodyStream.Seek(0, SeekOrigin.Begin);
        var responseBody = await new StreamReader(responseBodyStream).ReadToEndAsync();
        var responseHash = ComputeHash(responseBody);

        // Validate output
        var (outputClean, violatedPattern) = ComplianceRules.ValidateOutput(responseBody);
        var policyResult = outputClean ? "PASS" : "OUTPUT_VIOLATION";

        if (!outputClean)
        {
            _logger.LogWarning(
                "Prudence: Response from {Path} contains forbidden pattern: {Pattern}",
                context.Request.Path, violatedPattern);
        }

        stopwatch.Stop();

        var auditRecord = ComplianceAudit.Create(
            requestPath: context.Request.Path,
            requestMethod: context.Request.Method,
            promptHash: promptHash,
            responseHash: responseHash,
            policyResult: policyResult,
            violationDetails: violatedPattern,
            userAgent: context.Request.Headers.UserAgent,
            responseStatusCode: context.Response.StatusCode,
            durationMs: stopwatch.ElapsedMilliseconds);

        context.Response.Headers.Append(
            ComplianceRules.AuditTrailHeader,
            $"{auditRecord.PartitionKey}/{auditRecord.RowKey}");

        await auditService.RecordAuditAsync(auditRecord);

        // Copy response back to original stream
        responseBodyStream.Seek(0, SeekOrigin.Begin);
        await responseBodyStream.CopyToAsync(originalBodyStream);
        context.Response.Body = originalBodyStream;
    }

    private static bool ShouldMonitor(PathString path)
    {
        return MonitoredPaths.Any(p =>
            path.StartsWithSegments(p, StringComparison.OrdinalIgnoreCase));
    }

    private static async Task<string> ReadRequestBody(HttpRequest request)
    {
        request.EnableBuffering();
        using var reader = new StreamReader(
            request.Body,
            Encoding.UTF8,
            detectEncodingFromByteOrderMarks: false,
            leaveOpen: true);
        var body = await reader.ReadToEndAsync();
        request.Body.Position = 0;
        return body;
    }

    private static string ComputeHash(string input)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }
}

public static class PrudenceMiddlewareExtensions
{
    public static IApplicationBuilder UsePrudence(this IApplicationBuilder app)
    {
        return app.UseMiddleware<PrudenceMiddleware>();
    }
}
