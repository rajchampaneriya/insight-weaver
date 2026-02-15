import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import {
  useMarketOverview,
  useUnusualMovers,
  useStockDetail,
  useNewsFeed,
  useSearchStocks,
} from "@/hooks/use-market-data";
import { vi } from "vitest";

const mockFetch = vi.fn();
global.fetch = mockFetch;

function mockJsonResponse(data: unknown) {
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    json: () => Promise.resolve(data),
  };
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
}

describe("use-market-data hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useMarketOverview", () => {
    it("should fetch and return market overview data", async () => {
      const mockData = {
        indices: [{ name: "NIFTY 50", value: 24856, change: 142, changePercent: 0.58 }],
        sectors: [{ name: "IT", change: 1.2 }],
      };
      mockFetch.mockResolvedValueOnce(mockJsonResponse(mockData));

      const { result } = renderHook(() => useMarketOverview(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.indices).toHaveLength(1);
      expect(result.current.data?.indices[0].name).toBe("NIFTY 50");
    });
  });

  describe("useUnusualMovers", () => {
    it("should fetch unusual movers", async () => {
      const mockData = [
        { ticker: "RELIANCE", name: "Reliance Industries", price: 2945 },
      ];
      mockFetch.mockResolvedValueOnce(mockJsonResponse(mockData));

      const { result } = renderHook(() => useUnusualMovers(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(1);
    });
  });

  describe("useStockDetail", () => {
    it("should fetch stock detail when ticker is provided", async () => {
      const mockData = {
        stock: { ticker: "RELIANCE", name: "Reliance Industries" },
        earnings: [],
        priceHistory: [],
        news: [],
      };
      mockFetch.mockResolvedValueOnce(mockJsonResponse(mockData));

      const { result } = renderHook(() => useStockDetail("RELIANCE"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.stock.ticker).toBe("RELIANCE");
    });

    it("should not fetch when ticker is empty", () => {
      const { result } = renderHook(() => useStockDetail(""), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
    });
  });

  describe("useNewsFeed", () => {
    it("should fetch news feed", async () => {
      const mockData = [{ id: "1", headline: "Test news" }];
      mockFetch.mockResolvedValueOnce(mockJsonResponse(mockData));

      const { result } = renderHook(() => useNewsFeed(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(1);
    });
  });

  describe("useSearchStocks", () => {
    it("should not search when query is empty", () => {
      const { result } = renderHook(() => useSearchStocks(""), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
    });

    it("should search when query is provided", async () => {
      const mockData = [{ ticker: "TCS", name: "Tata Consultancy Services" }];
      mockFetch.mockResolvedValueOnce(mockJsonResponse(mockData));

      const { result } = renderHook(() => useSearchStocks("Tata"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(1);
    });
  });
});
