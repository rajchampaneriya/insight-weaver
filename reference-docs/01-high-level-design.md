# High-Level Design (HLD): The Idea Factory

**Project:** Insight Weaver (The Idea Factory)
**Version:** 1.0
**Date:** 2026-02-15
**Architect:** Raj Champaneriya

---

## 1. Executive Summary

The Idea Factory is an AI-powered insight platform for Indian equities (NSE/BSE). It aggregates publicly available market data and generates AI-driven analysis for retail traders, reducing manual research time by up to 90%. The platform is designed as an **Information Tool**, not an Advisory Engine, ensuring compliance with SEBI (Securities and Exchange Board of India) regulations by never generating buy/sell/hold recommendations.

The system serves two personas through two interfaces:
- **Retail Trader** -- via a React web application with IBM Carbon Design System
- **Technical Validator** -- via a VS Code GitHub Copilot Extension

Both interfaces share the same backend API and compliance pipeline, ensuring uniform governance regardless of access point.

---

## 2. Business Context

### 2.1 Problem Statement

| Stakeholder | Problem |
|---|---|
| Enterprise | Innovation in financial analytics stalls due to "budget friction" -- architects cannot test AI hypotheses without a full business case |
| Retail Investor | Struggles to interpret large volumes of fundamentals, price data, and news, leading to emotion-driven decisions |

### 2.2 Solution Approach

The Idea Factory is a **sanctioned local experiment** that proves an AI insight layer can be built rapidly using existing Azure credits and sandbox environments. It generates **evidence** (working prototypes with measurable outcomes) rather than theoretical business cases.

### 2.3 Key Business Goals

| Goal | Target | Measurement |
|---|---|---|
| Innovation Velocity | Idea to prototype in 2 weeks | Sprint burndown against delivery plan |
| Research Time Reduction | 90% reduction per stock idea | Comparative user task timing |
| Governance Compliance | Zero policy violations | Automated audit trail analysis |
| API Latency | P95 under 3 seconds | OpenTelemetry percentile metrics |

---

## 3. System Overview

The platform is built as a distributed application orchestrated by .NET Aspire. It consists of a React single-page application (frontend), a .NET 10 Minimal API (backend), and supporting infrastructure services (Redis cache, Azure Table Storage).

### 3.1 Logical Architecture

```mermaid
graph TD
    subgraph User_Interfaces
        RT[Retail Trader]
        TV[Technical Validator]
    end

    subgraph Frontend_Layer
        UI[React 18 plus IBM Carbon UI]
    end

    subgraph Copilot_Layer
        CE[VS Code Copilot Extension]
    end

    subgraph API_Gateway
        PM[Prudence Middleware]
        RL[Rate Limiter]
    end

    subgraph Backend_Services
        IE[Insight Endpoints]
        ME[Market Endpoints]
        GE[Governance Endpoints]
        CPE[Copilot Endpoints]
    end

    subgraph Application_Services
        AIS[AI Insight Service]
        MDS[Market Data Service]
        CSR[Copilot Skill Router]
        AUS[Audit Service]
    end

    subgraph External_Services
        AI[GitHub Models Dev or Azure OpenAI Prod]
        RD[Redis Cache]
        TS[Azure Table Storage]
    end

    RT --> UI
    TV --> CE
    UI --> RL
    CE --> RL
    RL --> PM
    PM --> IE
    PM --> ME
    PM --> GE
    PM --> CPE
    IE --> AIS
    IE --> MDS
    CPE --> CSR
    CPE --> AIS
    ME --> MDS
    GE --> AUS
    AIS --> AI
    AIS --> RD
    AUS --> TS
```

### 3.2 Deployment Architecture

```mermaid
graph TD
    subgraph Aspire_AppHost
        direction TB
        AH[NET Aspire Orchestrator]

        subgraph Managed_Resources
            Redis[Redis Container]
            Azurite[Azurite Storage Emulator]
        end

        subgraph Application_Projects
            API[IdeaFactory API - NET 10]
            ViteUI[React UI - Vite Dev Server]
        end

        AH --> Redis
        AH --> Azurite
        AH --> API
        AH --> ViteUI

        API --> Redis
        API --> Azurite
        ViteUI --> API
    end
```

### 3.3 System Boundaries

| Boundary | Inside | Outside |
|---|---|---|
| Data Scope | NSE/BSE cash equities only | Derivatives, international markets |
| AI Capability | Informational analysis only | Investment recommendations |
| Currency | INR only | Foreign currencies |
| Data Sources | Publicly available data | Proprietary or paid feeds |
| Phase 1 Scope | Core insight generation | Portfolio tracking, trade execution |

---

## 4. Component Summary

### 4.1 Frontend (React 18 + IBM Carbon)

The user-facing web application provides five primary views:

| Page | Purpose | Key Components |
|---|---|---|
| Dashboard | Market overview with indices, unusual movers, and news | MarketOverview, UnusualMovers, NewsFeed, QuickSearch |
| Stock Explorer | Deep-dive into individual stock data with AI briefs | Price charts, financials table, AI Brief panel |
| Watchlist | User-curated stock groups with live price data | Grouped tables and card views |
| AI Briefcase | AI-generated briefs for watchlist stocks | Peter Lynch-style analysis cards |
| Settings | Configuration and compliance information | SEBI disclaimers, responsible AI principles |

An AI Assistant panel (slide-out chat) is accessible from any page via the header.

### 4.2 Backend API (.NET 10 Minimal API)

The backend exposes four endpoint groups:

| Group | Base Path | Purpose |
|---|---|---|
| Insight | /api/insight | AI-generated stock analysis (today view, brief, explain, chat) |
| Market | /api/market | Market data (indices, movers, stock details, news, search) |
| Governance | /api/governance | Compliance audit reports and raw audit records |
| Copilot | /copilot | VS Code Copilot Extension webhook with skill routing |

### 4.3 Middleware Pipeline

Every HTTP request passes through:

1. **CORS** -- Allows frontend origins (localhost:8080, 5173, 3000)
2. **Rate Limiter** -- 10 req/min for AI endpoints, 120 req/min global per IP
3. **Prudence Middleware** -- Compliance validation for AI-related paths

### 4.4 Infrastructure Services

| Service | Purpose | Provider |
|---|---|---|
| Redis | Response caching with 15-minute TTL | Aspire-managed container (dev), Azure Cache (prod) |
| Azure Table Storage | Compliance audit trail persistence | Azurite emulator (dev), Azure Storage (prod) |
| GitHub Models | AI model inference | GitHub Copilot SDK (dev) |
| Azure OpenAI | AI model inference | Azure OpenAI Service (prod) |

---

## 5. Key Design Principles

### 5.1 Governance First

The Prudence compliance layer was built **before** any AI endpoint. Every AI interaction is:
- Validated for forbidden terms (input compliance)
- Checked for prohibited response patterns (output compliance)
- Logged with full audit trail (prompt hash, response hash, policy result, duration)
- Tagged with SEBI disclaimer headers

### 5.2 Provider-Agnostic AI

The `Microsoft.Extensions.AI` abstraction layer (`IChatClient`) allows switching between GitHub Models (development) and Azure OpenAI (production) through configuration only. No business logic changes required.

### 5.3 Dual Interface, Single Pipeline

Both the web UI and the VS Code Copilot Extension share:
- The same AI service layer
- The same compliance middleware
- The same audit trail
- The same rate limiting policies

### 5.4 Cache-Aware Design

AI responses are cached in Redis with a 15-minute TTL. Cache keys incorporate the ticker, insight type, and a hash of the context to ensure cache correctness while reducing AI inference costs.

---

## 6. Technology Stack

```mermaid
graph LR
    subgraph Frontend
        React[React 18]
        TS[TypeScript]
        Vite[Vite]
        Carbon[IBM Carbon Design System]
        CarbonCharts[IBM Carbon Charts]
        ReactQuery[TanStack React Query]
    end

    subgraph Backend
        DotNet[NET 10]
        MinimalAPI[Minimal API]
        Aspire[NET Aspire]
        MEAI[Microsoft Extensions AI]
        CopilotSDK[GitHub Copilot SDK]
    end

    subgraph Infrastructure
        RedisInfra[Redis]
        AzureTable[Azure Table Storage]
        OTel[OpenTelemetry]
    end

    React --> TS
    TS --> Vite
    React --> Carbon
    React --> CarbonCharts
    React --> ReactQuery

    DotNet --> MinimalAPI
    DotNet --> Aspire
    DotNet --> MEAI
    DotNet --> CopilotSDK

    MinimalAPI --> RedisInfra
    MinimalAPI --> AzureTable
    Aspire --> OTel
```

---

## 7. Non-Functional Requirements

| Requirement | Target | Implementation |
|---|---|---|
| Latency | P95 under 3 seconds | Redis caching, efficient prompt templates |
| Availability | 99.9% for APIs during pilot | Health checks via Aspire defaults |
| Security | No hardcoded secrets | Azure Managed Identity (prod), environment variables (dev) |
| Compliance | Zero policy violations | Prudence middleware with automated audit trail |
| Cost Control | Hard limits on Azure spending | Aggressive caching, rate limiting |
| Observability | Full distributed tracing | OpenTelemetry via Aspire ServiceDefaults |

---

## 8. Data Flow Summary

```mermaid
sequenceDiagram
    participant User
    participant ReactUI
    participant RateLimiter
    participant PrudenceMiddleware
    participant InsightEndpoint
    participant AiInsightService
    participant Redis
    participant AIModel
    participant AuditService
    participant TableStorage

    User->>ReactUI: Search for stock ticker
    ReactUI->>RateLimiter: POST /api/insight/brief
    RateLimiter->>PrudenceMiddleware: Forward request
    PrudenceMiddleware->>PrudenceMiddleware: Validate input against forbidden terms

    alt Input contains forbidden terms
        PrudenceMiddleware->>AuditService: Record BLOCKED audit
        AuditService->>TableStorage: Store audit record
        PrudenceMiddleware->>ReactUI: 422 Compliance Violation
    else Input is clean
        PrudenceMiddleware->>InsightEndpoint: Forward to endpoint
        InsightEndpoint->>AiInsightService: GenerateInsightAsync
        AiInsightService->>Redis: Check cache
        alt Cache hit
            Redis->>AiInsightService: Return cached response
        else Cache miss
            AiInsightService->>AIModel: Send prompt with system instructions
            AIModel->>AiInsightService: Return AI response
            AiInsightService->>Redis: Cache response with 15 min TTL
        end
        AiInsightService->>InsightEndpoint: Return content
        InsightEndpoint->>PrudenceMiddleware: Return response
        PrudenceMiddleware->>PrudenceMiddleware: Validate output against forbidden patterns
        PrudenceMiddleware->>AuditService: Record PASS or OUTPUT_VIOLATION audit
        AuditService->>TableStorage: Store audit record
        PrudenceMiddleware->>ReactUI: 200 OK with SEBI headers
    end
    ReactUI->>User: Display AI analysis with disclaimer
```

---

## 9. Risk Summary

| Risk | Impact | Mitigation |
|---|---|---|
| GitHub Models rate limits | Medium | Aggressive Redis caching, mock responses for UI development |
| SEBI compliance false positives | Low | Tunable forbidden term list with whole-word matching |
| AI hallucination in responses | Medium | Strict system prompts, output validation, mandatory disclaimers |
| Azure cold start latency | Medium | Pre-warm strategy, cache frequent queries |
| .NET 10 preview instability | Low | Pinned SDK version in global.json |
