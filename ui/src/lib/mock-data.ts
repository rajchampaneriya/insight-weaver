export interface Stock {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume: number;
  marketCap: string;
  pe: number;
  high52w: number;
  low52w: number;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  time: string;
  sentiment: "positive" | "neutral" | "negative";
  ticker?: string;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export const marketIndices: MarketIndex[] = [
  { name: "NIFTY 50", value: 24856.15, change: 142.30, changePercent: 0.58 },
  { name: "SENSEX", value: 81903.42, change: 468.75, changePercent: 0.58 },
  { name: "NIFTY BANK", value: 53412.80, change: -89.40, changePercent: -0.17 },
  { name: "NIFTY IT", value: 42130.55, change: 312.90, changePercent: 0.75 },
];

export const sectorPerformance = [
  { name: "IT", change: 1.2 },
  { name: "Pharma", change: 0.8 },
  { name: "FMCG", change: 0.3 },
  { name: "Auto", change: -0.4 },
  { name: "Bank", change: -0.2 },
  { name: "Metal", change: 1.5 },
  { name: "Energy", change: -0.7 },
  { name: "Realty", change: 0.6 },
];

export const unusualMovers: Stock[] = [
  { ticker: "RELIANCE", name: "Reliance Industries", sector: "Energy", price: 2945.60, change: 87.30, changePercent: 3.05, volume: 15200000, avgVolume: 8500000, marketCap: "₹19.9L Cr", pe: 28.4, high52w: 3024.90, low52w: 2220.30 },
  { ticker: "TCS", name: "Tata Consultancy Services", sector: "IT", price: 4128.75, change: -62.15, changePercent: -1.48, volume: 4800000, avgVolume: 2100000, marketCap: "₹14.9L Cr", pe: 32.1, high52w: 4592.25, low52w: 3311.05 },
  { ticker: "HDFCBANK", name: "HDFC Bank", sector: "Banking", price: 1685.20, change: 24.80, changePercent: 1.49, volume: 12600000, avgVolume: 9800000, marketCap: "₹12.8L Cr", pe: 19.6, high52w: 1794.00, low52w: 1363.55 },
  { ticker: "INFY", name: "Infosys", sector: "IT", price: 1892.30, change: 45.60, changePercent: 2.47, volume: 8900000, avgVolume: 5200000, marketCap: "₹7.8L Cr", pe: 29.8, high52w: 1989.40, low52w: 1358.35 },
  { ticker: "TATAMOTORS", name: "Tata Motors", sector: "Auto", price: 748.90, change: -31.20, changePercent: -4.00, volume: 22100000, avgVolume: 11400000, marketCap: "₹2.7L Cr", pe: 8.2, high52w: 1072.00, low52w: 608.30 },
  { ticker: "ADANIENT", name: "Adani Enterprises", sector: "Conglomerate", price: 2634.50, change: 128.40, changePercent: 5.12, volume: 6700000, avgVolume: 3100000, marketCap: "₹3.0L Cr", pe: 72.3, high52w: 3743.90, low52w: 2142.00 },
  { ticker: "SUNPHARMA", name: "Sun Pharma", sector: "Pharma", price: 1756.80, change: 18.90, changePercent: 1.09, volume: 3200000, avgVolume: 2800000, marketCap: "₹4.2L Cr", pe: 38.5, high52w: 1960.60, low52w: 1208.25 },
  { ticker: "WIPRO", name: "Wipro", sector: "IT", price: 542.15, change: -8.30, changePercent: -1.51, volume: 7400000, avgVolume: 5600000, marketCap: "₹2.8L Cr", pe: 24.7, high52w: 585.65, low52w: 388.70 },
];

export const newsFeed: NewsItem[] = [
  { id: "1", headline: "Reliance Jio crosses 500M subscriber milestone, ARPU rises 12% QoQ", source: "Economic Times", time: "14 min ago", sentiment: "positive", ticker: "RELIANCE" },
  { id: "2", headline: "TCS warns of slower deal pipeline amid global macro uncertainty", source: "Moneycontrol", time: "32 min ago", sentiment: "negative", ticker: "TCS" },
  { id: "3", headline: "RBI keeps repo rate unchanged at 6.5%, shifts stance to accommodative", source: "LiveMint", time: "1 hr ago", sentiment: "neutral" },
  { id: "4", headline: "Adani Enterprises wins new coal mining contract worth ₹12,000 Cr", source: "Business Standard", time: "1 hr ago", sentiment: "positive", ticker: "ADANIENT" },
  { id: "5", headline: "Tata Motors EV sales decline 18% in January, market share under pressure", source: "NDTV Profit", time: "2 hr ago", sentiment: "negative", ticker: "TATAMOTORS" },
  { id: "6", headline: "SEBI proposes new framework for ESG rating providers", source: "Reuters", time: "3 hr ago", sentiment: "neutral" },
  { id: "7", headline: "Infosys bags $2B deal with European financial services firm", source: "Economic Times", time: "3 hr ago", sentiment: "positive", ticker: "INFY" },
  { id: "8", headline: "Sun Pharma receives FDA approval for new generic drug", source: "Moneycontrol", time: "4 hr ago", sentiment: "positive", ticker: "SUNPHARMA" },
];

export const quarterlyEarnings = [
  { quarter: "Q3 FY25", revenue: "₹2,35,800 Cr", pat: "₹18,540 Cr", epsGrowth: "12.4%", margin: "7.9%" },
  { quarter: "Q2 FY25", revenue: "₹2,28,400 Cr", pat: "₹17,820 Cr", epsGrowth: "8.2%", margin: "7.8%" },
  { quarter: "Q1 FY25", revenue: "₹2,21,700 Cr", pat: "₹16,950 Cr", epsGrowth: "6.1%", margin: "7.6%" },
  { quarter: "Q4 FY24", revenue: "₹2,15,200 Cr", pat: "₹15,400 Cr", epsGrowth: "4.8%", margin: "7.2%" },
];

export const priceHistory = [
  { date: "Jan", price: 2680 },
  { date: "Feb", price: 2720 },
  { date: "Mar", price: 2650 },
  { date: "Apr", price: 2780 },
  { date: "May", price: 2830 },
  { date: "Jun", price: 2900 },
  { date: "Jul", price: 2850 },
  { date: "Aug", price: 2920 },
  { date: "Sep", price: 2880 },
  { date: "Oct", price: 2960 },
  { date: "Nov", price: 2910 },
  { date: "Dec", price: 2945 },
];

export const allStocks: Stock[] = [
  ...unusualMovers,
  { ticker: "ICICIBANK", name: "ICICI Bank", sector: "Banking", price: 1245.30, change: 12.40, changePercent: 1.01, volume: 8900000, avgVolume: 7200000, marketCap: "₹8.7L Cr", pe: 18.2, high52w: 1310.00, low52w: 898.45 },
  { ticker: "HINDUNILVR", name: "Hindustan Unilever", sector: "FMCG", price: 2380.60, change: -5.20, changePercent: -0.22, volume: 2100000, avgVolume: 1900000, marketCap: "₹5.6L Cr", pe: 56.8, high52w: 2859.00, low52w: 2172.05 },
  { ticker: "BHARTIARTL", name: "Bharti Airtel", sector: "Telecom", price: 1580.45, change: 22.10, changePercent: 1.42, volume: 5600000, avgVolume: 4100000, marketCap: "₹9.4L Cr", pe: 74.3, high52w: 1778.00, low52w: 1098.65 },
  { ticker: "KOTAKBANK", name: "Kotak Mahindra Bank", sector: "Banking", price: 1820.90, change: -14.30, changePercent: -0.78, volume: 3400000, avgVolume: 2800000, marketCap: "₹3.6L Cr", pe: 21.4, high52w: 1942.00, low52w: 1544.15 },
];
