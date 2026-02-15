import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { UnusualMovers } from "@/components/dashboard/UnusualMovers";
import { NewsFeed } from "@/components/dashboard/NewsFeed";
import { QuickSearch } from "@/components/dashboard/QuickSearch";

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">What Changed Today?</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Market overview and unusual activity</p>
        </div>
        <QuickSearch />
      </div>

      <MarketOverview />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <UnusualMovers />
        </div>
        <div>
          <NewsFeed />
        </div>
      </div>
    </div>
  );
}
