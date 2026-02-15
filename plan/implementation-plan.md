# Implementation Plan: The Idea Factory -- Pilot #001

**Architect:** Raj Champaneriya
**Document Status:** Approved for execution
**Last Updated:** 2026-02-15

---

## 1. Executive Summary

This plan translates the PRD and draft technical specification into a phased,
executable delivery roadmap. The system provides AI-driven insights for Indian
equities using a .NET 10 backend orchestrating Azure AI services, a React
frontend with IBM Carbon Design System, and local development powered by Docker
emulators and GitHub Models.

The UI shell is already built (React 18 + Vite + Shadcn/Radix). The work ahead
is: replace the component library with IBM Carbon, build the .NET 10 backend,
wire the frontend to live APIs, and containerize everything with .NET Aspire.

---

## 2. Architecture Overview

### 2.1 System Boundaries

```
+------------------------------------------------------------------+
|  .NET Aspire AppHost (Orchestrator)                              |
|                                                                  |
|  +------------------+    +------------------------------------+  |
|  | React Frontend   |    | .NET 10 Web API                   |  |
|  | (IBM Carbon UI)  |--->| - Insight Endpoints                |  |
|  | Vite dev / nginx |    | - Prudence Middleware              |  |
|  +------------------+    | - Copilot Extension Webhook        |  |
|                          +------------------------------------+  |
|                                |           |           |         |
|                          +-----+    +------+    +------+------+  |
|                          |          |           |             |   |
|                     +----v---+ +----v----+ +----v----+ +-----v-+ |
|                     | GitHub | | Azure   | | Azure   | | Redis | |
|                     | Models | | AI      | | Doc     | |       | |
|                     | (Dev)  | | Search  | | Intel   | |       | |
|                     +--------+ +---------+ +---------+ +-------+ |
|                                                                  |
|  Docker Emulators:                                               |
|  +----------+  +-----------+                                     |
|  | Azurite  |  | Redis     |                                     |
|  | (Storage)|  | (Cache)   |                                     |
|  +----------+  +-----------+                                     |
+------------------------------------------------------------------+
```

### 2.2 Technology Matrix

| Layer | Technology | Rationale |
|---|---|---|
| Orchestration | .NET Aspire 10 | Service discovery, health checks, telemetry, local emulator wiring |
| Backend API | .NET 10 Minimal API | Lightweight, AOT-friendly, `Microsoft.Extensions.AI` abstraction |
| AI Abstraction | Microsoft.Extensions.AI | Provider-agnostic AI client (GitHub Models in dev, Azure OpenAI in prod) |
| Frontend | React 18 + TypeScript + Vite | Already built, proven stack |
| UI Components | IBM Carbon Design System (carbon-react) | IBM-sponsored open source, enterprise-grade accessibility |
| Charts | IBM Carbon Charts (carbon-charts-react) | Consistent with Carbon design language, replaces Recharts |
| Search/RAG | Azure AI Search | Agentic retrieval for grounded responses |
| Document Parse | Azure AI Document Intelligence | Extract financials from PDF filings |
| Caching | Redis (via Aspire integration) | Hot path caching for market data and AI responses |
| Storage Emulator | Azurite (Docker) | Local Azure Storage/Queue emulation |
| Cache Emulator | Redis (Docker) | Local cache via Aspire-managed container |
| Copilot Extension | .NET 10 Webhook | VS Code integration for Technical Validator persona |

### 2.3 IBM Open Source Dependencies

| Package | Purpose | License |
|---|---|---|
| `@carbon/react` | UI component library | Apache 2.0 |
| `@carbon/charts-react` | Data visualization | Apache 2.0 |
| `@carbon/icons-react` | Iconography | Apache 2.0 |
| `@ibm/plex` | IBM Plex typeface | OFL 1.1 |

---

## 3. Repository Structure (Target State)

```
insight-weaver/
  .github/
    copilot-instructions.md        # Copilot agent context
  plan/
    prd.md
    draft.md
    implementation-plan.md
  memory/
    checklist.md                   # Execution progress tracker
  ui/                              # React frontend (existing, to be migrated)
    src/
      components/                  # Carbon-based components
      hooks/
      lib/
      pages/
      services/                    # API client layer (new)
        api-client.ts
        insight-service.ts
        market-service.ts
  api/
    IdeaFactory.sln
    src/
      IdeaFactory.AppHost/         # .NET Aspire orchestrator
        Program.cs
        appsettings.json
      IdeaFactory.ServiceDefaults/ # Shared Aspire defaults
        Extensions.cs
      IdeaFactory.Api/             # Web API project
        Program.cs
        Dockerfile
        Endpoints/
          InsightEndpoints.cs
          MarketEndpoints.cs
          CopilotEndpoints.cs
        Middleware/
          PrudenceMiddleware.cs
        Services/
          AiInsightService.cs
          MarketDataService.cs
          DocumentParsingService.cs
        Models/
          Stock.cs
          InsightRequest.cs
          InsightResponse.cs
          ComplianceAudit.cs
    tests/
      IdeaFactory.Api.Tests/
        PrudenceMiddlewareTests.cs
        InsightEndpointTests.cs
  docker-compose.yml               # Fallback compose (Aspire preferred)
```

---

## 4. Phased Delivery Plan

### Phase 0: Foundation (Days 1-2)

**Goal:** Establish the backend skeleton and development environment.

| Task | Detail |
|---|---|
| 0.1 Scaffold .NET Aspire solution | `dotnet new aspire` with AppHost, ServiceDefaults, Api projects |
| 0.2 Configure Aspire resource wiring | Redis, Azurite as Aspire-managed containers |
| 0.3 Add Microsoft.Extensions.AI | Configure dual-provider (GitHub Models / Azure OpenAI) |
| 0.4 Implement health check endpoints | `/health`, `/alive` via Aspire defaults |
| 0.5 Create Dockerfile for API | Multi-stage build targeting `mcr.microsoft.com/dotnet/nightly/aspnet:10.0` |
| 0.6 Verify `dotnet run` launches full stack | Aspire dashboard + API + emulators |

**Exit Criteria:** `curl http://localhost:5000/health` returns 200. Aspire dashboard shows all resources green.

### Phase 1: Prudence Layer (Days 3-4)

**Goal:** Governance-first development. Compliance middleware before any AI feature.

| Task | Detail |
|---|---|
| 1.1 Implement PrudenceMiddleware | Request/response logging, forbidden term detection, SEBI compliance headers |
| 1.2 Define compliance rules | No buy/sell recommendations, mandatory disclaimers, source attribution |
| 1.3 Add audit trail model | `ComplianceAudit` entity: timestamp, prompt hash, response hash, policy result |
| 1.4 Store audit records | Azure Table Storage (Azurite in dev) |
| 1.5 Write unit tests | Verify forbidden terms are blocked, clean prompts pass through |
| 1.6 Add governance report endpoint | `GET /api/governance/report` returns audit summary |

**Exit Criteria:** Tests pass. Prompts containing "buy RELIANCE" are rejected with a compliance message.

### Phase 2: AI Insight Endpoints (Days 5-8)

**Goal:** Core AI functionality -- the "What changed today?" and "Should I explore?" scenarios.

| Task | Detail |
|---|---|
| 2.1 Implement `/api/insight/today` | Takes ticker, returns AI-generated "Today's View" using GitHub Models |
| 2.2 Implement `/api/insight/brief` | Takes ticker, returns Peter Lynch-style investment brief (4 sections) |
| 2.3 Implement `/api/insight/explain` | Takes ticker + anomaly context, returns explanation of unusual move |
| 2.4 Implement `/api/chat` | Conversational endpoint for free-form questions with RAG grounding |
| 2.5 Add prompt templates | System prompts enforcing "inform, not advise" tone |
| 2.6 Add response caching | Redis cache with 15-minute TTL for insight responses |
| 2.7 Implement market data endpoints | `/api/market/indices`, `/api/market/movers`, `/api/market/stock/:ticker` |
| 2.8 Seed market data | Static JSON seed data matching current mock-data.ts structure |

**Exit Criteria:** All endpoints return structured JSON. AI endpoints produce compliant, grounded responses.

### Phase 3: Frontend Migration to IBM Carbon (Days 9-12)

**Goal:** Replace Shadcn/Radix with IBM Carbon components. Wire to live API.

| Task | Detail |
|---|---|
| 3.1 Install Carbon dependencies | `@carbon/react`, `@carbon/charts-react`, `@carbon/icons-react`, `@ibm/plex` |
| 3.2 Replace global styles | Swap Tailwind theme tokens with Carbon design tokens. Keep Tailwind for layout utilities. |
| 3.3 Migrate layout components | `AppShell` -> Carbon `Theme`/`Content`; `AppSidebar` -> Carbon `SideNav`; `AppHeader` -> Carbon `Header` |
| 3.4 Migrate Dashboard components | `MarketOverview` -> Carbon `Tile` + `Tag`; `UnusualMovers` -> Carbon `DataTable`; `NewsFeed` -> Carbon `StructuredList`; `QuickSearch` -> Carbon `Search` |
| 3.5 Migrate StockExplorer | Tabs -> Carbon `Tabs`; Charts -> `@carbon/charts-react` `LineChart`; Metrics -> Carbon `Tile` |
| 3.6 Migrate Watchlist | Table -> Carbon `DataTable` with selection; Views -> Carbon `ContentSwitcher` |
| 3.7 Migrate Assistant Panel | Chat -> Carbon `Chat` pattern (custom); Input -> Carbon `TextInput` + `Button` |
| 3.8 Migrate Briefcase | Cards -> Carbon `ClickableTile` |
| 3.9 Migrate Settings | Content -> Carbon `Accordion` + `UnorderedList` |
| 3.10 Fix font loading | Import `@ibm/plex` via npm, configure in CSS entry point |

**Exit Criteria:** All pages render with Carbon components. Visual regression check passes. No Shadcn imports remain in page/layout components (ui/ primitives may remain if reused).

### Phase 4: API Integration (Days 13-15)

**Goal:** Connect frontend to live backend. Remove mock data dependencies.

| Task | Detail |
|---|---|
| 4.1 Create API client service | `services/api-client.ts` with base URL from env, error handling, auth headers |
| 4.2 Create React Query hooks | `useMarketIndices`, `useUnusualMovers`, `useNewsFeed`, `useStockDetail`, `useInsightBrief`, `useTodayView` |
| 4.3 Wire Dashboard to API | Replace mock imports with React Query hooks |
| 4.4 Wire StockExplorer to API | Live data for overview, news, financials tabs. AI Brief tab calls `/api/insight/brief` |
| 4.5 Wire Assistant Panel to API | POST to `/api/chat` on send, stream response |
| 4.6 Wire UnusualMovers AI column | Call `/api/insight/explain` per mover |
| 4.7 Fix watchlist state management | Promote `useWatchlist` to React Context or Zustand for cross-page state sharing |
| 4.8 Add loading and error states | Carbon `InlineLoading`, `InlineNotification` for API states |

**Exit Criteria:** App functions end-to-end with live API. Mock data only used as API seed. No console errors.

### Phase 5: Copilot Extension (Days 16-17)

**Goal:** Enable VS Code integration for the Technical Validator persona.

| Task | Detail |
|---|---|
| 5.1 Implement Copilot webhook endpoint | `POST /copilot/resolve` accepting GitHub Copilot Extension format |
| 5.2 Reuse Prudence middleware | Same compliance pipeline as web UI |
| 5.3 Implement skill routing | Parse intent from prompt, route to insight/brief/explain services |
| 5.4 Add Copilot manifest | `copilot-extension.json` with skill definitions |
| 5.5 Test via VS Code | Verify "@idea-factory what changed for RELIANCE today?" returns compliant response |

**Exit Criteria:** Copilot Chat in VS Code can query the backend and receive formatted, compliant insight responses.

### Phase 6: Hardening and Documentation (Days 18-20)

**Goal:** Production readiness, testing, and documentation.

| Task | Detail |
|---|---|
| 6.1 Add integration tests | API endpoint tests with WebApplicationFactory |
| 6.2 Add frontend tests | Vitest tests for React Query hooks and key page renders |
| 6.3 Configure OpenTelemetry | Aspire-native telemetry for traces, metrics, logs |
| 6.4 Add request rate limiting | Protect AI endpoints from abuse |
| 6.5 Validate P95 latency | Target < 3 seconds per PRD NFR |
| 6.6 Update README.md | Setup instructions, architecture diagram, demo walkthrough |
| 6.7 Record demo artifacts | Screenshots and terminal output for evidence |

**Exit Criteria:** All tests pass. README contains clear setup instructions. Aspire dashboard shows healthy telemetry.

---

## 5. Key Technical Decisions

### 5.1 Why .NET Aspire over plain Docker Compose

Docker Compose requires manual service discovery, health check scripting, and
environment variable threading. .NET Aspire provides these out of the box with
a developer dashboard, automatic container lifecycle management for Redis and
Azurite, and native OpenTelemetry integration. The `docker-compose.yml` remains
as a fallback for CI environments that lack the Aspire tooling.

### 5.2 Why IBM Carbon over Shadcn/Radix

The PRD specifies IBM Carbon for the Retail Trader interface. Carbon provides
enterprise-grade accessibility (WCAG 2.1 AA), built-in data visualization via
`@carbon/charts-react`, and the IBM Plex typeface that the current design
already references. The migration is a component-level swap; page structure and
routing remain unchanged.

### 5.3 Why GitHub Models for Development AI

GitHub Models provides free-tier access to GPT-4o, GPT-4o-mini, and other
models using existing GitHub credentials. This eliminates the need for local
GPU resources (no Ollama container) and provides model parity with the
production Azure OpenAI deployment. The `Microsoft.Extensions.AI` abstraction
makes the provider swap a configuration change, not a code change.

### 5.4 Why Minimal API over Controllers

.NET 10 Minimal APIs with endpoint groups produce less ceremony, better AOT
compatibility, and align with the "Idea Factory" principle of reducing
boilerplate. The Prudence middleware still runs in the pipeline, and endpoint
filters provide per-route policy enforcement.

---

## 6. Data Flow: "What Changed Today?" Scenario

```
User types "RELIANCE" in QuickSearch
  |
  v
Frontend: GET /api/market/stock/RELIANCE
  |
  v
.NET API: MarketDataService fetches price, volume, sector data
  |
  v
Frontend renders StockExplorer Overview tab
  |
User clicks "AI Brief" tab
  |
  v
Frontend: POST /api/insight/brief { ticker: "RELIANCE" }
  |
  v
.NET API: PrudenceMiddleware validates request
  |
  v
.NET API: AiInsightService builds prompt from template
  |     + Retrieves context from Azure AI Search (RAG)
  |     + Sends to GitHub Models (dev) / Azure OpenAI (prod)
  |
  v
.NET API: Response cached in Redis (15 min TTL)
  |
  v
.NET API: ComplianceAudit record written to Table Storage
  |
  v
Frontend renders 4-section Peter Lynch brief with citations
```

---

## 7. Environment Configuration

### 7.1 Development (Local)

```
ASPNETCORE_ENVIRONMENT=Development
GITHUB_TOKEN=<personal-github-token>
AZURE_STORAGE_CONNECTION_STRING=UseDevelopmentStorage=true
REDIS_CONNECTION=localhost:6379
```

Aspire AppHost wires Redis and Azurite containers automatically.

### 7.2 Production (Azure Container Apps)

```
ASPNETCORE_ENVIRONMENT=Production
AZURE_OPENAI_ENDPOINT=https://<instance>.openai.azure.com
AZURE_AI_SEARCH_ENDPOINT=https://<instance>.search.windows.net
AZURE_STORAGE_CONNECTION_STRING=<production-connection-string>
REDIS_CONNECTION=<azure-cache-connection>
```

Managed Identity replaces all secret-based authentication.

---

## 8. Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| GitHub Models rate limits during development | Medium | Cache aggressively; use mock responses for UI work |
| Carbon migration breaks existing layout | Medium | Migrate component-by-component; run visual diff after each |
| .NET 10 preview breaking changes | Low | Pin SDK version in `global.json`; use stable Aspire packages |
| Azure AI Search cold start latency | Medium | Pre-warm index; cache frequent queries in Redis |
| SEBI compliance false positives | Low | Tune Prudence term list; add override for known-safe patterns |

---

## 9. Success Criteria (Mapped to PRD)

| PRD Metric | Target | Measurement |
|---|---|---|
| Time to Evidence | < 48 hours for new signal | Timestamp from data source addition to insight availability |
| Research time reduction | >= 50% | Comparative user task timing (manual vs. AI-assisted) |
| Policy violations | Zero | Governance report from audit trail |
| P95 API latency | < 3 seconds | OpenTelemetry percentile metrics |
| Innovation Velocity | Idea to prototype in 2 weeks | Sprint burndown against this plan |

---

## 10. Delivery Narrative

This plan is structured to demonstrate a core principle: governance precedes
features. The Prudence layer ships before the first AI endpoint. Every insight
produced by the system carries an audit trail from Day 1.

The architecture is deliberately layered so that the same compliance pipeline
serves both the Retail Trader (web UI) and the Technical Validator (VS Code
Copilot Extension). This dual-interface design validates that the system is not
a point solution but a platform.

The IBM Carbon migration replaces the existing Shadcn/Radix components with
IBM's open-source design system, bringing enterprise accessibility standards
and data visualization capabilities that align with the financial data domain.

The .NET Aspire orchestration eliminates the "works on my machine" problem by
codifying the entire development environment -- API, Redis, Azurite -- as a
single `dotnet run` command with a built-in observability dashboard.

The choice of GitHub Models for development AI removes infrastructure friction
entirely. No GPU. No Docker container for Ollama. Just a GitHub token and the
same model that runs in production. This is the "Idea Factory" methodology in
practice: minimize the distance between hypothesis and evidence.
