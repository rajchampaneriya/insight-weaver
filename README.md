# Insight Weaver

AI-driven research platform for Indian equities (NSE/BSE). Local-first experimentation with governance built in.

**Methodology:** [rajc.work](https://rajc.work) · **License:** [MIT](LICENSE)

---

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
|-------|------------|
| Orchestration | .NET Aspire 10 |
| Backend | .NET 10 Minimal API + Microsoft.Extensions.AI |
| Frontend | React 18 + TypeScript + Vite |
| AI | GitHub Copilot SDK |
| Cache | Redis via Aspire |
| Storage | Azure Table Storage (Azurite emulator in dev) |
| Compliance | Prudence Middleware (SEBI-compliant audit trail) |

---

## Quickstart

**Prerequisites:** .NET 10 SDK, Docker Desktop, Node.js 18+, GitHub Copilot CLI with `GITHUB_TOKEN`

```bash
dotnet run --project api/src/IdeaFactory.AppHost
```

Starts API on `http://localhost:5000`, UI on `http://localhost:8080`, Redis and Azurite via Aspire.

```bash
curl http://localhost:5000/health
```

---

## API Overview

| Area | Endpoints |
|------|-----------|
| Market | `/api/market/indices`, `/movers`, `/stock/{ticker}`, `/news`, `/search` |
| AI Insights | `/api/insight/today`, `/brief`, `/explain`, `/chat` |
| Copilot | `/copilot/resolve`, `/copilot/skills` |
| Governance | `/api/governance/report`, `/api/governance/audits` |

---

## Compliance

- All AI responses include mandatory SEBI disclaimer
- Buy/sell/hold recommendations blocked (HTTP 422)
- Every AI request/response audited to Azure Table Storage
- Rate limiting on AI endpoints

---

## Project Structure

```
insight-weaver/
  api/src/          # AppHost, API, ServiceDefaults
  api/tests/         # Integration tests
  ui/src/            # React components, hooks, services
  plan/              # PRD, implementation plan
  reference-docs/   # Architecture, ADRs, API reference
```

---

## Documentation

- [Reference docs](reference-docs/) — HLD, LLD, ADRs, diagrams, compliance guide
- [Implementation plan](plan/implementation-plan.md) — Phased delivery roadmap

---

## Tests

```bash
cd api && dotnet test
cd ui && npm test
```

---

Fork it. Adapt it. Build your own Idea Factory.
