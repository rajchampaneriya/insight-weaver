import { useNewsFeed } from "@/hooks/use-market-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const sentimentColors = {
  positive: "bg-carbon-success/15 text-carbon-success border-carbon-success/30",
  neutral: "bg-carbon-warning/10 text-carbon-warning border-carbon-warning/30",
  negative: "bg-carbon-danger/15 text-carbon-danger border-carbon-danger/30",
};

export function NewsFeed() {
  const { data: newsFeed, isLoading, error } = useNewsFeed();

  if (isLoading) {
    return (
      <div className="border bg-card">
        <div className="px-4 py-3 border-b">
          <h2 className="text-sm font-semibold">News & Sentiment</h2>
        </div>
        <div className="p-4 space-y-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (<div key={i} className="h-12 bg-muted rounded" />))}
        </div>
      </div>
    );
  }

  if (error || !newsFeed) {
    return (
      <div className="border bg-card">
        <div className="px-4 py-3 border-b">
          <h2 className="text-sm font-semibold">News & Sentiment</h2>
        </div>
        <div className="p-4 text-sm text-muted-foreground">
          Failed to load news feed.
        </div>
      </div>
    );
  }

  return (
    <div className="border bg-card">
      <div className="px-4 py-3 border-b">
        <h2 className="text-sm font-semibold">News & Sentiment</h2>
      </div>
      <div className="divide-y">
        {newsFeed.map((item) => (
          <div key={item.id} className="px-4 py-3 hover:bg-accent/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug">{item.headline}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] text-muted-foreground">{item.source}</span>
                  <span className="text-[11px] text-muted-foreground">&bull;</span>
                  <span className="text-[11px] text-muted-foreground">{item.time}</span>
                  {item.ticker && (
                    <span className="font-mono text-[11px] text-primary">{item.ticker}</span>
                  )}
                </div>
              </div>
              <Badge variant="outline" className={cn("text-[10px] shrink-0 capitalize", sentimentColors[item.sentiment])}>
                {item.sentiment}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
