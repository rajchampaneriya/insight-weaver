import { useUnusualMovers, useExplainMovement } from "@/hooks/use-market-data";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { fetchExplainMovement } from "@/services/market-service";
import type { InsightResponse } from "@/services/market-service";

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
      <div className="border bg-card animate-pulse">
        <div className="px-4 py-3 border-b">
          <div className="h-4 bg-muted rounded w-32" />
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (<div key={i} className="h-8 bg-muted rounded" />))}
        </div>
      </div>
    );
  }

  if (error || !movers) {
    return (
      <div className="border bg-card p-4 text-sm text-muted-foreground">
        Failed to load unusual movers. Please try again later.
      </div>
    );
  }

  return (
    <div className="border bg-card">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h2 className="text-sm font-semibold">Unusual Movers</h2>
        <span className="text-[10px] text-muted-foreground">Stocks with abnormal price/volume</span>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-[11px] uppercase tracking-wider font-medium h-9">Ticker</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-medium h-9">Sector</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-medium h-9 text-right">Price</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-medium h-9 text-right">Change</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-medium h-9 text-right">Vol / Avg</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-medium h-9">AI Explanation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movers.map((stock) => {
            const volRatio = (stock.volume / stock.avgVolume).toFixed(1);
            return (
              <TableRow
                key={stock.ticker}
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => navigate(`/explorer/${stock.ticker}`)}
              >
                <TableCell className="font-mono text-sm font-medium py-2.5">{stock.ticker}</TableCell>
                <TableCell className="text-xs text-muted-foreground py-2.5">{stock.sector}</TableCell>
                <TableCell className="font-mono text-sm text-right py-2.5">{"\u20B9"}{stock.price.toLocaleString("en-IN")}</TableCell>
                <TableCell className={cn("font-mono text-sm text-right py-2.5", stock.change >= 0 ? "text-carbon-success" : "text-carbon-danger")}>
                  {stock.change >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                </TableCell>
                <TableCell className="font-mono text-sm text-right py-2.5">
                  <span className={cn(parseFloat(volRatio) > 1.5 ? "text-carbon-warning" : "text-muted-foreground")}>
                    {volRatio}x
                  </span>
                </TableCell>
                <TableCell className="py-2.5 max-w-[200px]">
                  {explanations[stock.ticker] ? (
                    <span className="text-[10px] text-muted-foreground line-clamp-2">{explanations[stock.ticker]}</span>
                  ) : loadingTicker === stock.ticker ? (
                    <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground animate-pulse">
                      Analyzing...
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] font-mono text-muted-foreground cursor-pointer hover:bg-accent"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExplain(stock.ticker, stock.changePercent, stock.volume, stock.avgVolume);
                      }}
                    >
                      Get AI analysis
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
