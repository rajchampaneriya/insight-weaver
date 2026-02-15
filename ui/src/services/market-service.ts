import { apiClient } from "./api-client";

// -- Types matching backend models --

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface SectorPerformance {
  name: string;
  change: number;
}

export interface MarketOverviewResponse {
  indices: MarketIndex[];
  sectors: SectorPerformance[];
}

export interface StockDetail {
  ticker: string;
  name: string;
  exchange: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume: number;
  marketCap: string;
  pe: number;
  high52W: number;
  low52W: number;
  lastUpdated: string;
}

export interface QuarterlyEarning {
  quarter: string;
  revenue: string;
  pat: string;
  epsGrowth: string;
  margin: string;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  time: string;
  sentiment: "positive" | "neutral" | "negative";
  ticker?: string;
}

export interface StockDetailResponse {
  stock: StockDetail;
  earnings: QuarterlyEarning[];
  priceHistory: PricePoint[];
  news: NewsItem[];
}

export interface InsightResponse {
  ticker: string;
  insightType: string;
  content: string;
  disclaimer: string;
  generatedAt: string;
  sources: string[];
}

export interface ChatResponse {
  answer: string;
  ticker?: string;
  disclaimer: string;
  generatedAt: string;
}

// -- API functions --

export function fetchMarketOverview(): Promise<MarketOverviewResponse> {
  return apiClient.get("/api/market/indices");
}

export function fetchUnusualMovers(): Promise<StockDetail[]> {
  return apiClient.get("/api/market/movers");
}

export function fetchStockDetail(ticker: string): Promise<StockDetailResponse> {
  return apiClient.get(`/api/market/stock/${ticker}`);
}

export function fetchNewsFeed(ticker?: string): Promise<NewsItem[]> {
  const query = ticker ? `?ticker=${ticker}` : "";
  return apiClient.get(`/api/market/news${query}`);
}

export function searchStocks(query: string): Promise<StockDetail[]> {
  return apiClient.get(`/api/market/search?q=${encodeURIComponent(query)}`);
}

export function fetchTodayView(ticker: string, context?: string): Promise<InsightResponse> {
  return apiClient.post("/api/insight/today", { ticker, context });
}

export function fetchInsightBrief(ticker: string): Promise<InsightResponse> {
  return apiClient.post("/api/insight/brief", { ticker });
}

export function fetchExplainMovement(ticker: string, context?: string): Promise<InsightResponse> {
  return apiClient.post("/api/insight/explain", { ticker, context });
}

export function sendChatMessage(question: string, ticker?: string): Promise<ChatResponse> {
  return apiClient.post("/api/insight/chat", { question, ticker });
}
