using System.Text;
using GitHub.Copilot.SDK;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Logging;

namespace IdeaFactory.Api.Services;

// Adapter that implements Microsoft.Extensions.AI.IChatClient using the GitHub Copilot SDK.
// - Keeps the rest of the app unchanged (still depends on IChatClient)
// - Starts the Copilot CLI on demand (AutoStart=false) and surfaces a clear error if CLI isn't installed
public class CopilotChatClientAdapter : IChatClient, IDisposable
{
    private readonly CopilotClient _client;
    private readonly ILogger<CopilotChatClientAdapter> _logger;
    private readonly string _modelName;

    public CopilotChatClientAdapter(IConfiguration config, ILogger<CopilotChatClientAdapter> logger)
    {
        _logger = logger;
        _modelName = config["GITHUB_MODEL"] ?? "gpt-4.1";

        var githubToken = config["GITHUB_TOKEN"] ?? Environment.GetEnvironmentVariable("GITHUB_TOKEN");

        if (string.IsNullOrWhiteSpace(githubToken))
            throw new InvalidOperationException(
                "GITHUB_TOKEN is required. Set it in user secrets or environment variables.");

        var options = new CopilotClientOptions
        {
            GithubToken = githubToken,
            AutoStart = false // start on-demand to avoid failing app startup when CLI isn't present
        };

        _client = new CopilotClient(options);
        // NOTE: we deliberately do NOT call StartAsync() here so the app can start without the CLI installed.
        // The client will be started when the first request is made.
    }

    public ChatClientMetadata Metadata => new("copilot");

    public void Dispose()
    {
        try
        {
            _client.StopAsync().GetAwaiter().GetResult();
            _client.Dispose();
        }
        catch (Exception ex)
        {
            _logger.LogDebug(ex, "Copilot client stop failed during dispose");
        }
    }

    public async Task<ChatResponse> GetResponseAsync(
        IEnumerable<ChatMessage> chatMessages,
        ChatOptions? options = null,
        CancellationToken cancellationToken = default)
    {
        // Ensure the Copilot CLI is running (start on-demand). If start fails, surface a helpful error.
        try
        {
            if (_client.State != ConnectionState.Connected)
            {
                await _client.StartAsync(cancellationToken);
            }
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException(
                "Failed to start Copilot CLI. Ensure the `copilot` CLI is installed, available in PATH, and authenticated. See repository README.",
                ex);
        }

        var systemMessage = chatMessages.FirstOrDefault(m => m.Role == ChatRole.System)?.Text;
        var userContent = string.Join("\n", chatMessages.Where(m => m.Role != ChatRole.System).Select(m => m.Text));

        var sessionConfig = new SessionConfig
        {
            Model = _modelName,
            Streaming = false,
            SystemMessage = systemMessage is null
                ? null
                : new SystemMessageConfig { Mode = SystemMessageMode.Append, Content = systemMessage }
        };

        await using var session = await _client.CreateSessionAsync(sessionConfig);

        var sb = new StringBuilder();
        var done = new TaskCompletionSource<object?>();

        session.On(evt =>
        {
            switch (evt)
            {
                case AssistantMessageEvent msg:
                    if (!string.IsNullOrEmpty(msg.Data?.Content)) sb.Append(msg.Data.Content);
                    break;
                case SessionIdleEvent:
                    done.TrySetResult(null);
                    break;
            }
        });

        await session.SendAsync(new MessageOptions { Prompt = userContent ?? string.Empty });
        await done.Task;

        var responseText = sb.ToString();
        return new ChatResponse(new ChatMessage(ChatRole.Assistant, responseText));
    }

    public IAsyncEnumerable<ChatResponseUpdate> GetStreamingResponseAsync(
        IEnumerable<ChatMessage> chatMessages,
        ChatOptions? options = null,
        CancellationToken cancellationToken = default)
    {
        // Streaming not required by current code/tests — leave unimplemented for now.
        throw new NotImplementedException();
    }

    public object? GetService(Type serviceType, object? serviceKey = null) => null;
}
