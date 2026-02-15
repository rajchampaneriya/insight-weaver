import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchMarketOverview,
  fetchUnusualMovers,
  fetchStockDetail,
  fetchNewsFeed,
  searchStocks,
  fetchTodayView,
  fetchInsightBrief,
  fetchExplainMovement,
  sendChatMessage,
} from "@/services/market-service";

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  vi.clearAllMocks();
});

function mockJsonResponse(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    json: () => Promise.resolve(data),
  };
}

describe("market-service", () => {
  describe("fetchMarketOverview", () => {
    it("should fetch market indices and sectors", async () => {
      const mockData = {
        indices: [{ name: "NIFTY 50", value: 24856, change: 142, changePercent: 0.58 }],
        sectors: [{ name: "IT", change: 1.2 }],
      };
      mockFetch.mockResolvedValueOnce(mockJsonResponse(mockData));

      const result = await fetchMarketOverview();

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/market/indices",
        expect.objectContaining({ method: "GET" })
      );
      expect(result.indices).toHaveLength(1);
      expect(result.indices[0].name).toBe("NIFTY 50");
    });
  });

  describe("fetchUnusualMovers", () => {
    it("should fetch unusual movers", async () => {
      const mockData = [
        { ticker: "RELIANCE", name: "Reliance Industries", price: 2945 },
      ];
      mockFetch.mockResolvedValueOnce(mockJsonResponse(mockData));

      const result = await fetchUnusualMovers();

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/market/movers",
        expect.objectContaining({ method: "GET" })
      );
      expect(result).toHaveLength(1);
    });
  });

  describe("fetchStockDetail", () => {
    it("should fetch stock detail by ticker", async () => {
      const mockData = {
        stock: { ticker: "RELIANCE", name: "Reliance Industries" },
        earnings: [],
        priceHistory: [],
        news: [],
      };
      mockFetch.mockResolvedValueOnce(mockJsonResponse(mockData));

      const result = await fetchStockDetail("RELIANCE");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/market/stock/RELIANCE",
        expect.objectContaining({ method: "GET" })
      );
      expect(result.stock.ticker).toBe("RELIANCE");
    });
  });

  describe("fetchNewsFeed", () => {
    it("should fetch all news without ticker filter", async () => {
      const mockData = [{ id: "1", headline: "Test news" }];
      mockFetch.mockResolvedValueOnce(mockJsonResponse(mockData));

      const result = await fetchNewsFeed();

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/market/news",
        expect.objectContaining({ method: "GET" })
      );
      expect(result).toHaveLength(1);
    });

    it("should fetch news filtered by ticker", async () => {
      const mockData = [{ id: "1", headline: "RELIANCE news", ticker: "RELIANCE" }];
      mockFetch.mockResolvedValueOnce(mockJsonResponse(mockData));

      const result = await fetchNewsFeed("RELIANCE");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/market/news?ticker=RELIANCE",
        expect.objectContaining({ method: "GET" })
      );
      expect(result).toHaveLength(1);
    });
  });

  describe("searchStocks", () => {
    it("should search stocks by query", async () => {
      const mockData = [{ ticker: "TCS", name: "Tata Consultancy Services" }];
      mockFetch.mockResolvedValueOnce(mockJsonResponse(mockData));

      const result = await searchStocks("Tata");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/market/search?q=Tata",
        expect.objectContaining({ method: "GET" })
      );
      expect(result).toHaveLength(1);
    });
  });

  describe("fetchTodayView", () => {
    it("should post today view request", async () => {
      const mockData = {
        ticker: "RELIANCE",
        insightType: "today",
        content: "Analysis content",
        disclaimer: "Not investment advice",
      };
      mockFetch.mockResolvedValueOnce(mockJsonResponse(mockData));

      const result = await fetchTodayView("RELIANCE");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/insight/today",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ ticker: "RELIANCE" }),
        })
      );
      expect(result.ticker).toBe("RELIANCE");
    });
  });

  describe("fetchInsightBrief", () => {
    it("should post brief request", async () => {
      const mockData = {
        ticker: "TCS",
        insightType: "brief",
        content: "Brief content",
        disclaimer: "Not investment advice",
      };
      mockFetch.mockResolvedValueOnce(mockJsonResponse(mockData));

      const result = await fetchInsightBrief("TCS");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/insight/brief",
        expect.objectContaining({ method: "POST" })
      );
      expect(result.insightType).toBe("brief");
    });
  });

  describe("sendChatMessage", () => {
    it("should send chat message with ticker", async () => {
      const mockData = {
        answer: "Test answer",
        ticker: "INFY",
        disclaimer: "Not investment advice",
      };
      mockFetch.mockResolvedValueOnce(mockJsonResponse(mockData));

      const result = await sendChatMessage("How is INFY performing?", "INFY");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/insight/chat",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ question: "How is INFY performing?", ticker: "INFY" }),
        })
      );
      expect(result.answer).toBe("Test answer");
    });
  });

  describe("error handling", () => {
    it("should throw ApiError on non-OK response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: () => Promise.resolve({ error: "server_error" }),
      });

      await expect(fetchMarketOverview()).rejects.toThrow("API Error 500");
    });
  });
});
