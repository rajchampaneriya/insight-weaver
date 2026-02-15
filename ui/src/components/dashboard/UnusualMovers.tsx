import { Tile, Tag, InlineLoading, InlineNotification, SkeletonPlaceholder } from "@carbon/react";
import { useUnusualMovers } from "@/hooks/use-market-data";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { fetchExplainMovement } from "@/services/market-service";

export function UnusualMovers() {
  const navigate = useNavigate();
  const { data: movers, isLoading, error } = useUnusualMovers();
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [loadingTicker, setLoadingTicker] = useState<string | null>(null);

  const handleExplain = async (ticker: string, changePercent: number, volume: number, avgVolume: number) => {
    if (explanations[ticker]) return;
    setLoadingTicker(ticker);
    try {
      const context = `Price changed ${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%. Volume: ${(volume / 1e6).toFixed(1)}M vs avg ${(avgVolume / 1e6).toFixed(1)}M`;
      const response = await fetchExplainMovement(ticker, context);
      setExplanations((prev) => ({ ...prev, [ticker]: response.content }));
    } catch {
      setExplanations((prev) => ({ ...prev, [ticker]: "Failed to load AI explanation." }));
    } finally {
      setLoadingTicker(null);
    }
  };

  if (isLoading) {
    return (
      <Tile>
        <div className="px-4 py-3 border-b">
          <SkeletonPlaceholder className="w-32 h-4" />
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonPlaceholder key={i} className="w-full h-8" />
          ))}
        </div>
      </Tile>
    );
  }

  if (error || !movers) {
    return (
      <InlineNotification
        kind="error"
        title="Error"
        subtitle="Failed to load unusual movers."
        lowContrast
        hideCloseButton
      />
    );
  }

  return (
    <Tile className="p-0">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold">Unusual Movers</h2>
        <span className="text-[10px] text-muted-foreground">Stocks with abnormal price/volume</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-[11px] uppercase tracking-wider font-medium h-9 text-left px-4">Ticker</th>
              <th className="text-[11px] uppercase tracking-wider font-medium h-9 text-left px-4">Sector</th>
              <th className="text-[11px] uppercase tracking-wider font-medium h-9 text-right px-4">Price</th>
              <th className="text-[11px] uppercase tracking-wider font-medium h-9 text-right px-4">Change</th>
              <th className="text-[11px] uppercase tracking-wider font-medium h-9 text-right px-4">Vol / Avg</th>
              <th className="text-[11px] uppercase tracking-wider font-medium h-9 text-left px-4">AI Explanation</th>
            </tr>
          </thead>
          <tbody>
            {movers.map((stock) => {
              const volRatio = (stock.volume / stock.avgVolume).toFixed(1);
              return (
                <tr
                  key={stock.ticker}
                  className="border-b border-border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/explorer/${stock.ticker}`)}
                >
                  <td className="font-mono-data text-sm font-medium py-2.5 px-4">{stock.ticker}</td>
                  <td className="text-xs text-muted-foreground py-2.5 px-4">{stock.sector}</td>
                  <td className="font-mono-data text-sm text-right py-2.5 px-4">\u20B9{stock.price.toLocaleString("en-IN")}</td>
                  <td className={`font-mono-data text-sm text-right py-2.5 px-4 ${stock.change >= 0 ? "text-carbon-success" : "text-carbon-danger"}`}>
                    {stock.change >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                  </td>
                  <td className="font-mono-data text-sm text-right py-2.5 px-4">
                    <span className={parseFloat(volRatio) > 1.5 ? "text-carbon-warning" : "text-muted-foreground"}>
                      {volRatio}x
                    </span>
                  </td>
                  <td className="py-2.5 px-4 max-w-[200px]">
                    {explanations[stock.ticker] ? (
                      <span className="text-[10px] text-muted-foreground line-clamp-2">{explanations[stock.ticker]}</span>
                    ) : loadingTicker === stock.ticker ? (
                      <InlineLoading description="Analyzing..." />
                    ) : (
                      <Tag
                        type="blue"
                        size="sm"
                        className="cursor-pointer"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleExplain(stock.ticker, stock.changePercent, stock.volume, stock.avgVolume);
                        }}
                      >
                        Get AI analysis
                      </Tag>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Tile>
  );
}
