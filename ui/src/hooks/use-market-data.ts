import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchMarketOverview,
  fetchUnusualMovers,
  fetchStockDetail,
  fetchNewsFeed,
  fetchInsightBrief,
  fetchTodayView,
  fetchExplainMovement,
  sendChatMessage,
  searchStocks,
} from "@/services/market-service";

export function useMarketOverview() {
  return useQuery({
    queryKey: ["market", "overview"],
    queryFn: fetchMarketOverview,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useUnusualMovers() {
  return useQuery({
    queryKey: ["market", "movers"],
    queryFn: fetchUnusualMovers,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useStockDetail(ticker: string) {
  return useQuery({
    queryKey: ["market", "stock", ticker],
    queryFn: () => fetchStockDetail(ticker),
    enabled: !!ticker,
    staleTime: 30_000,
  });
}

export function useNewsFeed(ticker?: string) {
  return useQuery({
    queryKey: ["market", "news", ticker ?? "all"],
    queryFn: () => fetchNewsFeed(ticker),
    refetchInterval: 120_000,
    staleTime: 60_000,
  });
}

export function useSearchStocks(query: string) {
  return useQuery({
    queryKey: ["market", "search", query],
    queryFn: () => searchStocks(query),
    enabled: query.length > 0,
    staleTime: 60_000,
  });
}

export function useInsightBrief(ticker: string) {
  return useQuery({
    queryKey: ["insight", "brief", ticker],
    queryFn: () => fetchInsightBrief(ticker),
    enabled: false, // manually triggered
    staleTime: 15 * 60_000,
  });
}

export function useTodayView(ticker: string) {
  return useQuery({
    queryKey: ["insight", "today", ticker],
    queryFn: () => fetchTodayView(ticker),
    enabled: false,
    staleTime: 15 * 60_000,
  });
}

export function useExplainMovement(ticker: string, context?: string) {
  return useQuery({
    queryKey: ["insight", "explain", ticker],
    queryFn: () => fetchExplainMovement(ticker, context),
    enabled: false,
    staleTime: 15 * 60_000,
  });
}

export function useChatMutation() {
  return useMutation({
    mutationFn: ({ question, ticker }: { question: string; ticker?: string }) =>
      sendChatMessage(question, ticker),
  });
}
