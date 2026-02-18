# Demo Readiness Plan: Day 3 Recording

## 1. Campaign Promise vs. Implementation Reality

The Day 3 demo post commits to a **30-second silent screen recording** showing four steps: Select, Configure, Execute, Evidence. The final frame must display: *"Time Elapsed: 2.5 hours. Budget Request: Rs 0."*

---

## 2. Gap Analysis

### 2.1 Backend (API Layer)

| Campaign Claim | Architecture Support | Implementation Status | Gap |
|---|---|---|---|
| AI-assisted document analysis for NSE stocks | `AiInsightService` with `GenerateInsightAsync` | InsightEndpoints implements `/today`, `/brief`, `/explain`, `/chat` | **Partial** -- endpoints exist but the demo scenario ("experiment template") is a UI narrative layer, not a distinct backend feature |
| "Run locally on standard hardware" | Aspire orchestration with Redis + Azurite containers | AppHost project exists (`dotnet run --project api/src/IdeaFactory.AppHost`) | **Ready** -- single-command launch is documented and functional |
| "Within governance guardrails" | PrudenceMiddleware validates all AI paths; TableStorageAuditService records compliance audits | Middleware pipeline defined in HLD Section 4.3 | **Needs verification** -- audit trail must visibly produce records during the demo |
| "Generated metrics and recommendations" | `InsightResponse` with disclaimer, timestamp, sources | Endpoints return structured JSON with `X-SEBI-Disclaimer` and `X-Compliance-Audit` headers | **Ready** -- response structure supports demo narrative |
| Evidence report generation | No dedicated "evidence report" endpoint exists | N/A | **Gap** -- the demo implies a consolidated report view; this is a **frontend concern** |

### 2.2 Frontend (UI Layer)

| Demo Frame | Required Component | Architecture Support | Gap |
|---|---|---|---|
| Frame 1 (0-5s): Dashboard | Market overview, unusual movers, news feed | Frontend Architecture Section 4.1 describes Dashboard page | **Needs realistic data** -- mock data must show recognizable NSE tickers (INFY, TCS, RELIANCE) with plausible prices |
| Frame 2 (5-12s): Experiment template selector | No such component documented | Not in frontend architecture | **Critical gap** -- the campaign describes an "experiment template" UX that does not exist in the architecture |
| Frame 3 (12-20s): Configure parameters | Ticker selection + analysis type | Stock Explorer search + AI brief generation partially covers this | **Reframeable** -- Stock Explorer search + insight type selection can serve as "configure" |
| Frame 4 (20-28s): Evidence generated | Four-section Peter Lynch brief with timestamp, sources, disclaimer | Section 4.2 describes the structured brief layout | **Mostly ready** -- the brief display with compliance metadata is the "evidence" |
| Frame 5 (28-30s): Final summary | "Time Elapsed: 2.5 hours. Budget: Rs 0" overlay | Not a component -- post-production text overlay | **Ready** -- handled in video editing |

### 2.3 Data Layer

| Requirement | Status | Detail |
|---|---|---|
| Realistic market data (seed) | Documented in Phase 2 Task 2.8 | Must ensure INFY, TCS, RELIANCE tickers have realistic INR prices, volumes, and sector assignments |
| AI responses that look genuine | Depends on GitHub Models connectivity | If rate-limited or unavailable, need cached/pre-generated responses as fallback |
| Compliance audit records visible | Governance endpoints (`GET /api/governance/audits`) return raw records | Can be shown in the governance page or via API call during recording |

---

## 3. Critical Path to Demo Readiness

### 3.1 The "Experiment Template" Problem

The campaign narrative describes a workflow that does not directly map to the implemented architecture. The architecture provides **insight endpoints** (today, brief, explain, chat), not "experiment templates." This is the single largest conceptual gap.

**Resolution strategy:** Reframe the Stock Explorer flow as the "experiment." The demo narrative becomes:

1. **Select**: Choose a ticker from the Dashboard's unusual movers (this is "selecting an experiment")
2. **Configure**: Navigate to Stock Explorer, which auto-populates the ticker; the four insight types (Today, Brief, Explain, Chat) are the "parameters"
3. **Execute**: Click to generate the AI brief (the progress indicator and loading states are the "experiment running")
4. **Evidence**: The four-section Peter Lynch brief with timestamp, sources, and SEBI disclaimer is the "evidence report"

This reframe requires **zero backend changes** and aligns perfectly with the existing Stock Explorer architecture.

### 3.2 Prioritized Task List

#### Priority 0: Demo Blockers (Must complete)

| # | Task | Owner | Effort | Rationale |
|---|---|---|---|---|
| D-1 | Verify `dotnet run --project api/src/IdeaFactory.AppHost` launches full stack cleanly | Backend | 2h | The demo recording checklist requires recording from the running application |
| D-2 | Populate seed data with realistic NSE tickers and INR prices | Backend | 4h | Campaign feedback warns: "If the market data is obviously mock, it undermines the entire demo" |
| D-3 | Ensure IBM Carbon dark theme renders correctly on all demo pages | Frontend | 4h | Visual assessment requires dark theme matching campaign visual identity |
| D-4 | Verify AI insight generation produces coherent 4-section brief for INFY | Full Stack | 2h | The brief endpoint must return content that parses cleanly into The Story / The Numbers / The Moat / The Risks |
| D-5 | Pre-generate and cache fallback AI responses for INFY, TCS, RELIANCE | Backend | 3h | Mitigates GitHub Models rate limit risk |

#### Priority 1: Demo Polish (Should complete)

| # | Task | Owner | Effort | Rationale |
|---|---|---|---|---|
| D-6 | Add contextual loading text ("Generating AI brief...", "Analyzing financial data...") to Stock Explorer | Frontend | 2h | Loading states are part of the documented UX |
| D-7 | Ensure `ComplianceBanner` is visible in all frames | Frontend | 1h | The SEBI disclaimer must be visible to validate the "governance guardrails" claim |
| D-8 | Verify governance audit trail records are created during demo flow | Backend | 2h | Call `GET /api/governance/audits` after the insight generation to confirm audit records exist |
| D-9 | Style the generation timestamp and sources section at bottom of brief | Frontend | 2h | This is the "evidence" proof point -- it must look authoritative |

#### Priority 2: Demo Enhancement (Nice to have)

| # | Task | Owner | Effort | Rationale |
|---|---|---|---|---|
| D-10 | Add a "time elapsed" indicator in the UI (optional, can be post-production) | Frontend | 4h | Reinforces the "2.5 hours" narrative |
| D-11 | Show Aspire dashboard briefly in recording to demonstrate observability | DevOps | 1h | Signals enterprise-grade tooling to CISO/CTO audience |
| D-12 | Demonstrate Copilot Extension query in VS Code as bonus frame | Backend | 3h | Shows the Technical Validator persona |

---

## 4. Demo Script (Aligned to Architecture)

```
0-5s   [Dashboard page]
       IBM Carbon dark theme. NIFTY 50 and SENSEX tiles visible.
       Unusual Movers table shows INFY with abnormal volume.
       Text overlay: "The Idea Factory"

5-12s  [Click INFY in Unusual Movers -> Stock Explorer opens]
       Stock Explorer Tabs component loads with ticker pre-populated.
       Text overlay: "Step 1: Select Experiment -- INFY"

12-20s [Click "AI Brief" tab -> Loading state appears]
       "Generating AI brief..." contextual loading text visible.
       ComplianceBanner visible at bottom.
       Text overlay: "Step 2: Generating Evidence"

20-28s [Brief renders in 4-section layout]
       The Story | The Numbers | The Moat | The Risks
       Timestamp, sources, and disclaimer visible at bottom.
       Text overlay: "Step 3: Evidence Generated"

28-30s [Hold on completed brief]
       Text overlay: "Time Elapsed: 2.5 hours. Budget Request: Rs 0."
```

---

## 5. Risk Assessment for Demo Recording

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| GitHub Models returns incoherent response during recording | Medium | Critical | Pre-cache responses for INFY/TCS/RELIANCE in Redis before recording (Task D-5) |
| Docker containers fail to start cleanly | Low | Critical | Test Aspire launch 3 times before recording day; have `docker-compose.yml` as fallback |
| Carbon component rendering breaks at 110% browser zoom | Medium | High | Test at 110% zoom; fix CSS issues before recording |
| Brief response does not parse into 4 sections | Medium | High | Validate regex parsing against actual AI output; tune prompt if needed |
| Aspire dashboard port conflicts | Low | Medium | Pin ports in AppHost configuration; kill conflicting processes before recording |

---

## 6. Quality Gates

Three requirements from campaign feedback:

1. **Recording quality**: 1080p minimum, no frame drops, no cursor jitter
2. **Application state**: Realistic data, recognizable tickers, plausible prices
3. **Duration**: 30 seconds maximum -- "Not 31. Not 45."

**Recommended recording protocol:**

- Record 3 takes
- Have someone outside the project watch all three without context
- Use the one they find clearest
- Clean desktop: no bookmarks, notifications, or unrelated tabs
- Browser zoom at 110%
- Add text overlays in post-production (Figma or After Effects)
- Final file: MP4, under 20MB, 30 seconds

---

## 7. Architectural Alignment Summary

| Architecture Document | Demo Alignment | Status |
|---|---|---|
| HLD | System overview, Aspire deployment, middleware pipeline | Aligned |
| LLD | Service layer, endpoint specs, audit service | Aligned |
| API Reference | Insight endpoints, governance endpoints, compliance headers | Aligned |
| Frontend Architecture | Dashboard, Stock Explorer, ComplianceBanner, React Query hooks | Aligned with reframe |
| Architecture Diagrams | Data flow matches demo scenario | Aligned |
| Compliance Governance | PrudenceMiddleware, audit trail, SEBI disclaimers | Aligned |

---

## 8. Strategic Recommendation

The demo is **architecturally ready** but requires a **narrative reframe** and **data polish**. The core issue is that the campaign describes an "experiment template" metaphor while the implementation provides "stock insight generation." These are the same capability described in different language.

**Do not build new features for the demo.** Instead:

1. Complete Priority 0 tasks (D-1 through D-5) -- estimated 15 hours total
2. Rehearse the demo script above against the running application
3. Pre-cache AI responses as insurance against API failures
4. Record three takes and select the best one
5. Apply text overlays in post-production to bridge the narrative gap between "insight generation" and "experiment execution"

The architecture supports every claim made in the campaign. The gap is presentation, not capability.
