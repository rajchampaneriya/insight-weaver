# Insight Weaver — AI insights for Indian equities

Concise developer README with quick start instructions.

## Status
- Phase 0 (Foundation): ✅ implemented
- Phase 1 (Prudence / Compliance): ✅ implemented

## Quickstart (local)

Prerequisites
- .NET 10 SDK (pinned in `api/global.json`)
- Docker (for Aspire emulators)
- Node.js + npm
- (Dev AI) set `GITHUB_TOKEN` in your environment or user secrets

Run the backend (Aspire AppHost)

```bash
dotnet run --project api/src/IdeaFactory.AppHost
# health check: curl http://localhost:5000/health
```

Run the frontend (dev)

```bash
cd ui
npm install
npm run dev
```

Run tests

```bash
# API unit/integration tests
cd api && dotnet test
# Frontend tests
cd ui && npm test
```

## Important notes
- All AI responses include the mandatory disclaimer: "This is AI-generated analysis for informational purposes only. Not investment advice." (SEBI compliance)
- Compliance audit trail is stored in Azure Table Storage (Azurite in dev).
- Aspire orchestrates Redis and Azurite locally; use `dotnet run` on the AppHost to bring up the full stack.

## Where to look next
- Implementation plan: `plan/implementation-plan.md`
- API: `api/src/IdeaFactory.Api`
- Frontend: `ui/src`

That's it — minimal setup to get started. 🔧
