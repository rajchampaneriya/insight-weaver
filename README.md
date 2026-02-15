# Insight Weaver -- AI Insights for Indian Equities

AI-driven research platform for Indian equities (NSE/BSE). .NET 10 backend with React 18 frontend, orchestrated by .NET Aspire.

## Architecture

```
.NET Aspire AppHost (Orchestrator)
+------------------+    +-------------------------------+
| React Frontend   |--->| .NET 10 Minimal API           |
| (Vite + Carbon)  |    | - Insight Endpoints           |
| Port 8080        |    | - Market Data Endpoints       |
+------------------+    | - Copilot Extension Webhook   |
                        | - Prudence Compliance Layer   |
                        +-------------------------------+
                             |          |          |
                        +----+    +-----+    +-----+
                        |         |          |
                   GitHub      Azurite     Redis
                   Copilot SDK (Storage)   (Cache)
                   (AI)        (Emulator)  (Emulator)
```

| Layer | Technology |
|---|---|
| Orchestration | .NET Aspire 10 |
| Backend | .NET 10 Minimal API + Microsoft.Extensions.AI |
| Frontend | React 18 + TypeScript + Vite |
| AI | GitHub Copilot SDK (gpt-4.1) |
| Cache | Redis via Aspire |
| Storage | Azure Table Storage (Azurite emulator in dev) |
| Compliance | Prudence Middleware (SEBI-compliant audit trail) |

## Status

| Phase | Description | Status |
|---|---|---|
| 0 | Foundation (Aspire, AI wiring) | Done |
| 1 | Prudence Layer (compliance middleware) | Done |
| 2 | AI Insight Endpoints | Done |
| 3 | Frontend (Carbon migration) | Done |
| 4 | API Integration (React Query hooks) | Done |
| 5 | Copilot Extension (VS Code webhook) | Done |
| 6 | Hardening (tests, rate limiting, docs) | Done |

## Quickstart

### Prerequisites

- .NET 10 SDK (pinned in `api/global.json`)
- Docker Desktop (for Aspire-managed emulators: Redis, Azurite)
- Node.js 18+ and npm
- **GitHub Copilot CLI** installed and authenticated ([Installation guide](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli))
- `GITHUB_TOKEN` environment variable or user secret

### One-command launch (full stack via Aspire)

```bash
dotnet run --project api/src/IdeaFactory.AppHost
```

This starts:
- .NET API on `http://localhost:5000`
- React UI on `http://localhost:8080`
- Redis cache (Aspire-managed container)
- Azurite storage emulator (Aspire-managed container)
- Aspire Dashboard for observability

### Manual launch (frontend only)

```bash
cd ui && npm install && npm run dev
```

### Health check

```bash
curl http://localhost:5000/health
```

## API Endpoints

### Market Data

| Method | Path | Description |
|---|---|---|
| GET | `/api/market/indices` | Market indices and sector performance |
| GET | `/api/market/movers` | Stocks with unusual price/volume activity |
| GET | `/api/market/stock/{ticker}` | Detailed stock data with earnings and price history |
| GET | `/api/market/news` | News feed (optional `?ticker=` filter) |
| GET | `/api/market/search?q=` | Search stocks by ticker, name, or sector |

### AI Insights

| Method | Path | Description |
|---|---|---|
| POST | `/api/insight/today` | AI-generated daily view for a stock |
| POST | `/api/insight/brief` | Peter Lynch-style investment research brief |
| POST | `/api/insight/explain` | Explanation of unusual stock movement |
| POST | `/api/insight/chat` | Free-form conversational AI |

### Copilot Extension

| Method | Path | Description |
|---|---|---|
| POST | `/copilot/resolve` | Resolve a Copilot query with skill routing |
| GET | `/copilot/skills` | List available skills and tickers |

### Governance

| Method | Path | Description |
|---|---|---|
| GET | `/api/governance/report` | Compliance audit summary |
| GET | `/api/governance/audits` | Raw audit records |

## Running Tests

```bash
# Backend tests (xUnit + WebApplicationFactory)
cd api && dotnet test

# Frontend tests (Vitest)
cd ui && npm test
```

## Compliance

- All AI responses include: "Not investment advice. Please consult a SEBI-registered investment advisor."
- Prompts containing buy/sell/hold recommendations are blocked (HTTP 422)
- Every AI request/response is audited to Azure Table Storage
- Rate limiting protects AI endpoints (10 requests/min per policy)
- Output validation scans AI responses for forbidden advisory patterns

## Project Structure

```
insight-weaver/
  api/
    src/
      IdeaFactory.AppHost/       # .NET Aspire orchestrator (API + UI + emulators)
      IdeaFactory.Api/           # .NET 10 Minimal API
        Endpoints/               # Insight, Market, Copilot, Governance
        Middleware/              # PrudenceMiddleware, RateLimiting, ComplianceRules
        Services/                # AiInsightService, MarketDataService, CopilotSkillRouter
        Models/                  # Request/Response DTOs
      IdeaFactory.ServiceDefaults/  # Aspire defaults (OpenTelemetry, health checks)
    tests/
      IdeaFactory.Api.Tests/     # Integration tests
  ui/
    src/
      components/                # React components (dashboard, layout, assistant)
      hooks/                     # React Query hooks (use-market-data)
      services/                  # API client layer
      pages/                     # Dashboard, StockExplorer, Watchlist, etc.
  plan/                          # PRD, implementation plan
  memory/                        # Execution checklist
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GITHUB_TOKEN` | Yes | GitHub token for Copilot SDK authentication |
| `GITHUB_MODEL` | No | Model name (default: gpt-4.1) |
| `ASPNETCORE_ENVIRONMENT` | No | Environment (Development/Production) |
| `VITE_API_BASE_URL` | No | Frontend API base URL override (empty uses proxy) |

### Setting up GITHUB_TOKEN

Choose one of the following methods:

**1. User Secrets (Recommended for local development)**
```bash
cd api/src/IdeaFactory.Api
dotnet user-secrets init
dotnet user-secrets set "GITHUB_TOKEN" "your-token-here"
```

**2. Environment Variable (zsh/bash)**
```bash
export GITHUB_TOKEN="your-token-here"
```

**3. .zshrc / .bashrc (Persistent)**
```bash
echo 'export GITHUB_TOKEN="your-token-here"' >> ~/.zshrc
source ~/.zshrc
```

That's it — minimal setup to get started.
