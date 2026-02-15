import { useParams } from "react-router-dom";
import { useStockDetail, useInsightBrief } from "@/hooks/use-market-data";
import {
  Tile,
  Tag,
  Button,
  InlineLoading,
  InlineNotification,
  SkeletonPlaceholder,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@carbon/react";
import {
  ArrowUp,
  ArrowDown,
  WarningAlt,
  Security,
  WatsonHealthAiResults,
} from "@carbon/icons-react";
import { LineChart } from "@carbon/charts-react";

function parseBrief(content: string) {
  const sections = { story: "", numbers: "", moat: "", risks: "" };
  const storyMatch = content.match(
    /\*\*The Story\*\*[:\s]*([\s\S]*?)(?=\*\*The Numbers\*\*|$)/i
  );
  const numbersMatch = content.match(
    /\*\*The Numbers\*\*[:\s]*([\s\S]*?)(?=\*\*The Moat\*\*|$)/i
  );
  const moatMatch = content.match(
    /\*\*The Moat\*\*[:\s]*([\s\S]*?)(?=\*\*The Risks\*\*|$)/i
  );
  const risksMatch = content.match(
    /\*\*The Risks\*\*[:\s]*([\s\S]*?)(?=This is AI-generated|$)/i
  );
  sections.story =
    storyMatch?.[1]?.trim() || content.slice(0, content.length / 4);
  sections.numbers = numbersMatch?.[1]?.trim() || "";
  sections.moat = moatMatch?.[1]?.trim() || "";
  sections.risks = risksMatch?.[1]?.trim() || "";
  return sections;
}

export default function StockExplorer() {
  const { ticker } = useParams();
  const resolvedTicker = ticker || "RELIANCE";
  const { data, isLoading, error } = useStockDetail(resolvedTicker);
  const {
    data: briefData,
    isLoading: briefLoading,
    refetch: fetchBrief,
    isError: briefError,
  } = useInsightBrief(resolvedTicker);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <SkeletonPlaceholder className="h-12 w-64" />
        <SkeletonPlaceholder className="h-8 w-48" />
        <div className="grid grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonPlaceholder key={i} className="h-16 w-full" />
          ))}
        </div>
        <SkeletonPlaceholder className="h-[300px] w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <InlineNotification
          kind="error"
          title="Error"
          subtitle={`Failed to load stock data for ${resolvedTicker}. Please try again later.`}
          lowContrast
          hideCloseButton
        />
      </div>
    );
  }

  const { stock, earnings, priceHistory, news } = data;

  const metrics = [
    { label: "P/E Ratio", value: stock.pe.toString() },
    { label: "Market Cap", value: `\u20B9${stock.marketCap}` },
    {
      label: "52W High",
      value: `\u20B9${stock.high52W.toLocaleString("en-IN")}`,
    },
    {
      label: "52W Low",
      value: `\u20B9${stock.low52W.toLocaleString("en-IN")}`,
    },
    { label: "Volume", value: (stock.volume / 1e6).toFixed(1) + "M" },
    { label: "Avg Volume", value: (stock.avgVolume / 1e6).toFixed(1) + "M" },
  ];

  const chartData = priceHistory.map((p) => ({ group: stock.ticker, date: p.date, value: p.price }));
  const chartOptions = {
    title: "Price Chart (1Y)",
    axes: {
      bottom: { mapsTo: "date", scaleType: "labels" as const },
      left: { mapsTo: "value", scaleType: "linear" as const, includeZero: false },
    },
    height: "280px",
    theme: "g100" as const,
    grid: { x: { enabled: false }, y: { enabled: true } },
    legend: { enabled: false },
    color: { scale: { [stock.ticker]: "#4589ff" } },
    toolbar: { enabled: false },
    points: { radius: 0 },
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Stock Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">{stock.name}</h1>
            <Tag type="outline" size="sm" className="font-mono text-xs">
              {stock.ticker}
            </Tag>
            <Tag type="gray" size="sm" className="text-xs">
              {stock.sector}
            </Tag>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-mono-data text-2xl font-semibold">
              {"\u20B9"}
              {stock.price.toLocaleString("en-IN")}
            </span>
            <span
              className={`font-mono-data text-sm flex items-center gap-1 ${
                stock.change >= 0
                  ? "text-carbon-success"
                  : "text-carbon-danger"
              }`}
            >
              {stock.change >= 0 ? (
                <ArrowUp size={14} />
              ) : (
                <ArrowDown size={14} />
              )}
              {stock.change >= 0 ? "+" : ""}
              {stock.change.toFixed(2)} (
              {stock.changePercent >= 0 ? "+" : ""}
              {stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs>
        <TabList aria-label="Stock details">
          <Tab>Overview</Tab>
          <Tab>News</Tab>
          <Tab>Financials</Tab>
          <Tab>AI Brief</Tab>
        </TabList>
        <TabPanels>
          {/* Overview */}
          <TabPanel className="mt-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {metrics.map((m) => (
                <Tile key={m.label} className="p-3">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    {m.label}
                  </p>
                  <p className="font-mono-data text-sm font-semibold mt-1">
                    {m.value}
                  </p>
                </Tile>
              ))}
            </div>
            <Tile className="p-4">
              <LineChart data={chartData} options={chartOptions} />
            </Tile>
          </TabPanel>

          {/* News */}
          <TabPanel className="mt-4">
            <Tile className="p-0 divide-y divide-border">
              {news.length > 0 ? (
                news.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-3 flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm">{item.headline}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {item.source} &bull; {item.time}
                      </p>
                    </div>
                    <Tag
                      type={
                        item.sentiment === "positive"
                          ? "green"
                          : item.sentiment === "negative"
                          ? "red"
                          : "gray"
                      }
                      size="sm"
                      className="shrink-0 capitalize"
                    >
                      {item.sentiment}
                    </Tag>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No recent news for {stock.ticker}.
                </div>
              )}
            </Tile>
          </TabPanel>

          {/* Financials */}
          <TabPanel className="mt-4">
            <Tile className="p-0">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold">Quarterly Earnings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-[11px] uppercase tracking-wider h-9 text-left px-4">
                        Quarter
                      </th>
                      <th className="text-[11px] uppercase tracking-wider h-9 text-right px-4">
                        Revenue
                      </th>
                      <th className="text-[11px] uppercase tracking-wider h-9 text-right px-4">
                        PAT
                      </th>
                      <th className="text-[11px] uppercase tracking-wider h-9 text-right px-4">
                        EPS Growth
                      </th>
                      <th className="text-[11px] uppercase tracking-wider h-9 text-right px-4">
                        Margin
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {earnings.map((q) => (
                      <tr key={q.quarter} className="border-b border-border">
                        <td className="font-mono-data text-sm py-2.5 px-4">
                          {q.quarter}
                        </td>
                        <td className="font-mono-data text-sm text-right py-2.5 px-4">
                          {q.revenue}
                        </td>
                        <td className="font-mono-data text-sm text-right py-2.5 px-4">
                          {q.pat}
                        </td>
                        <td className="font-mono-data text-sm text-right py-2.5 px-4 text-carbon-success">
                          {q.epsGrowth}
                        </td>
                        <td className="font-mono-data text-sm text-right py-2.5 px-4">
                          {q.margin}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tile>
          </TabPanel>

          {/* AI Brief */}
          <TabPanel className="mt-4 space-y-4">
            <Tile className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <WatsonHealthAiResults size={16} />
                <h3 className="text-sm font-semibold">
                  AI Investment Brief -- Peter Lynch Style
                </h3>
                <Tag
                  type="outline"
                  size="sm"
                  className="text-[9px] font-mono ml-auto"
                >
                  AI-Generated - Not Financial Advice
                </Tag>
              </div>

              {briefData ? (
                <>
                  {(() => {
                    const sections = parseBrief(briefData.content);
                    return (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                              The Story
                            </p>
                            <div className="bg-muted/50 p-3 text-sm whitespace-pre-wrap">
                              {sections.story || "No data available."}
                            </div>
                          </div>
                          <div>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                              The Numbers
                            </p>
                            <div className="bg-muted/50 p-3 text-sm whitespace-pre-wrap">
                              {sections.numbers || "No data available."}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                              <Security size={12} /> The Moat
                            </p>
                            <div className="bg-muted/50 p-3 text-sm whitespace-pre-wrap">
                              {sections.moat || "No data available."}
                            </div>
                          </div>
                          <div>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                              <WarningAlt size={12} /> The Risks
                            </p>
                            <div className="bg-muted/50 p-3 text-sm whitespace-pre-wrap">
                              {sections.risks || "No data available."}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="mt-4 border-t border-border pt-3">
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <WarningAlt size={12} />
                      Generated at{" "}
                      {new Date(briefData.generatedAt).toLocaleString()} |
                      Sources: {briefData.sources.join(", ")}
                    </p>
                  </div>
                </>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                        Business Model Summary
                      </p>
                      <div className="bg-muted/50 p-3 text-sm text-muted-foreground italic">
                        {briefLoading
                          ? "Generating AI brief..."
                          : "Click the button below to generate an AI investment brief."}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                        Key Metrics &amp; Valuation
                      </p>
                      <div className="bg-muted/50 p-3 text-sm text-muted-foreground italic">
                        {briefLoading
                          ? "Analyzing financial data..."
                          : "Pending AI generation."}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Security size={12} /> Moat Analysis
                      </p>
                      <div className="bg-muted/50 p-3 text-sm text-muted-foreground italic">
                        {briefLoading
                          ? "Evaluating competitive advantages..."
                          : "Pending AI generation."}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                        <WarningAlt size={12} /> Key Risks
                      </p>
                      <div className="bg-muted/50 p-3 text-sm text-muted-foreground italic">
                        {briefLoading
                          ? "Identifying risk factors..."
                          : "Pending AI generation."}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!briefData && (
                <div className="mt-4 flex justify-center">
                  <Button
                    kind="tertiary"
                    size="sm"
                    onClick={() => fetchBrief()}
                    disabled={briefLoading}
                    renderIcon={
                      briefLoading ? InlineLoading : WatsonHealthAiResults
                    }
                  >
                    {briefLoading ? "Generating Brief..." : "Generate AI Brief"}
                  </Button>
                </div>
              )}

              {briefError && (
                <InlineNotification
                  kind="error"
                  title="Error"
                  subtitle="Failed to generate AI brief. Please try again."
                  lowContrast
                  hideCloseButton
                  className="mt-2"
                />
              )}

              <div className="mt-4 border-t border-border pt-3">
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <WarningAlt size={12} />
                  {briefData
                    ? briefData.disclaimer
                    : "Audit Trail: Brief not yet generated. Timestamp, model version, and data sources will be logged here."}
                </p>
              </div>
            </Tile>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
