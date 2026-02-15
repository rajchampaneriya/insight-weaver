

# The Idea Factory – AI Insights for Indian Equities

## Design System
- IBM Carbon Design-inspired UI: neutral grays, 14px base type, productive spacing, flat/minimal aesthetic with strong information hierarchy
- Dark mode as default (trading terminal feel), with light mode toggle
- Monospace fonts for financial data, sans-serif (IBM Plex Sans) for UI text

## Pages & Layout

### 1. Shell / Navigation
- Carbon-style top header with app name "Idea Factory" and "Pilot #001" badge
- Left sidebar navigation: Dashboard, Watchlist, Stock Explorer, AI Briefcase, Settings
- Persistent compliance disclaimer banner at bottom: "For informational purposes only. Not investment advice."

### 2. Dashboard – "What Changed Today?"
- Market overview bar: NIFTY 50, SENSEX, sector heatmap tiles
- "Unusual Movers" table: stocks with abnormal price/volume, with placeholder columns for AI-generated explanations
- News feed panel with sentiment indicators (positive/neutral/negative badges)
- Quick search bar to jump to any NSE/BSE stock

### 3. Stock Explorer – Single Stock View
- Stock header: name, ticker, price, daily change, sector tag
- Tabbed layout:
  - **Overview**: Key metrics cards (P/E, Market Cap, 52W range, etc.), price chart placeholder (using Recharts)
  - **News & Sentiment**: List of recent news items with sentiment badges
  - **Financials**: Earnings table with quarterly data placeholders
  - **AI Brief**: Peter Lynch-style 1-page investment brief layout (business model summary, key metrics, risks, moat analysis) — static template ready for AI content

### 4. Watchlist / Briefcase
- User-created lists of stocks displayed as cards or table view (toggle)
- Each entry shows: ticker, last price, change, sentiment indicator, brief status
- Add/remove stocks, organize into custom groups
- All data stored in local state (ready for Supabase later)

### 5. Conversational Assistant Panel
- Slide-out right panel with chat interface
- Pre-built prompt suggestions: "Explain today's move for RELIANCE", "Summarize latest earnings for TCS"
- Message bubbles with placeholder AI responses
- Input box with send button

### 6. Settings
- Theme toggle (dark/light)
- Disclaimer & compliance info page
- About section explaining the Idea Factory concept

## Key UI Components
- Carbon-style data tables with sorting and filtering
- Metric cards with labels and trend indicators
- Sentiment badges (green/yellow/red)
- Risk disclosure cards throughout the app
- Skeleton loaders on all data sections (ready for async integration)

## Compliance & Responsible AI (Built-in from Day 1)
- Every AI-generated section includes "AI-Generated • Not Financial Advice" label
- Audit trail placeholder UI on AI Brief page
- SEBI-aligned disclaimers on all insight surfaces

