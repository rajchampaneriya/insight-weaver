import { unusualMovers } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export function UnusualMovers() {
  const navigate = useNavigate();

  return (
    <div className="border bg-card">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h2 className="text-sm font-semibold">Unusual Movers</h2>
        <span className="text-[10px] text-muted-foreground">Stocks with abnormal price/volume</span>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-[11px] uppercase tracking-wider font-medium h-9">Ticker</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-medium h-9">Sector</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-medium h-9 text-right">Price</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-medium h-9 text-right">Change</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-medium h-9 text-right">Vol / Avg</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-medium h-9">AI Explanation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {unusualMovers.map((stock) => {
            const volRatio = (stock.volume / stock.avgVolume).toFixed(1);
            return (
              <TableRow
                key={stock.ticker}
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => navigate(`/explorer/${stock.ticker}`)}
              >
                <TableCell className="font-mono text-sm font-medium py-2.5">{stock.ticker}</TableCell>
                <TableCell className="text-xs text-muted-foreground py-2.5">{stock.sector}</TableCell>
                <TableCell className="font-mono text-sm text-right py-2.5">₹{stock.price.toLocaleString("en-IN")}</TableCell>
                <TableCell className={cn("font-mono text-sm text-right py-2.5", stock.change >= 0 ? "text-carbon-success" : "text-carbon-danger")}>
                  {stock.change >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                </TableCell>
                <TableCell className="font-mono text-sm text-right py-2.5">
                  <span className={cn(parseFloat(volRatio) > 1.5 ? "text-carbon-warning" : "text-muted-foreground")}>
                    {volRatio}x
                  </span>
                </TableCell>
                <TableCell className="py-2.5">
                  <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                    Pending AI analysis
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
