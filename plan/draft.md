**Technical Specification: The Idea Factory – Pilot #001 (Revised)**
**Architect:** Raj Champaneriya
**Status:** Blueprint Updated for Developer Velocity

---

### 1. Architect’s Narrative: The "GitHub-First" Shift

In the pursuit of "Innovation Velocity," we must eliminate friction. While Ollama is powerful, it requires hardware resources and local configuration that introduces environment drift. By pivoting to the **GitHub Copilot SDK** and **GitHub Models**, we align the development environment with the production Azure OpenAI service.

We are not just building a "chatbot"; we are building a **Smart Client**. The Architect (Raj) will use a custom **GitHub Copilot Extension** to validate the system directly within VS Code, while the Retail Trader uses the React Web UI. This dual-interface approach proves the system's flexibility.

### 2. High-Level Architecture (The Blueprint)

#### Logical Architecture Diagram

```mermaid
graph TD
    subgraph "Interfaces"
        A[Retail Trader] --> B[React + IBM Carbon UI]
        C[Tech Validator (Raj)] --> D[VS Code + Copilot Extension]
    end

    subgraph "Gateway & Orchestration (.NET 10)"
        B --> E{Azure Container Apps}
        D --> E
        E --> F[Prudence Middleware]
    end

    subgraph "AI & Data Layer"
        F --> G[GitHub Models / Azure OpenAI]
        F --> H[Azure AI Search]
        F --> I[Azure Doc Intelligence]
    end
```

---

### 3. Detailed Technical Design

#### 3.1. AI Strategy: GitHub Copilot SDK & Models
We are replacing the local Ollama container with **GitHub Models**. This allows us to use the same LLMs (GPT-4o, Llama 3) in development that we use in production, but accessible via the GitHub Copilot SDK.

*   **Development Phase:** The .NET 10 backend uses the `Microsoft.Extensions.AI` abstraction layer. We point it to the **GitHub Models** endpoint using a GitHub Token.
*   **Production Phase:** We switch the configuration to **Azure OpenAI**.
*   **Benefit:** Zero infrastructure overhead for local AI. No Docker container eating RAM. This aligns with the "Idea Factory" goal of rapid prototyping.

#### 3.2. Backend: The .NET 10 Orchestration Layer
We utilize the **GitHub Copilot SDK** to build a custom extension. This serves the "Technical Validator" persona.

*   **Copilot Extension:** A .NET 10 Webhook endpoint that receives prompts from VS Code.
*   **Prudence Middleware:** Reused across both the Web UI and the Copilot Extension to ensure SEBI compliance.

#### 3.3. Frontend: The Insight Surface (React + IBM Carbon)
The React frontend remains the primary interface for the Retail Trader. It communicates with the same .NET 10 backend.

*   **Tech Stack:** React 18, IBM Carbon Components, Vite.
*   **Visualization:** Carbon Charts for price/time-series data.

#### 3.4. Infrastructure: Docker Based Emulators (Revised)
We removed Ollama. Our Docker Compose now focuses solely on Azure emulation, keeping the footprint light.

*   **Azurite:** For Storage & Queues.
*   **Redis:** For caching.

---

### 4. Code Artifacts & Implementation

#### A. The Unified AI Client (.NET 10)
This code snippet demonstrates how we use `Microsoft.Extensions.AI` to switch between **GitHub Models** (Dev) and **Azure OpenAI** (Prod) seamlessly.

```csharp
// Program.cs - Configuring the AI Client
using Microsoft.Extensions.AI;

var builder = WebApplication.CreateBuilder(args);

// "Idea Factory" Configuration: Switch AI provider based on Environment
if (builder.Environment.IsDevelopment())
{
    // Use GitHub Models (Copilot SDK backend) for local dev
    // Requires GITHUB_TOKEN environment variable
    builder.Services.AddChatClient(new GitHubChatClient(
        new Uri("https://models.inference.ai.azure.com"),
        Environment.GetEnvironmentVariable("GITHUB_TOKEN"),
        "gpt-4o-mini" // Using the same model as prod for fidelity
    ));
}
else
{
    // Use Azure OpenAI for Production (PRD Requirement 1.6)
    builder.Services.AddChatClient(new AzureOpenAIClient(
        new Uri(builder.Configuration["AzureOpenAI:Endpoint"]),
        new DefaultAzureCredential(),
        "gpt-4o-mini"
    ));
}

// Add the Prudence Middleware (The Governance Layer)
builder.Services.AddTransient<PrudenceMiddleware>();

var app = builder.Build();

// Pipeline: Prudence -> AI Endpoint
app.UseMiddleware<PrudenceMiddleware>();
app.MapPost("/api/insight", async (ChatRequest request, IChatClient client) =>
{
    var response = await client.CompleteAsync(request.Prompt);
    return response.Message;
});

app.Run();
```

#### B. Docker Compose for Velocity
We have removed the heavy Ollama container. The Docker setup is now purely for Azure emulation, ensuring the "Time to Evidence" is minimized.

```yaml
# docker-compose.yml
version: '3.8'
services:
  # API remains the core component
  api:
    image: mcr.microsoft.com/dotnet/nightly/aspnet:10.0-preview
    build:
      context: .
      dockerfile: src/IdeaFactory.Api/Dockerfile
    ports:
      - "5000:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - GITHUB_TOKEN=${GITHUB_TOKEN} # Passed from host machine
      - AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;BlobEndpoint=http://azurite:10000/devstoreaccount1;
    depends_on:
      - azurite

  # Emulator for Azure Storage
  azurite:
    image: mcr.microsoft.com/azure-storage/azurite
    ports:
      - "10000:10000"
      - "10001:10001"

  # Redis for caching
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

#### C. GitHub Copilot Extension Integration
To serve the "Technical Validator" persona (Raj), we expose the backend as a Copilot Skill. This allows Raj to ask questions directly in VS Code.

```csharp
// CopilotExtensionController.cs
[ApiController]
[Route("copilot")]
public class CopilotExtensionController : ControllerBase
{
    private readonly IChatClient _chatClient;

    public CopilotExtensionController(IChatClient chatClient)
    {
        _chatClient = chatClient;
    }

    [HttpPost("resolve")]
    public async Task<IActionResult> Resolve([FromBody] CopilotRequest request)
    {
        // The prompt from VS Code Copilot Chat
        var userPrompt = request.Messages.Last().Content;

        // Enforce Prudence (Compliance) even in internal tools
        if (ContainsForbiddenTerms(userPrompt))
            return Ok(new { choices = new[] { new { message = new { content = "Request violates governance policy: No investment advice." } } } });

        // Call the AI Layer
        var result = await _chatClient.CompleteAsync(userPrompt);
        
        // Return in GitHub Copilot format
        return Ok(new { choices = new[] { new { message = new { content = result.Message.Content } } } });
    }
}
```

---

### 5. Addressing the PRD Goals

| PRD Goal | Solution with GitHub Copilot SDK |
| :--- | :--- |
| **Innovation Velocity** | Replacing Ollama with **GitHub Models** removes the need for local GPU setup. Developers can start coding AI features immediately using their existing GitHub credentials. |
| **Prudence** | The `PrudenceMiddleware` is injected into the pipeline for both the **Web UI** and the **Copilot Extension**, ensuring compliance is enforced regardless of the interface. |
| **Efficiency** | By using `Microsoft.Extensions.AI`, the code is abstract. We can swap models without rewriting business logic. |

### 6. Conclusion

This revised design elevates the "Idea Factory" from a simple web app to a **platform**. By integrating the **GitHub Copilot SDK**, Raj Champaneriya demonstrates a deep understanding of the modern developer workflow. We are not just building a tool for end-users; we are building a **Copilot Partner** for the enterprise architect, allowing them to validate "What changed today?" directly within their IDE, while the Retail Trader enjoys the polished IBM Carbon UI. This is the definition of delivering promises through architecture.