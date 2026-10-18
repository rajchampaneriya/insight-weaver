# Architecture Decision Records (ADR)

**Project:** Insight Weaver (The Idea Factory)
**Date:** 2026-02-15

---

## ADR-001: .NET Aspire over Docker Compose for Orchestration

### Status
Accepted

### Context
The system requires orchestration of multiple services: the .NET API, Redis cache, Azure Storage emulator (Azurite), and the React frontend dev server. The two primary options were:
- **Docker Compose:** Industry-standard container orchestration for local development.
- **.NET Aspire:** Microsoft's opinionated application platform for building cloud-native apps with built-in observability.

### Decision
Use .NET Aspire as the primary orchestrator for development and deployment.

### Rationale
- **Single Command Start:** `dotnet run --project api/src/IdeaFactory.AppHost` launches the API, Redis, Azurite, and Vite UI with one command
- **Service Discovery:** Aspire automatically wires service endpoints. The Vite proxy receives the API address via `services__api__https__0` environment variable
- **Health and Dependency Management:** `WaitFor()` semantics ensure services start in the correct order
- **Built-in Observability:** OpenTelemetry traces, metrics, and logs are configured automatically via ServiceDefaults
- **Developer Dashboard:** Aspire provides a real-time dashboard showing resource status, logs, and traces
- Docker Compose remains as a fallback for CI environments that lack the Aspire tooling

### Consequences
- Developers must have the .NET 10 SDK and Aspire workload installed
- Docker Desktop is still required (Aspire uses it for containers)
- The Aspire dashboard provides observability out of the box without additional tooling

---

## ADR-002: IBM Carbon Design System over Shadcn/Radix

### Status
Accepted

### Context
The initial frontend was built with Shadcn/Radix UI primitives. The PRD specifies IBM Carbon as the target design system for the Retail Trader interface.

### Decision
Replace page-level and layout components with IBM Carbon (`@carbon/react`). Retain Shadcn/Radix primitives in `components/ui/` for utility components not covered by Carbon.

### Rationale
- **Enterprise Accessibility:** Carbon provides WCAG 2.1 AA compliance out of the box
- **Financial Data Visualization:** `@carbon/charts-react` offers chart components designed for data-dense interfaces, consistent with the Carbon design language
- **IBM Plex Typeface:** The monospace variant (`IBM Plex Mono`) is ideal for financial data display
- **Open Source:** All Carbon packages are Apache 2.0 licensed
- **Consistency:** A unified design language across the application reduces cognitive load for users

### Consequences
- The migration was a component-level swap; page structure and routing remained unchanged
- Shadcn/Radix primitives remain in `components/ui/` for lower-level UI patterns (toasts, dialogs)
- Both Carbon tokens and Tailwind utilities coexist -- Carbon for component styling, Tailwind for layout

---

## ADR-003: Microsoft.Extensions.AI for Provider-Agnostic AI

### Status
Accepted

### Context
The system needs to call large language models for stock analysis. During development, GitHub Models provides free-tier access. In production, Azure OpenAI will be used.

### Decision
Use the `Microsoft.Extensions.AI` abstraction layer with `IChatClient` as the AI interface. Implement `CopilotChatClientAdapter` to bridge the GitHub Copilot SDK to the IChatClient interface.

### Rationale
- **Provider Agnostic:** Business logic depends on `IChatClient`, not a specific SDK. Switching from GitHub Models to Azure OpenAI is a configuration change
- **Zero Infrastructure for Dev:** GitHub Models requires no GPU, no Docker container for AI -- just a GitHub token
- **Model Parity:** The same models (GPT-4.1) can be used in both development and production
- **Future-Proof:** As Microsoft adds providers (local models, third-party services), the application code remains unchanged

### Consequences
- The adapter pattern adds a thin layer of indirection
- Streaming responses are not implemented yet (throws `NotImplementedException`)
- The GitHub Copilot SDK requires the `copilot` CLI to be installed and authenticated

---

## ADR-004: Governance-First Development (Prudence Before Features)

### Status
Accepted

### Context
The platform generates AI content about financial instruments. SEBI regulations require that platforms avoid giving investment advice without proper registration. Compliance cannot be an afterthought.

### Decision
Implement the Prudence compliance middleware (input/output validation, audit trail, SEBI headers) **before** building any AI insight endpoint.

### Rationale
- **Regulatory Risk Mitigation:** Every request is validated and audited from Day 1
- **Consistent Enforcement:** The middleware applies to all AI paths, including the Copilot Extension
- **Audit Trail:** SHA256 hashes of prompts and responses, combined with policy results, create a tamper-evident compliance record
- **Defense in Depth:** Input validation catches forbidden terms before the AI model is called; output validation catches any non-compliant AI responses

### Consequences
- Additional latency per request (body buffering, hash computation, table storage write)
- False positives possible with whole-word matching (mitigated by the word-boundary algorithm)
- The audit table grows continuously; partition-by-date enables efficient pruning

---

## ADR-005: Minimal API with Endpoint Groups over Controllers

### Status
Accepted

### Context
.NET offers two patterns for HTTP endpoints: MVC Controllers and Minimal API. The team needed to choose a pattern for the API layer.

### Decision
Use Minimal API with endpoint groups for all HTTP endpoints.

### Rationale
- **Less Ceremony:** No controller classes, no attribute routing decoration
- **AOT Compatibility:** Minimal APIs have better Ahead-of-Time compilation support
- **Endpoint Groups:** `MapGroup()` provides logical organization equivalent to controllers, with shared route prefixes, tags, and rate limiting policies
- **Aspire Alignment:** Aspire documentation and examples favor Minimal API patterns
- **Idea Factory Principle:** Reduce boilerplate to accelerate prototyping

### Consequences
- Endpoints are defined as lambda expressions, which can become complex for handlers with many dependencies
- No built-in model validation attributes (validation must be done manually or with filters)
- IDE support for navigation is slightly different from controller-based routing

---

## ADR-006: Redis Caching Strategy for AI Responses

### Status
Accepted

### Context
AI inference is the most expensive operation in the system (both in latency and cost). The same stock analysis request within a short time window should return the same result.

### Decision
Cache AI responses in Redis with a 15-minute TTL. Cache keys incorporate the ticker, insight type, and a SHA256 hash of the context string.

### Rationale
- **Cost Reduction:** Cached responses avoid redundant AI model calls
- **Latency Improvement:** Redis cache hits return in sub-millisecond time vs. seconds for AI inference
- **Correctness:** The hash-based cache key ensures that different contexts for the same ticker produce different cache entries
- **Graceful Degradation:** Cache read/write failures are caught and logged but do not fail the request -- the system falls back to direct AI inference

### Consequences
- Responses may be up to 15 minutes stale
- Redis must be available for optimal performance, but the system functions without it
- Cache key format: `insight:{insightType}:{ticker}:{hash[0:16]}`

---

## ADR-007: Azure Table Storage for Compliance Audit Trail

### Status
Accepted

### Context
Every AI interaction must be logged for SEBI compliance auditing. The audit store must support:
- High write throughput (every AI request generates an audit record)
- Efficient date-range queries for governance reports
- Low cost for pilot-phase storage

### Decision
Use Azure Table Storage (Azurite emulator in development) with date-based partitioning.

### Rationale
- **Cost Effective:** Table Storage is significantly cheaper than SQL or Cosmos DB for append-heavy workloads
- **Partition Strategy:** Using the date (yyyy-MM-dd) as the partition key enables efficient range scans for governance reports
- **Aspire Integration:** Azurite emulator runs as an Aspire-managed container, requiring zero configuration
- **Immutability:** Table Storage's append-only nature aligns with audit trail requirements
- **Scale:** Table Storage handles millions of entities per partition without performance degradation

### Consequences
- No SQL-style querying; complex analytics require export to a separate system
- Cross-partition queries (spanning multiple days) require multiple network calls
- Schema evolution requires careful handling (Table Storage is schema-on-read)

---

## ADR-008: React Query for Server State Management

### Status
Accepted

### Context
The frontend needs to manage server state (market data, stock details, AI insights) with proper caching, refetching, loading states, and error handling.

### Decision
Use TanStack React Query (`@tanstack/react-query`) for all API data fetching. Use React Context for client-only state (watchlist, theme).

### Rationale
- **Automatic Caching:** React Query caches responses and deduplicates concurrent requests
- **Background Refetching:** Market data refreshes every 60 seconds; news refreshes every 120 seconds
- **Stale-While-Revalidate:** Users see cached data immediately while fresh data loads in the background
- **Loading/Error States:** Built-in `isLoading`, `error`, and `data` states simplify UI state management
- **Mutation Support:** The `useMutation` hook handles the AI chat endpoint's POST semantics

### Consequences
- Server state and client state use different patterns (React Query vs Context)
- Developers must understand query key structures for cache invalidation
- DevTools are available for debugging cache state during development

---

## ADR-009: Dual Interface Architecture (Web UI + Copilot Extension)

### Status
Accepted

### Context
The system serves two personas: Retail Traders (via web browser) and Technical Validators (via VS Code). Both need access to the same AI analysis capabilities with the same compliance guarantees.

### Decision
Expose the backend through two interface paths: REST API for the React web UI, and a Copilot Extension webhook for VS Code integration. Both paths share the same middleware pipeline and service layer.

### Rationale
- **Code Reuse:** The Copilot endpoint reuses `IAiInsightService` and `ICopilotSkillRouter` -- no duplicated business logic
- **Compliance Consistency:** The Prudence middleware applies to both `/api/insight` and `/copilot` paths
- **Skill Routing:** Natural language prompts from VS Code are parsed into structured intents using the same categorization logic
- **Developer Experience:** The Technical Validator can query stock analysis directly from their IDE without switching contexts

### Consequences
- The Copilot Extension requires additional infrastructure (GitHub App registration, CLI authentication)
- Natural language parsing in the skill router may misclassify ambiguous prompts
- The Copilot response format must align with GitHub's extension protocol

---

## ADR-010: Static Market Data with Service Abstraction

### Status
Accepted

### Context
For the pilot phase, the system needs realistic market data without integrating live market feeds (which would add complexity and cost).

### Decision
Implement `MarketDataService` with static seeded data behind the `IMarketDataService` interface. The data structure mirrors real NSE/BSE data formats.

### Rationale
- **Rapid Prototyping:** Seeded data enables full end-to-end testing without external dependencies
- **Interface Stability:** The `IMarketDataService` interface defines the contract. A future `LiveMarketDataService` implementation can be swapped in without changing consumers
- **Realistic Structure:** Stock tickers, sectors, volumes, and price ranges match real NSE data
- **Deterministic Testing:** Static data enables repeatable integration tests

### Consequences
- Market data does not change over time (no intraday updates)
- Earnings data is only seeded for RELIANCE; other stocks show "N/A"
- The service must be replaced with a live data provider before production use

---

## ADR-011: Deterministic Policy Enforcement, Not LLM Prompts

### Status
Accepted

### Context
The platform must guarantee that no buy/sell/hold recommendation reaches a user, and that every AI interaction is auditable. A tempting implementation is to instruct the model itself: append policy rules to the system prompt ("never give investment advice") and trust the model to comply.

### Decision
Enforce policy with deterministic middleware (the Prudence layer) at explicit application boundaries — regex/word-boundary input and output validation, HTTP status codes, and hash-chained audit records. Prompt engineering remains in place as a soft layer, but it is never the control.

### Rationale
- **Probabilistic components cannot give deterministic guarantees.** A model can refuse 99.9% of advisory requests and still emit one on an unlucky sampling path. A control that is supposed to *never* fail cannot be built on a component with a temperature.
- **Prompt injection.** User input reaches the model verbatim. Any prompt-based policy can be attacked by the very text it is trying to police ("ignore previous instructions"). Middleware runs before and after the model, outside the reach of injected content.
- **Testability.** A middleware rule is a unit test: given disallowed input, assert HTTP 422. A prompt-based rule can only be tested statistically, by sampling, and a passing run does not prove the next run passes.
- **Auditability.** The audit trail records a machine-checkable policy verdict (`allowed`/`blocked`, matched rule, hashes) rather than an unverifiable claim that the model was asked to behave.
- **Clear ownership of failure modes.** When a blocked term slips through, the fix is a one-line rule change with a regression test. When a prompt-based control fails, the fix is prompt tinkering with no measurable before/after.

### Consequences
- The blocked-terms lexicon requires manual maintenance and can lag novel phrasings
- Word-boundary matching produces occasional false positives (ADR-004)
- Two enforcement layers exist (prompts + middleware); reviewers must understand that only the middleware is relied upon
- Deterministic rules cannot judge *intent* — subtle advisory framing that avoids the lexicon passes; the model-facing prompts remain the first line of defense for quality, just not for guarantees
