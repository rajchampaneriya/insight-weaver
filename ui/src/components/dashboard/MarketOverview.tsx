import { Tile, Tag, SkeletonPlaceholder, InlineNotification } from "@carbon/react";
import { ArrowUp, ArrowDown } from "@carbon/icons-react";
import { useMarketOverview } from "@/hooks/use-market-data";

export function MarketOverview() {
  const { data, isLoading, error } = useMarketOverview();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Tile key={i}>
              <SkeletonPlaceholder className="w-full h-20" />
            </Tile>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <InlineNotification
        kind="error"
        title="Error"
        subtitle="Failed to load market data. Please try again later."
        lowContrast
        hideCloseButton
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {data.indices.map((idx) => (
          <Tile key={idx.name} className="p-4">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{idx.name}</p>
            <p className="font-mono-data text-lg font-semibold mt-1">{idx.value.toLocaleString("en-IN")}</p>
            <div className={`flex items-center gap-1 text-xs font-mono-data mt-1 ${idx.change >= 0 ? "text-carbon-success" : "text-carbon-danger"}`}>
              {idx.change >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              <span>{idx.change >= 0 ? "+" : ""}{idx.change.toFixed(2)}</span>
              <span>({idx.changePercent >= 0 ? "+" : ""}{idx.changePercent.toFixed(2)}%)</span>
            </div>
          </Tile>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {data.sectors.map((s) => (
          <Tag
            key={s.name}
            type={s.change >= 0 ? "green" : "red"}
            size="md"
          >
            {s.name} {s.change >= 0 ? "+" : ""}{s.change}%
          </Tag>
        ))}
      </div>
    </div>
  );
}
