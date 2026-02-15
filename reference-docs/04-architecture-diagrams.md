# Architecture Diagrams: The Idea Factory

**Project:** Insight Weaver (The Idea Factory)
**Method:** IBM Architecture Method (Logical, Functional, Operational Views)
**Date:** 2026-02-15

---

## 1. Logical Architecture View

This diagram shows the logical decomposition of the system into functional areas, independent of technology choices.

```mermaid
graph TB
    subgraph Presentation_Layer
        WEB[Web Application]
        IDE[IDE Extension]
    end

    subgraph Experience_API_Layer
        INSIGHT_API[Insight API]
        MARKET_API[Market Data API]
        GOVERNANCE_API[Governance API]
        COPILOT_API[Copilot Webhook API]
    end

    subgraph Business_Logic_Layer
        COMPLIANCE[Compliance Engine]
        AI_ANALYSIS[AI Analysis Engine]
        SKILL_ROUTING[Intent and Skill Router]
        DATA_AGGREGATION[Market Data Aggregation]
        AUDIT_MANAGEMENT[Audit Management]
    end

    subgraph Integration_Layer
        AI_PROVIDER[AI Model Provider]
        CACHE_PROVIDER[Cache Provider]
        STORAGE_PROVIDER[Persistent Storage Provider]
    end

    WEB --> INSIGHT_API
    WEB --> MARKET_API
    IDE --> COPILOT_API

    INSIGHT_API --> COMPLIANCE
    COPILOT_API --> COMPLIANCE
    COPILOT_API --> SKILL_ROUTING

    COMPLIANCE --> AI_ANALYSIS
    COMPLIANCE --> AUDIT_MANAGEMENT
    SKILL_ROUTING --> AI_ANALYSIS

    MARKET_API --> DATA_AGGREGATION
    GOVERNANCE_API --> AUDIT_MANAGEMENT

    AI_ANALYSIS --> AI_PROVIDER
    AI_ANALYSIS --> CACHE_PROVIDER
    AUDIT_MANAGEMENT --> STORAGE_PROVIDER
```

---

## 2. Functional Component Model

This diagram shows the functional components and their responsibilities within each layer.

```mermaid
graph LR
    subgraph Presentation
        direction TB
        Dashboard_View[Dashboard View]
        Explorer_View[Stock Explorer View]
        Watchlist_View[Watchlist View]
        Briefcase_View[AI Briefcase View]
        Assistant_View[AI Chat Assistant]
        Copilot_View[VS Code Copilot Chat]
    end

    subgraph API_Surface
        direction TB
        Today_Endpoint[Today View Endpoint]
        Brief_Endpoint[Brief Endpoint]
        Explain_Endpoint[Explain Movement Endpoint]
        Chat_Endpoint[Chat Endpoint]
        Market_Endpoints[Market Data Endpoints]
        Governance_Endpoint[Governance Report Endpoint]
        Copilot_Resolve[Copilot Resolve Endpoint]
    end

    subgraph Core_Services
        direction TB
        AI_Insight[AI Insight Service]
        Market_Data[Market Data Service]
        Skill_Router[Copilot Skill Router]
        Audit_Svc[Audit Service]
    end

    subgraph Cross_Cutting
        direction TB
        Prudence[Prudence Middleware]
        Rate_Limit[Rate Limiter]
        CORS_Handler[CORS Handler]
        Telemetry[OpenTelemetry]
        Health[Health Checks]
    end

    Dashboard_View --> Market_Endpoints
    Dashboard_View --> Explain_Endpoint
    Explorer_View --> Market_Endpoints
    Explorer_View --> Brief_Endpoint
    Watchlist_View --> Market_Endpoints
    Briefcase_View --> Market_Endpoints
    Assistant_View --> Chat_Endpoint
    Copilot_View --> Copilot_Resolve

    Today_Endpoint --> AI_Insight
    Brief_Endpoint --> AI_Insight
    Explain_Endpoint --> AI_Insight
    Chat_Endpoint --> AI_Insight
    Market_Endpoints --> Market_Data
    Governance_Endpoint --> Audit_Svc
    Copilot_Resolve --> Skill_Router
    Copilot_Resolve --> AI_Insight
```

---

## 3. Operational Deployment View

This diagram shows how the system components are deployed in the development environment.

```mermaid
graph TD
    subgraph Developer_Machine
        subgraph Aspire_Dashboard
            DASH[Aspire Developer Dashboard]
        end

        subgraph Aspire_Managed_Containers
            REDIS_C[Redis Container - Port 6379]
            AZURITE_C[Azurite Container - Port 10000]
        end

        subgraph Dotnet_Process
            APPHOST[IdeaFactory AppHost - Orchestrator]
            API_PROC[IdeaFactory API - Port 5074]
        end

        subgraph Node_Process
            VITE[Vite Dev Server - Port 8080]
        end
    end

    subgraph External_Cloud
        GH_MODELS[GitHub Models API]
    end

    APPHOST --> REDIS_C
    APPHOST --> AZURITE_C
    APPHOST --> API_PROC
    APPHOST --> VITE
    APPHOST --> DASH

    API_PROC --> REDIS_C
    API_PROC --> AZURITE_C
    API_PROC --> GH_MODELS

    VITE -->|Proxy /api and /copilot| API_PROC
```

---

## 4. Production Deployment View (Target State)

```mermaid
graph TD
    subgraph Azure_Cloud
        subgraph Azure_Container_Apps
            API_PROD[IdeaFactory API]
            UI_PROD[React UI - Static Files via nginx]
        end

        subgraph Azure_Services
            AOAI[Azure OpenAI Service]
            AIS[Azure AI Search]
            ADI[Azure Document Intelligence]
        end

        subgraph Azure_Infrastructure
            REDIS_PROD[Azure Cache for Redis]
            TABLE_PROD[Azure Table Storage]
            KV[Azure Key Vault]
            MI[Managed Identity]
            MONITOR[Azure Monitor]
        end
    end

    subgraph Users
        TRADER[Retail Trader - Browser]
        ARCHITECT[Technical Validator - VS Code]
    end

    TRADER --> UI_PROD
    UI_PROD --> API_PROD
    ARCHITECT --> API_PROD

    API_PROD --> AOAI
    API_PROD --> AIS
    API_PROD --> ADI
    API_PROD --> REDIS_PROD
    API_PROD --> TABLE_PROD
    API_PROD --> KV
    API_PROD --> MI
    API_PROD --> MONITOR
```

---

## 5. Data Flow: Stock Research Scenario

This sequence diagram shows the end-to-end flow when a user researches a stock.

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant ViteProxy
    participant RateLimiter
    participant Prudence
    participant InsightEndpoint
    participant AiInsightService
    participant RedisCache
    participant AIModel
    participant AuditService
    participant TableStorage

    User->>Browser: Navigate to Stock Explorer for RELIANCE
    Browser->>ViteProxy: GET /api/market/stock/RELIANCE
    ViteProxy->>RateLimiter: Forward to API
    RateLimiter->>Prudence: Check rate limit PASS
    Note over Prudence: Path /api/market not in monitored paths
    Prudence->>InsightEndpoint: Pass through
    InsightEndpoint->>Browser: Return stock detail JSON

    User->>Browser: Click Generate AI Brief
    Browser->>ViteProxy: POST /api/insight/brief with ticker RELIANCE
    ViteProxy->>RateLimiter: Forward to API
    RateLimiter->>Prudence: Check rate limit PASS

    Prudence->>Prudence: Read request body
    Prudence->>Prudence: Compute SHA256 hash
    Prudence->>Prudence: Validate input - no forbidden terms

    Prudence->>InsightEndpoint: Forward clean request
    InsightEndpoint->>AiInsightService: GenerateInsightAsync RELIANCE brief

    AiInsightService->>RedisCache: GET insight_brief_RELIANCE_hash
    alt Cache Hit
        RedisCache->>AiInsightService: Return cached content
    else Cache Miss
        AiInsightService->>AiInsightService: Build system prompt for brief type
        AiInsightService->>AiInsightService: Build user prompt for RELIANCE
        AiInsightService->>AIModel: Send system plus user messages
        AIModel->>AiInsightService: Return AI generated analysis
        AiInsightService->>RedisCache: SET with 15 min TTL
    end

    AiInsightService->>InsightEndpoint: Return content string
    InsightEndpoint->>Prudence: Return InsightResponse JSON

    Prudence->>Prudence: Read response body
    Prudence->>Prudence: Compute SHA256 hash
    Prudence->>Prudence: Validate output - check forbidden patterns
    Prudence->>AuditService: Record compliance audit
    AuditService->>TableStorage: Store ComplianceAudit entity
    Prudence->>Browser: Return response with SEBI headers

    Browser->>User: Display 4 section Peter Lynch brief
```

---

## 6. Data Flow: Copilot Extension Scenario

```mermaid
sequenceDiagram
    actor Architect
    participant VSCode
    participant CopilotEndpoint
    participant SkillRouter
    participant AiInsightService
    participant RedisCache
    participant AIModel
    participant Prudence
    participant AuditService

    Architect->>VSCode: Type at idea_factory what changed for RELIANCE today
    VSCode->>CopilotEndpoint: POST /copilot/resolve prompt text

    Note over Prudence: Prudence middleware intercepts /copilot path
    Prudence->>Prudence: Validate input compliance

    CopilotEndpoint->>SkillRouter: RouteIntent with prompt

    SkillRouter->>SkillRouter: ExtractTicker finds RELIANCE
    SkillRouter->>SkillRouter: ClassifyIntent matches today keywords
    SkillRouter->>CopilotEndpoint: Return today RELIANCE context

    CopilotEndpoint->>AiInsightService: GenerateInsightAsync RELIANCE today context
    AiInsightService->>RedisCache: Check cache
    RedisCache->>AiInsightService: Cache miss
    AiInsightService->>AIModel: Send today prompt for RELIANCE
    AIModel->>AiInsightService: Return daily analysis
    AiInsightService->>RedisCache: Cache response
    AiInsightService->>CopilotEndpoint: Return content

    CopilotEndpoint->>Prudence: Return CopilotResponse
    Prudence->>Prudence: Validate output compliance
    Prudence->>AuditService: Record audit
    Prudence->>VSCode: Return JSON with content and disclaimer
    VSCode->>Architect: Display analysis in Copilot Chat
```

---

## 7. Component Interaction: Compliance Pipeline

```mermaid
flowchart TD
    A[HTTP Request] --> B[CORS Middleware]
    B --> C[Rate Limiter]
    C --> D{Rate limit exceeded?}
    D -->|Yes| E[Return 429 Too Many Requests]
    D -->|No| F[Prudence Middleware]

    F --> G{Is monitored path?}
    G -->|No| H[Pass to endpoint handler]
    G -->|Yes| I[Buffer request body]

    I --> J[SHA256 hash of request]
    J --> K[Input validation]
    K --> L{Contains forbidden terms?}

    L -->|Yes| M[Create BLOCKED audit]
    M --> N[Store in Table Storage]
    N --> O[Return 422 with compliance message]

    L -->|No| P[Add SEBI disclaimer header]
    P --> Q[Execute endpoint handler]
    Q --> R[Read response body]
    R --> S[SHA256 hash of response]
    S --> T[Output validation]

    T --> U{Contains forbidden patterns?}
    U -->|Yes| V[Policy: OUTPUT_VIOLATION]
    U -->|No| W[Policy: PASS]

    V --> X[Create audit record]
    W --> X
    X --> Y[Add audit trail header]
    Y --> Z[Store audit in Table Storage]
    Z --> AA[Return response to client]
```

---

## 8. Frontend Component Hierarchy

```mermaid
graph TD
    APP[App] --> QCP[QueryClientProvider]
    QCP --> THEME[Carbon Theme Provider]
    THEME --> WLP[Watchlist Provider]
    WLP --> ROUTER[BrowserRouter]

    ROUTER --> SHELL[AppShell Layout]
    ROUTER --> NF[NotFound Page]

    SHELL --> HEADER[AppHeader]
    SHELL --> SIDEBAR[AppSidebar]
    SHELL --> CONTENT[Page Content via Outlet]
    SHELL --> BANNER[ComplianceBanner]
    SHELL --> ASSISTANT[AssistantPanel]

    CONTENT --> DASH[Dashboard Page]
    CONTENT --> EXPLORER[StockExplorer Page]
    CONTENT --> WATCH[Watchlist Page]
    CONTENT --> BRIEF[Briefcase Page]
    CONTENT --> SETTINGS[Settings Page]

    DASH --> MO[MarketOverview]
    DASH --> UM[UnusualMovers]
    DASH --> NEWSFEED[NewsFeed]
    DASH --> QS[QuickSearch]

    EXPLORER --> TABS[Carbon Tabs]
    TABS --> OVERVIEW[Overview Tab]
    TABS --> NEWS[News Tab]
    TABS --> FIN[Financials Tab]
    TABS --> AIBRIEF[AI Brief Tab]

    OVERVIEW --> CHART[Carbon LineChart]
    OVERVIEW --> METRICS[Metric Tiles]
```

---

## 9. State Management Architecture

```mermaid
graph LR
    subgraph Server_State_React_Query
        MO_QUERY[Market Overview Query - 60s refresh]
        MOVERS_QUERY[Unusual Movers Query - 60s refresh]
        STOCK_QUERY[Stock Detail Query - on demand]
        NEWS_QUERY[News Feed Query - 120s refresh]
        SEARCH_QUERY[Search Query - on type]
        BRIEF_QUERY[AI Brief Query - manual trigger]
        TODAY_QUERY[Today View Query - manual trigger]
        EXPLAIN_QUERY[Explain Query - manual trigger]
    end

    subgraph Client_State_React_Context
        WATCHLIST[Watchlist Context]
        THEME_STATE[Theme State - dark or light]
        ASSISTANT_STATE[Assistant Panel State - open or closed]
        SIDENAV_STATE[SideNav State - expanded or collapsed]
    end

    subgraph Mutations
        CHAT_MUTATION[Chat Mutation - POST /api/insight/chat]
    end

    MO_QUERY --> Dashboard
    MOVERS_QUERY --> Dashboard
    NEWS_QUERY --> Dashboard
    STOCK_QUERY --> StockExplorer
    BRIEF_QUERY --> StockExplorer
    SEARCH_QUERY --> QuickSearch

    WATCHLIST --> Watchlist_Page
    WATCHLIST --> Briefcase_Page

    CHAT_MUTATION --> AssistantPanel
```

---

## 10. Technology Layer Map (IBM Architecture Method)

```mermaid
graph TB
    subgraph Business_Architecture
        BA1[Retail Stock Research]
        BA2[AI Driven Market Analysis]
        BA3[Regulatory Compliance]
        BA4[Innovation Experimentation]
    end

    subgraph Application_Architecture
        AA1[React Web Application]
        AA2[VS Code Copilot Extension]
        AA3[NET 10 Minimal API]
        AA4[AI Insight Engine]
        AA5[Compliance Engine]
    end

    subgraph Data_Architecture
        DA1[Market Data Model]
        DA2[Compliance Audit Records]
        DA3[AI Response Cache]
        DA4[User Watchlist State]
    end

    subgraph Technology_Architecture
        TA1[React 18 and TypeScript]
        TA2[IBM Carbon Design System]
        TA3[NET 10 and Aspire]
        TA4[GitHub Models and Azure OpenAI]
        TA5[Redis]
        TA6[Azure Table Storage]
        TA7[OpenTelemetry]
        TA8[Docker]
    end

    BA1 --> AA1
    BA1 --> AA2
    BA2 --> AA4
    BA3 --> AA5
    BA4 --> AA3

    AA1 --> DA1
    AA1 --> DA4
    AA4 --> DA3
    AA5 --> DA2

    DA1 --> TA3
    DA2 --> TA6
    DA3 --> TA5
    AA1 --> TA1
    AA1 --> TA2
    AA3 --> TA3
    AA4 --> TA4
    AA3 --> TA7
    TA3 --> TA8
```
