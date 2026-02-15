import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { allStocks } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";

export function QuickSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const filtered = query.length > 0
    ? allStocks.filter(
        (s) =>
          s.ticker.toLowerCase().includes(query.toLowerCase()) ||
          s.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search any NSE/BSE stock..."
        className="pl-9 h-9 text-sm"
      />
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 border bg-card z-10 shadow-lg max-h-60 overflow-auto">
          {filtered.map((s) => (
            <button
              key={s.ticker}
              className="w-full text-left px-3 py-2 hover:bg-accent flex items-center justify-between text-sm"
              onMouseDown={() => {
                navigate(`/explorer/${s.ticker}`);
                setQuery("");
                setOpen(false);
              }}
            >
              <div>
                <span className="font-mono font-medium">{s.ticker}</span>
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
