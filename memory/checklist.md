# Execution Checklist

Track progress against the implementation plan. Mark items as they complete.

## Phase 0: Foundation (Days 1-2)

- [x] 0.1 Scaffold .NET Aspire solution (AppHost, ServiceDefaults, Api)
- [x] 0.2 Configure Aspire resource wiring (Redis, Azurite containers)
- [x] 0.3 Add Microsoft.Extensions.AI with dual-provider config
- [x] 0.4 Implement health check endpoints
- [x] 0.5 Create Dockerfile for API
- [ ] 0.6 Verify full stack launches via `dotnet run`

## Phase 1: Prudence Layer (Days 3-4)

- [x] 1.1 Implement PrudenceMiddleware (logging, forbidden terms, SEBI headers)
- [x] 1.2 Define compliance rules (no buy/sell, mandatory disclaimers)
- [x] 1.3 Add ComplianceAudit model and Table Storage persistence
- [x] 1.4 Write PrudenceMiddleware unit tests
- [x] 1.5 Add governance report endpoint

## Phase 2: AI Insight Endpoints (Days 5-8)

- [x] 2.1 Implement `/api/insight/today` (Today's View)
- [x] 2.2 Implement `/api/insight/brief` (Peter Lynch-style brief)
- [x] 2.3 Implement `/api/insight/explain` (anomaly explanation)
- [x] 2.4 Implement `/api/chat` (conversational with RAG)
- [x] 2.5 Add prompt templates (inform, not advise)
- [x] 2.6 Add Redis response caching (15 min TTL)
- [x] 2.7 Implement market data endpoints
- [x] 2.8 Seed market data from mock-data.ts structure

## Phase 3: Frontend Migration to IBM Carbon (Days 9-12)

- [x] 3.1 Install Carbon dependencies (@carbon/react, charts, icons, @ibm/plex)
- [x] 3.2 Replace global styles (Carbon tokens + Tailwind layout)
- [x] 3.3 Migrate layout: AppShell, AppSidebar, AppHeader
- [x] 3.4 Migrate Dashboard: MarketOverview, UnusualMovers, NewsFeed, QuickSearch
- [x] 3.5 Migrate StockExplorer (Tabs, Charts, Metrics)
- [x] 3.6 Migrate Watchlist (DataTable, ContentSwitcher)
- [x] 3.7 Migrate Assistant Panel (chat pattern)
- [x] 3.8 Migrate Briefcase (ClickableTile)
- [x] 3.9 Migrate Settings (Accordion, UnorderedList)
- [x] 3.10 Fix font loading (@ibm/plex via npm)

## Phase 4: API Integration (Days 13-15)

- [x] 4.1 Create API client service (services/api-client.ts)
- [x] 4.2 Create React Query hooks for all endpoints
- [x] 4.3 Wire Dashboard to live API
- [x] 4.4 Wire StockExplorer to live API + AI Brief
- [x] 4.5 Wire Assistant Panel to /api/chat
- [x] 4.6 Wire UnusualMovers AI explanation column
- [x] 4.7 Fix watchlist state (React Context or Zustand)
- [x] 4.8 Add loading/error states with Carbon components

## Phase 5: Copilot Extension (Days 16-17)

- [x] 5.1 Implement Copilot webhook endpoint
- [x] 5.2 Reuse Prudence middleware for Copilot requests
- [x] 5.3 Implement skill routing (intent -> service)
- [x] 5.4 Add Copilot manifest
- [x] 5.5 Test via VS Code Copilot Chat

## Phase 6: Hardening (Days 18-20)

- [x] 6.1 Add API integration tests (WebApplicationFactory)
- [x] 6.2 Add frontend tests (Vitest + Testing Library)
- [x] 6.3 Configure OpenTelemetry via Aspire
- [x] 6.4 Add request rate limiting for AI endpoints
- [x] 6.5 Validate P95 latency < 3 seconds
- [x] 6.6 Update README.md with setup and architecture
- [x] 6.7 Record demo artifacts (screenshots, terminal output)

## Notes

- UI project is wired into .NET Aspire AppHost via `AddNpmApp`.
- Copilot Extension endpoint at `/copilot/resolve` with skill routing.
- Rate limiting: 10 req/min for AI endpoints, 60 req/min for general endpoints.
- OpenTelemetry configured via Aspire ServiceDefaults (traces, metrics, logs).
- All phases complete. Full stack launches with `dotnet run --project api/src/IdeaFactory.AppHost`.
