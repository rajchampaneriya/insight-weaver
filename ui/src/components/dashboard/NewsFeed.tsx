import { Tile, Tag, SkeletonPlaceholder, InlineNotification } from "@carbon/react";
import { useNewsFeed } from "@/hooks/use-market-data";

const sentimentTagType: Record<string, "green" | "gray" | "red"> = {
  positive: "green",
  neutral: "gray",
  negative: "red",
};

export function NewsFeed() {
  const { data: newsFeed, isLoading, error } = useNewsFeed();

  if (isLoading) {
    return (
      <Tile className="p-0">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold">News & Sentiment</h2>
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonPlaceholder key={i} className="w-full h-12" />
          ))}
        </div>
      </Tile>
    );
  }

  if (error || !newsFeed) {
    return (
      <Tile className="p-0">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold">News & Sentiment</h2>
        </div>
        <InlineNotification
          kind="error"
          title="Error"
          subtitle="Failed to load news feed."
          lowContrast
          hideCloseButton
          className="m-4"
        />
      </Tile>
    );
  }

  return (
    <Tile className="p-0">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold">News & Sentiment</h2>
      </div>
      <div className="divide-y divide-border">
        {newsFeed.map((item) => (
          <div key={item.id} className="px-4 py-3 hover:bg-muted/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug">{item.headline}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] text-muted-foreground">{item.source}</span>
                  <span className="text-[11px] text-muted-foreground">&bull;</span>
                  <span className="text-[11px] text-muted-foreground">{item.time}</span>
                  {item.ticker && (
                    <span className="font-mono-data text-[11px] text-primary">{item.ticker}</span>
                  )}
                </div>
              </div>
              <Tag type={sentimentTagType[item.sentiment] || "gray"} size="sm">
                {item.sentiment}
              </Tag>
            </div>
          </div>
        ))}
      </div>
    </Tile>
  );
}
