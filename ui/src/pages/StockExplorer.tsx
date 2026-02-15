import { useParams } from "react-router-dom";
import { useStockDetail, useInsightBrief } from "@/hooks/use-market-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Brain, Loader2 } from "lucide-react";
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

function parseBrief(content: string) {
  const sections = { story: "", numbers: "", moat: "", risks: "" };
  const storyMatch = content.match(/\*\*The Story\*\*[:\s]*([\s\S]*?)(?=\*\*The Numbers\*\*|$)/i);
  const numbersMatch = content.match(/\*\*The Numbers\*\*[:\s]*([\s\S]*?)(?=\*\*The Moat\*\*|$)/i);
  const moatMatch = content.match(/\*\*The Moat\*\*[:\s]*([\s\S]*?)(?=\*\*The Risks\*\*|$)/i);
  const risksMatch = content.match(/\*\*The Risks\*\*[:\s]*([\s\S]*?)(?=This is AI-generated|$)/i);
  sections.story = storyMatch?.[1]?.trim() || content.slice(0, content.length / 4);
  sections.numbers = numbersMatch?.[1]?.trim() || "";
  sections.moat = moatMatch?.[1]?.trim() || "";
  sections.risks = risksMatch?.[1]?.trim() || "";
  return sections;
}

export default function StockExplorer() {
  const { ticker } = useParams();
  const resolvedTicker = ticker || "RELIANCE";
  const { data, isLoading, error } = useStockDetail(resolvedTicker);
  const { data: briefData, isLoading: briefLoading, refetch: fetchBrief, isError: briefError } = useInsightBrief(resolvedTicker);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1400px] animate-pulse">
        <div className="h-12 bg-muted rounded w-64" />
        <div className="h-8 bg-muted rounded w-48" />
        <div className="grid grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded" />
          ))}
        </div>
        <div className="h-[300px] bg-muted rounded" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <div className="border bg-card p-8 text-center text-sm text-muted-foreground">
          Failed to load stock data for {resolvedTicker}. Please try again later.
        </div>
      </div>
    );
  }

  const { stock, earnings, priceHistory, news } = data;

  const metrics = [
    { label: "P/E Ratio", value: stock.pe.toString() },
    { label: "Market Cap", value: `\u20B9${stock.marketCap}` },
    { label: "52W High", value: `\u20B9${stock.high52W.toLocaleString("en-IN")}` },
    { label: "52W Low", value: `\u20B9${stock.low52W.toLocaleString("en-IN")}` },
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
            <span className="font-mono text-2xl font-semibold">{"\u20B9"}{stock.price.toLocaleString("en-IN")}</span>
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
            {news.length > 0 ? news.map((item) => (
              <div key={item.id} className="px-4 py-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm">{item.headline}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{item.source} &bull; {item.time}</p>
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
            )) : (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No recent news for {stock.ticker}.
              </div>
            )}
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
                {earnings.map((q) => (
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
              <h3 className="text-sm font-semibold">AI Investment Brief -- Peter Lynch Style</h3>
              <Badge variant="outline" className="text-[9px] font-mono ml-auto">AI-Generated &bull; Not Financial Advice</Badge>
            </div>

            {briefData ? (
              <>
                {(() => {
                  const sections = parseBrief(briefData.content);
                  return (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">The Story</p>
                          <div className="bg-muted/50 p-3 text-sm whitespace-pre-wrap">{sections.story || "No data available."}</div>
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">The Numbers</p>
                          <div className="bg-muted/50 p-3 text-sm whitespace-pre-wrap">{sections.numbers || "No data available."}</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Shield className="h-3 w-3" /> The Moat
                          </p>
                          <div className="bg-muted/50 p-3 text-sm whitespace-pre-wrap">{sections.moat || "No data available."}</div>
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> The Risks
                          </p>
                          <div className="bg-muted/50 p-3 text-sm whitespace-pre-wrap">{sections.risks || "No data available."}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                <div className="mt-4 border-t pt-3">
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Generated at {new Date(briefData.generatedAt).toLocaleString()} | Sources: {briefData.sources.join(", ")}
                  </p>
                </div>
              </>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Business Model Summary</p>
                    <div className="bg-muted/50 p-3 text-sm text-muted-foreground italic">
                      {briefLoading ? "Generating AI brief..." : "Click the button below to generate an AI investment brief."}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Key Metrics & Valuation</p>
                    <div className="bg-muted/50 p-3 text-sm text-muted-foreground italic">
                      {briefLoading ? "Analyzing financial data..." : "Pending AI generation."}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Shield className="h-3 w-3" /> Moat Analysis
                    </p>
                    <div className="bg-muted/50 p-3 text-sm text-muted-foreground italic">
                      {briefLoading ? "Evaluating competitive advantages..." : "Pending AI generation."}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Key Risks
                    </p>
                    <div className="bg-muted/50 p-3 text-sm text-muted-foreground italic">
                      {briefLoading ? "Identifying risk factors..." : "Pending AI generation."}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!briefData && (
              <div className="mt-4 flex justify-center">
                <Button onClick={() => fetchBrief()} disabled={briefLoading} variant="outline" size="sm">
                  {briefLoading ? (
                    <><Loader2 className="h-3 w-3 mr-2 animate-spin" /> Generating Brief...</>
                  ) : (
                    <><Brain className="h-3 w-3 mr-2" /> Generate AI Brief</>
                  )}
                </Button>
              </div>
            )}

            {briefError && (
              <div className="mt-2 text-center text-sm text-destructive">
                Failed to generate AI brief. Please try again.
              </div>
            )}

            <div className="mt-4 border-t pt-3">
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {briefData
                  ? briefData.disclaimer
                  : "Audit Trail: Brief not yet generated. Timestamp, model version, and data sources will be logged here."}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
