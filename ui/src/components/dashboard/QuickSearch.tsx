import { useState } from "react";
import { Search as CarbonSearch } from "@carbon/react";
import { useSearchStocks } from "@/hooks/use-market-data";
import { useNavigate } from "react-router-dom";

export function QuickSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: filtered = [] } = useSearchStocks(query);

  return (
    <div className="relative w-full max-w-md">
      <CarbonSearch
        size="sm"
        placeholder="Search any NSE/BSE stock..."
        labelText="Search stocks"
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onClear={() => setQuery("")}
      />
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 border border-border bg-card z-10 shadow-lg max-h-60 overflow-auto">
          {filtered.map((s) => (
            <button
              key={s.ticker}
              className="w-full text-left px-3 py-2 hover:bg-muted/50 flex items-center justify-between text-sm transition-colors"
              onMouseDown={() => {
                navigate(`/explorer/${s.ticker}`);
                setQuery("");
                setOpen(false);
              }}
            >
              <div>
                <span className="font-mono-data font-medium">{s.ticker}</span>
                <span className="text-muted-foreground ml-2 text-xs">{s.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{s.sector}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
