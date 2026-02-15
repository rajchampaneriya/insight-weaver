# Copilot Instructions: Insight Weaver

## Project

Indian equities AI insight platform. .NET 10 backend + React 18 frontend.

## Architecture

- Backend: .NET 10 Minimal API with .NET Aspire orchestration
- AI: `Microsoft.Extensions.AI` abstraction (GitHub Models in dev, Azure OpenAI in prod)
- Frontend: React 18 + TypeScript + Vite + IBM Carbon (`@carbon/react`)
- Charts: `@carbon/charts-react` (not Recharts)
- State: React Query for server state, React Context for client state
- Emulators: Azurite (Azure Storage), Redis (cache) via Aspire-managed containers

## Code Conventions

### .NET

- Use Minimal API with endpoint groups, not controllers
- Register services via `Microsoft.Extensions.DependencyInjection`
- Use `IResult` return types for endpoints
- Use `record` types for request/response DTOs
- PrudenceMiddleware must wrap all AI endpoints
- Log compliance audit for every AI request/response
- Target `net10.0`

### React/TypeScript

- Use IBM Carbon components from `@carbon/react` (not Shadcn/Radix for page-level components)
- Use `@carbon/charts-react` for all data visualization
- Use `@carbon/icons-react` for icons
- Use React Query (`@tanstack/react-query`) for all API calls
- API client lives in `src/services/`
- No inline styles; use Carbon design tokens + Tailwind utilities for layout
- All user-facing text must include SEBI compliance disclaimers where applicable

### General

- No emojis in code, comments, or documentation
- Minimal documentation: code should be self-explanatory
- File names: kebab-case for .ts/.tsx, PascalCase for .cs
- Test files colocated: `*.test.ts` next to source, `*Tests.cs` in test project
- Environment switching via `ASPNETCORE_ENVIRONMENT` and Vite `import.meta.env`

## Domain Rules

- Never generate buy/sell/hold recommendations
- All AI responses must include "Not investment advice" disclaimer
- Indian market only: NSE/BSE tickers, INR currency
- Compliance audit trail for every AI interaction
