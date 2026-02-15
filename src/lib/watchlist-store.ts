import { useState, useCallback } from "react";

export interface WatchlistItem {
  ticker: string;
  group: string;
  addedAt: string;
}

export interface WatchlistGroup {
  name: string;
  items: WatchlistItem[];
}

const DEFAULT_GROUPS: WatchlistGroup[] = [
  {
    name: "Core Holdings",
    items: [
      { ticker: "RELIANCE", group: "Core Holdings", addedAt: "2025-02-10" },
      { ticker: "HDFCBANK", group: "Core Holdings", addedAt: "2025-02-08" },
      { ticker: "INFY", group: "Core Holdings", addedAt: "2025-02-05" },
    ],
  },
  {
    name: "Tracking",
    items: [
      { ticker: "ADANIENT", group: "Tracking", addedAt: "2025-02-12" },
      { ticker: "TATAMOTORS", group: "Tracking", addedAt: "2025-02-11" },
    ],
  },
];

export function useWatchlist() {
  const [groups, setGroups] = useState<WatchlistGroup[]>(DEFAULT_GROUPS);

  const addToGroup = useCallback((ticker: string, groupName: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.name === groupName
          ? { ...g, items: [...g.items, { ticker, group: groupName, addedAt: new Date().toISOString().split("T")[0] }] }
          : g
      )
    );
  }, []);

  const removeFromGroup = useCallback((ticker: string, groupName: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.name === groupName
          ? { ...g, items: g.items.filter((i) => i.ticker !== ticker) }
          : g
      )
    );
  }, []);

  const addGroup = useCallback((name: string) => {
    setGroups((prev) => [...prev, { name, items: [] }]);
  }, []);

  const allTickers = groups.flatMap((g) => g.items.map((i) => i.ticker));

  return { groups, addToGroup, removeFromGroup, addGroup, allTickers };
}
