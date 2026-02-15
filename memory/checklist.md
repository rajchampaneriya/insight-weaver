# Execution Checklist

Track progress against the implementation plan. Mark items as they complete.

## Phase 0: Foundation (Days 1-2)

- [ ] 0.1 Scaffold .NET Aspire solution (AppHost, ServiceDefaults, Api)
- [ ] 0.2 Configure Aspire resource wiring (Redis, Azurite containers)
- [ ] 0.3 Add Microsoft.Extensions.AI with dual-provider config
- [ ] 0.4 Implement health check endpoints
- [ ] 0.5 Create Dockerfile for API
- [ ] 0.6 Verify full stack launches via `dotnet run`

## Phase 1: Prudence Layer (Days 3-4)

- [ ] 1.1 Implement PrudenceMiddleware (logging, forbidden terms, SEBI headers)
- [ ] 1.2 Define compliance rules (no buy/sell, mandatory disclaimers)
- [ ] 1.3 Add ComplianceAudit model and Table Storage persistence
- [ ] 1.4 Write PrudenceMiddleware unit tests
- [ ] 1.5 Add governance report endpoint

## Phase 2: AI Insight Endpoints (Days 5-8)

- [ ] 2.1 Implement `/api/insight/today` (Today's View)
- [ ] 2.2 Implement `/api/insight/brief` (Peter Lynch-style brief)
- [ ] 2.3 Implement `/api/insight/explain` (anomaly explanation)
- [ ] 2.4 Implement `/api/chat` (conversational with RAG)
- [ ] 2.5 Add prompt templates (inform, not advise)
- [ ] 2.6 Add Redis response caching (15 min TTL)
- [ ] 2.7 Implement market data endpoints
- [ ] 2.8 Seed market data from mock-data.ts structure

## Phase 3: Frontend Migration to IBM Carbon (Days 9-12)

- [ ] 3.1 Install Carbon dependencies (@carbon/react, charts, icons, @ibm/plex)
- [ ] 3.2 Replace global styles (Carbon tokens + Tailwind layout)
- [ ] 3.3 Migrate layout: AppShell, AppSidebar, AppHeader
- [ ] 3.4 Migrate Dashboard: MarketOverview, UnusualMovers, NewsFeed, QuickSearch
- [ ] 3.5 Migrate StockExplorer (Tabs, Charts, Metrics)
- [ ] 3.6 Migrate Watchlist (DataTable, ContentSwitcher)
- [ ] 3.7 Migrate Assistant Panel (chat pattern)
- [ ] 3.8 Migrate Briefcase (ClickableTile)
- [ ] 3.9 Migrate Settings (Accordion, UnorderedList)
- [ ] 3.10 Fix font loading (@ibm/plex via npm)

## Phase 4: API Integration (Days 13-15)

- [ ] 4.1 Create API client service (services/api-client.ts)
- [ ] 4.2 Create React Query hooks for all endpoints
- [ ] 4.3 Wire Dashboard to live API
- [ ] 4.4 Wire StockExplorer to live API + AI Brief
- [ ] 4.5 Wire Assistant Panel to /api/chat
- [ ] 4.6 Wire UnusualMovers AI explanation column
- [ ] 4.7 Fix watchlist state (React Context or Zustand)
- [ ] 4.8 Add loading/error states with Carbon components

## Phase 5: Copilot Extension (Days 16-17)

- [ ] 5.1 Implement Copilot webhook endpoint
- [ ] 5.2 Reuse Prudence middleware for Copilot requests
- [ ] 5.3 Implement skill routing (intent -> service)
- [ ] 5.4 Add Copilot manifest
- [ ] 5.5 Test via VS Code Copilot Chat

## Phase 6: Hardening (Days 18-20)

- [ ] 6.1 Add API integration tests (WebApplicationFactory)
- [ ] 6.2 Add frontend tests (Vitest + Testing Library)
- [ ] 6.3 Configure OpenTelemetry via Aspire
- [ ] 6.4 Add request rate limiting for AI endpoints
- [ ] 6.5 Validate P95 latency < 3 seconds
- [ ] 6.6 Update README.md with setup and architecture
- [ ] 6.7 Record demo artifacts (screenshots, terminal output)

## Notes

- Current UI state: Shell is functional with mock data. AI features are stubbed.
- Watchlist state uses independent useState hooks (broken cross-page). Needs Context.
- React Query is configured but unused. Ready for API integration.
- Shadcn/Radix components exist in src/components/ui/ -- preserve as needed during Carbon migration.
