import { useState } from "react";
import { useWatchlist } from "@/lib/watchlist-store";
import { fetchStockDetail } from "@/services/market-service";
import type { StockDetail } from "@/services/market-service";
import {
  Tile,
  ClickableTile,
  Tag,
  Button,
  TextInput,
  ContentSwitcher,
  Switch,
  InlineLoading,
} from "@carbon/react";
import { ArrowUp, ArrowDown, Add, TrashCan } from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

function useWatchlistStocks(tickers: string[]) {
  return useQuery({
    queryKey: ["watchlist-stocks", tickers.join(",")],
    queryFn: async () => {
      const results = await Promise.allSettled(
        tickers.map((t) => fetchStockDetail(t))
      );
      const stocks: Record<string, StockDetail> = {};
      results.forEach((r, i) => {
        if (r.status === "fulfilled") {
          stocks[tickers[i]] = r.value.stock;
        }
      });
      return stocks;
    },
    enabled: tickers.length > 0,
    staleTime: 30_000,
  });
}

export default function Watchlist() {
  const { groups, removeFromGroup, addGroup } = useWatchlist();
  const [viewIndex, setViewIndex] = useState(0);
  const [newGroupName, setNewGroupName] = useState("");
  const navigate = useNavigate();

  const allTickers = [
    ...new Set(groups.flatMap((g) => g.items.map((i) => i.ticker))),
  ];
  const { data: stockMap = {}, isLoading } = useWatchlistStocks(allTickers);

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim());
      setNewGroupName("");
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Watchlist</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track and organize your stock ideas
          </p>
        </div>
        <ContentSwitcher
          onChange={(e: { index: number }) => setViewIndex(e.index)}
          selectedIndex={viewIndex}
        >
          <Switch name="table" text="Table" />
          <Switch name="card" text="Cards" />
        </ContentSwitcher>
      </div>

      {isLoading && <InlineLoading description="Loading stocks..." />}

      {groups.map((group) => {
        const stocks = group.items
          .map((item) => stockMap[item.ticker])
          .filter(Boolean);

        return (
          <div key={group.name} className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold">{group.name}</h2>
              <Tag type="gray" size="sm">
                {group.items.length}
              </Tag>
            </div>

            {viewIndex === 0 ? (
              <Tile className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-[11px] uppercase tracking-wider h-9 text-left px-4">
                          Ticker
                        </th>
                        <th className="text-[11px] uppercase tracking-wider h-9 text-left px-4">
                          Name
                        </th>
                        <th className="text-[11px] uppercase tracking-wider h-9 text-right px-4">
                          Price
                        </th>
                        <th className="text-[11px] uppercase tracking-wider h-9 text-right px-4">
                          Change
                        </th>
                        <th className="text-[11px] uppercase tracking-wider h-9 text-left px-4">
                          Brief
                        </th>
                        <th className="text-[11px] uppercase tracking-wider h-9 w-10 px-4" />
                      </tr>
                    </thead>
                    <tbody>
                      {stocks.map(
                        (stock) =>
                          stock && (
                            <tr
                              key={stock.ticker}
                              className="border-b border-border cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() =>
                                navigate(`/explorer/${stock.ticker}`)
                              }
                            >
                              <td className="font-mono-data text-sm font-medium py-2.5 px-4">
                                {stock.ticker}
                              </td>
                              <td className="text-sm text-muted-foreground py-2.5 px-4">
                                {stock.name}
                              </td>
                              <td className="font-mono-data text-sm text-right py-2.5 px-4">
                                {"\u20B9"}
                                {stock.price.toLocaleString("en-IN")}
                              </td>
                              <td
                                className={`font-mono-data text-sm text-right py-2.5 px-4 ${
                                  stock.change >= 0
                                    ? "text-carbon-success"
                                    : "text-carbon-danger"
                                }`}
                              >
                                {stock.change >= 0 ? "+" : ""}
                                {stock.changePercent.toFixed(2)}%
                              </td>
                              <td className="py-2.5 px-4">
                                <Tag type="gray" size="sm">
                                  Pending
                                </Tag>
                              </td>
                              <td className="py-2.5 px-4">
                                <Button
                                  kind="ghost"
                                  size="sm"
                                  hasIconOnly
                                  renderIcon={TrashCan}
                                  iconDescription="Remove"
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    removeFromGroup(stock.ticker, group.name);
                                  }}
                                />
                              </td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </table>
                </div>
              </Tile>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stocks.map(
                  (stock) =>
                    stock && (
                      <ClickableTile
                        key={stock.ticker}
                        onClick={() => navigate(`/explorer/${stock.ticker}`)}
                        className="p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono-data text-sm font-semibold">
                            {stock.ticker}
                          </span>
                          <Button
                            kind="ghost"
                            size="sm"
                            hasIconOnly
                            renderIcon={TrashCan}
                            iconDescription="Remove"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              removeFromGroup(stock.ticker, group.name);
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {stock.name}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-mono-data text-sm">
                            {"\u20B9"}
                            {stock.price.toLocaleString("en-IN")}
                          </span>
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
                      </ClickableTile>
                    )
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="flex items-center gap-2">
        <TextInput
          id="new-group"
          labelText=""
          hideLabel
          size="sm"
          value={newGroupName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewGroupName(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent) =>
            e.key === "Enter" && handleAddGroup()
          }
          placeholder="New group name..."
          className="max-w-xs"
        />
        <Button
          kind="tertiary"
          size="sm"
          renderIcon={Add}
          onClick={handleAddGroup}
        >
          Add Group
        </Button>
      </div>
    </div>
  );
}
