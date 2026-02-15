import { useState } from "react";
import { useWatchlist } from "@/lib/watchlist-store";
import { allStocks } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { LayoutGrid, List, Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Watchlist() {
  const { groups, removeFromGroup, addToGroup, addGroup } = useWatchlist();
  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const [newGroupName, setNewGroupName] = useState("");
  const navigate = useNavigate();

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
          <p className="text-sm text-muted-foreground mt-0.5">Track and organize your stock ideas</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "table" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("table")}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "card" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("card")}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {groups.map((group) => {
        const stocks = group.items.map((item) => allStocks.find((s) => s.ticker === item.ticker)).filter(Boolean);

        return (
          <div key={group.name} className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold">{group.name}</h2>
              <Badge variant="outline" className="text-[10px] font-mono">{group.items.length}</Badge>
            </div>

            {viewMode === "table" ? (
              <div className="border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-[11px] uppercase tracking-wider h-9">Ticker</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider h-9">Name</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider h-9 text-right">Price</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider h-9 text-right">Change</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider h-9">Brief</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider h-9 w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stocks.map((stock) => stock && (
                      <TableRow key={stock.ticker} className="cursor-pointer hover:bg-accent/50" onClick={() => navigate(`/explorer/${stock.ticker}`)}>
                        <TableCell className="font-mono text-sm font-medium py-2.5">{stock.ticker}</TableCell>
                        <TableCell className="text-sm text-muted-foreground py-2.5">{stock.name}</TableCell>
                        <TableCell className="font-mono text-sm text-right py-2.5">₹{stock.price.toLocaleString("en-IN")}</TableCell>
                        <TableCell className={cn("font-mono text-sm text-right py-2.5", stock.change >= 0 ? "text-carbon-success" : "text-carbon-danger")}>
                          {stock.change >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge variant="outline" className="text-[10px] text-muted-foreground font-mono">Pending</Badge>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); removeFromGroup(stock.ticker, group.name); }}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stocks.map((stock) => stock && (
                  <Card key={stock.ticker} className="cursor-pointer hover:bg-accent/30 transition-colors" onClick={() => navigate(`/explorer/${stock.ticker}`)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm font-semibold">{stock.ticker}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); removeFromGroup(stock.ticker, group.name); }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{stock.name}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm">₹{stock.price.toLocaleString("en-IN")}</span>
                        <span className={cn("font-mono text-xs flex items-center gap-0.5", stock.change >= 0 ? "text-carbon-success" : "text-carbon-danger")}>
                          {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="flex items-center gap-2">
        <Input
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddGroup()}
          placeholder="New group name..."
          className="max-w-xs h-8 text-sm"
        />
        <Button variant="outline" size="sm" onClick={handleAddGroup} className="h-8">
          <Plus className="h-3 w-3 mr-1" /> Add Group
        </Button>
      </div>
    </div>
  );
}
