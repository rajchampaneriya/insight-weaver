import { Card, CardContent } from "@/components/ui/card";
import { marketIndices, sectorPerformance } from "@/lib/mock-data";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function MarketOverview() {
  return (
    <div className="space-y-4">
      {/* Index Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {marketIndices.map((idx) => (
          <Card key={idx.name} className="bg-card">
            <CardContent className="p-4">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{idx.name}</p>
              <p className="font-mono text-lg font-semibold mt-1">{idx.value.toLocaleString("en-IN")}</p>
              <div className={cn("flex items-center gap-1 text-xs font-mono mt-1", idx.change >= 0 ? "text-carbon-success" : "text-carbon-danger")}>
                {idx.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{idx.change >= 0 ? "+" : ""}{idx.change.toFixed(2)}</span>
                <span>({idx.changePercent >= 0 ? "+" : ""}{idx.changePercent.toFixed(2)}%)</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sector Heatmap */}
      <div className="flex flex-wrap gap-2">
        {sectorPerformance.map((s) => (
          <div
            key={s.name}
            className={cn(
              "px-3 py-1.5 text-xs font-mono border",
              s.change >= 1 ? "bg-carbon-success/15 text-carbon-success border-carbon-success/30" :
              s.change >= 0 ? "bg-carbon-success/5 text-carbon-success border-carbon-success/15" :
              s.change >= -1 ? "bg-carbon-danger/5 text-carbon-danger border-carbon-danger/15" :
              "bg-carbon-danger/15 text-carbon-danger border-carbon-danger/30"
            )}
          >
            {s.name} <span className="ml-1">{s.change >= 0 ? "+" : ""}{s.change}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
