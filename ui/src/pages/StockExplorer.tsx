import { useParams } from "react-router-dom";
import { allStocks, priceHistory, quarterlyEarnings, newsFeed } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StockExplorer() {
  const { ticker } = useParams();
  const stock = allStocks.find((s) => s.ticker === (ticker || "RELIANCE")) || allStocks[0];
  const stockNews = newsFeed.filter((n) => n.ticker === stock.ticker);

  const metrics = [
    { label: "P/E Ratio", value: stock.pe.toString() },
    { label: "Market Cap", value: stock.marketCap },
    { label: "52W High", value: `₹${stock.high52w.toLocaleString("en-IN")}` },
    { label: "52W Low", value: `₹${stock.low52w.toLocaleString("en-IN")}` },
    { label: "Volume", value: (stock.volume / 1e6).toFixed(1) + "M" },
    { label: "Avg Volume", value: (stock.avgVolume / 1e6).toFixed(1) + "M" },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Stock Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">{stock.name}</h1>
            <Badge variant="outline" className="font-mono text-xs">{stock.ticker}</Badge>
            <Badge variant="secondary" className="text-xs">{stock.sector}</Badge>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-mono text-2xl font-semibold">₹{stock.price.toLocaleString("en-IN")}</span>
            <span className={cn("font-mono text-sm flex items-center gap-1", stock.change >= 0 ? "text-carbon-success" : "text-carbon-danger")}>
              {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-muted/50 p-0 h-9 rounded-none border-b w-full justify-start gap-0">
          {["overview", "news", "financials", "ai-brief"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-9 px-4 text-xs uppercase tracking-wider"
            >
              {tab === "ai-brief" ? "AI Brief" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {metrics.map((m) => (
              <Card key={m.label}>
                <CardContent className="p-3">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
                  <p className="font-mono text-sm font-semibold mt-1">{m.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="p-4">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3">Price Chart (1Y)</p>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" domain={["dataMin - 50", "dataMax + 50"]} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                    <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="mt-4">
          <div className="border bg-card divide-y">
            {(stockNews.length > 0 ? stockNews : newsFeed.slice(0, 4)).map((item) => (
              <div key={item.id} className="px-4 py-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm">{item.headline}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{item.source} • {item.time}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] shrink-0 capitalize",
                    item.sentiment === "positive" && "text-carbon-success border-carbon-success/30",
                    item.sentiment === "negative" && "text-carbon-danger border-carbon-danger/30",
                    item.sentiment === "neutral" && "text-carbon-warning border-carbon-warning/30"
                  )}
                >
                  {item.sentiment}
                </Badge>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="financials" className="mt-4">
          <div className="border bg-card">
            <div className="px-4 py-3 border-b">
              <h3 className="text-sm font-semibold">Quarterly Earnings</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[11px] uppercase tracking-wider h-9">Quarter</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider h-9 text-right">Revenue</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider h-9 text-right">PAT</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider h-9 text-right">EPS Growth</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider h-9 text-right">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quarterlyEarnings.map((q) => (
                  <TableRow key={q.quarter}>
                    <TableCell className="font-mono text-sm py-2.5">{q.quarter}</TableCell>
                    <TableCell className="font-mono text-sm text-right py-2.5">{q.revenue}</TableCell>
                    <TableCell className="font-mono text-sm text-right py-2.5">{q.pat}</TableCell>
                    <TableCell className="font-mono text-sm text-right py-2.5 text-carbon-success">{q.epsGrowth}</TableCell>
                    <TableCell className="font-mono text-sm text-right py-2.5">{q.margin}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="ai-brief" className="mt-4 space-y-4">
          <div className="border bg-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">AI Investment Brief — Peter Lynch Style</h3>
              <Badge variant="outline" className="text-[9px] font-mono ml-auto">AI-Generated • Not Financial Advice</Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Business Model Summary</p>
                  <div className="bg-muted/50 p-3 text-sm text-muted-foreground italic">
                    Pending AI generation. This section will contain a concise description of the company's core business, revenue drivers, and competitive positioning.
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Key Metrics & Valuation</p>
                  <div className="bg-muted/50 p-3 text-sm text-muted-foreground italic">
                    Pending AI generation. Key financial ratios, growth trajectory, and valuation assessment relative to peers and historical averages.
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Moat Analysis
                  </p>
                  <div className="bg-muted/50 p-3 text-sm text-muted-foreground italic">
                    Pending AI generation. Assessment of competitive advantages: brand, scale, network effects, switching costs, regulatory moat.
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Key Risks
                  </p>
                  <div className="bg-muted/50 p-3 text-sm text-muted-foreground italic">
                    Pending AI generation. Material risks including regulatory, competitive, macro-economic, and execution risks.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t pt-3">
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Audit Trail: Brief not yet generated. Timestamp, model version, and data sources will be logged here.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
