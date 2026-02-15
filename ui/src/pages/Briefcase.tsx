import { useWatchlist } from "@/lib/watchlist-store";
import { fetchStockDetail } from "@/services/market-service";
import {
  ClickableTile,
  Tag,
  SkeletonPlaceholder,
  InlineNotification,
} from "@carbon/react";
import { ArrowUp, ArrowDown, Portfolio } from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function Briefcase() {
  const { allTickers } = useWatchlist();
  const navigate = useNavigate();

  const { data: stocks = [], isLoading } = useQuery({
    queryKey: ["briefcase-stocks", allTickers.join(",")],
    queryFn: async () => {
      const results = await Promise.allSettled(
        allTickers.map((t) => fetchStockDetail(t))
      );
      return results
        .filter(
          (r): r is PromiseFulfilledResult<
            Awaited<ReturnType<typeof fetchStockDetail>>
          > => r.status === "fulfilled"
        )
        .map((r) => r.value.stock);
    },
    enabled: allTickers.length > 0,
    staleTime: 30_000,
  });

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <div className="flex items-center gap-2">
          <Portfolio size={20} />
          <h1 className="text-xl font-semibold">AI Briefcase</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          AI-generated investment briefs for your watchlist stocks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <SkeletonPlaceholder key={i} className="h-40 w-full" />
            ))
          : stocks.map((stock) => (
              <ClickableTile
                key={stock.ticker}
                onClick={() => navigate(`/explorer/${stock.ticker}`)}
                className="p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-data text-sm font-semibold">
                      {stock.ticker}
                    </span>
                    <Tag type="gray" size="sm">
                      {stock.sector}
                    </Tag>
                  </div>
                  <span
                    className={`font-mono-data text-xs flex items-center gap-0.5 ${
                      stock.change >= 0
                        ? "text-carbon-success"
                        : "text-carbon-danger"
                    }`}
                  >
                    {stock.change >= 0 ? (
                      <ArrowUp size={12} />
                    ) : (
                      <ArrowDown size={12} />
                    )}
                    {stock.changePercent >= 0 ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{stock.name}</p>
                <div className="bg-muted/50 p-3 text-[11px] text-muted-foreground italic">
                  AI Brief pending generation. Click to view the full stock
                  profile and generate a Peter Lynch-style brief.
                </div>
                <Tag type="outline" size="sm" className="text-[9px] font-mono">
                  AI-Generated - Not Financial Advice
                </Tag>
              </ClickableTile>
            ))}
      </div>

      {stocks.length === 0 && !isLoading && (
        <InlineNotification
          kind="info"
          title="No stocks"
          subtitle="No stocks in your watchlist yet. Add stocks from the Dashboard or Stock Explorer."
          lowContrast
          hideCloseButton
        />
      )}
    </div>
  );
}
