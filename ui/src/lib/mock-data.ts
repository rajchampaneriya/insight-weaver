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
  { ticker: "HDFCBANK", name: "HDFC Bank", sector: "Banking", price: 1685.20, change: 24.80, changePercent: 1.49, volume: 12600000, avgVolume: 9800000, marketCap: "₹12.8L Cr", pe: 19.6, high52w: 1794.00, low52w: 1363.55 },
  { ticker: "TATAMOTORS", name: "Tata Motors", sector: "Auto", price: 748.90, change: -31.20, changePercent: -4.00, volume: 22100000, avgVolume: 11400000, marketCap: "₹2.7L Cr", pe: 8.2, high52w: 1072.00, low52w: 608.30 },
  { ticker: "ADANIENT", name: "Adani Enterprises", sector: "Conglomerate", price: 2634.50, change: 128.40, changePercent: 5.12, volume: 6700000, avgVolume: 3100000, marketCap: "₹3.0L Cr", pe: 72.3, high52w: 3743.90, low52w: 2142.00 },
  { ticker: "SUNPHARMA", name: "Sun Pharma", sector: "Pharma", price: 1756.80, change: 18.90, changePercent: 1.09, volume: 3200000, avgVolume: 2800000, marketCap: "₹4.2L Cr", pe: 38.5, high52w: 1960.60, low52w: 1208.25 },
  { ticker: "ICICIBANK", name: "ICICI Bank", sector: "Banking", price: 1245.30, change: 12.40, changePercent: 1.01, volume: 8900000, avgVolume: 7200000, marketCap: "₹8.7L Cr", pe: 18.2, high52w: 1310.00, low52w: 898.45 },
  { ticker: "BHARTIARTL", name: "Bharti Airtel", sector: "Telecom", price: 1580.45, change: 22.10, changePercent: 1.42, volume: 5600000, avgVolume: 4100000, marketCap: "₹9.4L Cr", pe: 74.3, high52w: 1778.00, low52w: 1098.65 },
  { ticker: "KOTAKBANK", name: "Kotak Mahindra Bank", sector: "Banking", price: 1820.90, change: -14.30, changePercent: -0.78, volume: 3400000, avgVolume: 2800000, marketCap: "₹3.6L Cr", pe: 21.4, high52w: 1942.00, low52w: 1544.15 },
];

export const newsFeed: NewsItem[] = [
  { id: "1", headline: "Reliance Jio crosses 500M subscriber milestone, ARPU rises 12% QoQ", source: "Economic Times", time: "14 min ago", sentiment: "positive", ticker: "RELIANCE" },
  { id: "2", headline: "HDFC Bank reports robust Q3 deposit growth of 15% YoY", source: "Moneycontrol", time: "32 min ago", sentiment: "positive", ticker: "HDFCBANK" },
  { id: "3", headline: "RBI keeps repo rate unchanged at 6.5%, shifts stance to accommodative", source: "LiveMint", time: "1 hr ago", sentiment: "neutral" },
  { id: "4", headline: "Adani Enterprises wins new coal mining contract worth ₹12,000 Cr", source: "Business Standard", time: "1 hr ago", sentiment: "positive", ticker: "ADANIENT" },
  { id: "5", headline: "Tata Motors EV sales decline 18% in January, market share under pressure", source: "NDTV Profit", time: "2 hr ago", sentiment: "negative", ticker: "TATAMOTORS" },
  { id: "6", headline: "SEBI proposes new framework for ESG rating providers", source: "Reuters", time: "3 hr ago", sentiment: "neutral" },
  { id: "7", headline: "Bharti Airtel 5G rollout covers 500 cities, subscriber adds accelerate", source: "Economic Times", time: "3 hr ago", sentiment: "positive", ticker: "BHARTIARTL" },
  { id: "8", headline: "Sun Pharma receives FDA approval for new generic drug", source: "Moneycontrol", time: "4 hr ago", sentiment: "positive", ticker: "SUNPHARMA" },
];

export const quarterlyEarnings: Record<string, { quarter: string; revenue: string; pat: string; epsGrowth: string; margin: string }[]> = {
  RELIANCE: [
    { quarter: "Q3 FY25", revenue: "₹2,35,800 Cr", pat: "₹18,540 Cr", epsGrowth: "12.4%", margin: "7.9%" },
    { quarter: "Q2 FY25", revenue: "₹2,28,400 Cr", pat: "₹17,820 Cr", epsGrowth: "8.2%", margin: "7.8%" },
    { quarter: "Q1 FY25", revenue: "₹2,21,700 Cr", pat: "₹16,950 Cr", epsGrowth: "6.1%", margin: "7.6%" },
    { quarter: "Q4 FY24", revenue: "₹2,15,200 Cr", pat: "₹15,400 Cr", epsGrowth: "4.8%", margin: "7.2%" },
  ],
  TCS: [
    { quarter: "Q3 FY25", revenue: "₹64,259 Cr", pat: "₹12,380 Cr", epsGrowth: "5.6%", margin: "19.3%" },
    { quarter: "Q2 FY25", revenue: "₹63,047 Cr", pat: "₹12,105 Cr", epsGrowth: "8.7%", margin: "19.2%" },
    { quarter: "Q1 FY25", revenue: "₹62,613 Cr", pat: "₹11,909 Cr", epsGrowth: "9.1%", margin: "19.0%" },
    { quarter: "Q4 FY24", revenue: "₹61,237 Cr", pat: "₹11,392 Cr", epsGrowth: "7.4%", margin: "18.6%" },
  ],
  HDFCBANK: [
    { quarter: "Q3 FY25", revenue: "₹85,790 Cr", pat: "₹16,736 Cr", epsGrowth: "2.1%", margin: "19.5%" },
    { quarter: "Q2 FY25", revenue: "₹84,026 Cr", pat: "₹16,474 Cr", epsGrowth: "5.3%", margin: "19.6%" },
    { quarter: "Q1 FY25", revenue: "₹82,096 Cr", pat: "₹16,175 Cr", epsGrowth: "35.3%", margin: "19.7%" },
    { quarter: "Q4 FY24", revenue: "₹78,738 Cr", pat: "₹16,512 Cr", epsGrowth: "37.1%", margin: "21.0%" },
  ],
  INFY: [
    { quarter: "Q3 FY25", revenue: "₹41,764 Cr", pat: "₹6,806 Cr", epsGrowth: "11.4%", margin: "16.3%" },
    { quarter: "Q2 FY25", revenue: "₹40,986 Cr", pat: "₹6,506 Cr", epsGrowth: "4.7%", margin: "15.9%" },
    { quarter: "Q1 FY25", revenue: "₹39,315 Cr", pat: "₹6,368 Cr", epsGrowth: "7.1%", margin: "16.2%" },
    { quarter: "Q4 FY24", revenue: "₹37,923 Cr", pat: "₹7,969 Cr", epsGrowth: "29.8%", margin: "21.0%" },
  ],
  TATAMOTORS: [
    { quarter: "Q3 FY25", revenue: "₹1,13,575 Cr", pat: "₹5,578 Cr", epsGrowth: "-22.3%", margin: "4.9%" },
    { quarter: "Q2 FY25", revenue: "₹1,01,450 Cr", pat: "₹3,343 Cr", epsGrowth: "-11.8%", margin: "3.3%" },
    { quarter: "Q1 FY25", revenue: "₹1,08,048 Cr", pat: "₹5,692 Cr", epsGrowth: "73.7%", margin: "5.3%" },
    { quarter: "Q4 FY24", revenue: "₹1,19,986 Cr", pat: "₹7,558 Cr", epsGrowth: "46.4%", margin: "6.3%" },
  ],
  ADANIENT: [
    { quarter: "Q3 FY25", revenue: "₹23,350 Cr", pat: "₹1,290 Cr", epsGrowth: "42.6%", margin: "5.5%" },
    { quarter: "Q2 FY25", revenue: "₹23,196 Cr", pat: "₹1,742 Cr", epsGrowth: "664.4%", margin: "7.5%" },
    { quarter: "Q1 FY25", revenue: "₹25,472 Cr", pat: "₹1,455 Cr", epsGrowth: "116.1%", margin: "5.7%" },
    { quarter: "Q4 FY24", revenue: "₹22,076 Cr", pat: "₹898 Cr", epsGrowth: "38.2%", margin: "4.1%" },
  ],
  SUNPHARMA: [
    { quarter: "Q3 FY25", revenue: "₹13,675 Cr", pat: "₹3,037 Cr", epsGrowth: "25.8%", margin: "22.2%" },
    { quarter: "Q2 FY25", revenue: "₹13,347 Cr", pat: "₹3,040 Cr", epsGrowth: "28.2%", margin: "22.8%" },
    { quarter: "Q1 FY25", revenue: "₹12,652 Cr", pat: "₹2,836 Cr", epsGrowth: "40.2%", margin: "22.4%" },
    { quarter: "Q4 FY24", revenue: "₹11,813 Cr", pat: "₹2,655 Cr", epsGrowth: "34.5%", margin: "22.5%" },
  ],
  WIPRO: [
    { quarter: "Q3 FY25", revenue: "₹22,319 Cr", pat: "₹3,354 Cr", epsGrowth: "24.5%", margin: "15.0%" },
    { quarter: "Q2 FY25", revenue: "₹22,302 Cr", pat: "₹3,209 Cr", epsGrowth: "21.2%", margin: "14.4%" },
    { quarter: "Q1 FY25", revenue: "₹21,964 Cr", pat: "₹3,003 Cr", epsGrowth: "4.6%", margin: "13.7%" },
    { quarter: "Q4 FY24", revenue: "₹22,208 Cr", pat: "₹2,835 Cr", epsGrowth: "-7.6%", margin: "12.8%" },
  ],
};

export const priceHistory: Record<string, { date: string; price: number }[]> = {
  RELIANCE: [
    { date: "Jan", price: 2680 }, { date: "Feb", price: 2720 }, { date: "Mar", price: 2650 },
    { date: "Apr", price: 2780 }, { date: "May", price: 2830 }, { date: "Jun", price: 2900 },
    { date: "Jul", price: 2850 }, { date: "Aug", price: 2920 }, { date: "Sep", price: 2880 },
    { date: "Oct", price: 2960 }, { date: "Nov", price: 2910 }, { date: "Dec", price: 2945 },
  ],
  TCS: [
    { date: "Jan", price: 3850 }, { date: "Feb", price: 3920 }, { date: "Mar", price: 3780 },
    { date: "Apr", price: 3960 }, { date: "May", price: 4050 }, { date: "Jun", price: 3890 },
    { date: "Jul", price: 3950 }, { date: "Aug", price: 4100 }, { date: "Sep", price: 4180 },
    { date: "Oct", price: 4050 }, { date: "Nov", price: 4200 }, { date: "Dec", price: 4128 },
  ],
  HDFCBANK: [
    { date: "Jan", price: 1520 }, { date: "Feb", price: 1480 }, { date: "Mar", price: 1540 },
    { date: "Apr", price: 1580 }, { date: "May", price: 1620 }, { date: "Jun", price: 1590 },
    { date: "Jul", price: 1650 }, { date: "Aug", price: 1680 }, { date: "Sep", price: 1640 },
    { date: "Oct", price: 1700 }, { date: "Nov", price: 1660 }, { date: "Dec", price: 1685 },
  ],
  INFY: [
    { date: "Jan", price: 1620 }, { date: "Feb", price: 1580 }, { date: "Mar", price: 1650 },
    { date: "Apr", price: 1700 }, { date: "May", price: 1680 }, { date: "Jun", price: 1740 },
    { date: "Jul", price: 1780 }, { date: "Aug", price: 1820 }, { date: "Sep", price: 1760 },
    { date: "Oct", price: 1850 }, { date: "Nov", price: 1870 }, { date: "Dec", price: 1892 },
  ],
  TATAMOTORS: [
    { date: "Jan", price: 920 }, { date: "Feb", price: 960 }, { date: "Mar", price: 880 },
    { date: "Apr", price: 850 }, { date: "May", price: 810 }, { date: "Jun", price: 790 },
    { date: "Jul", price: 820 }, { date: "Aug", price: 780 }, { date: "Sep", price: 760 },
    { date: "Oct", price: 740 }, { date: "Nov", price: 730 }, { date: "Dec", price: 748 },
  ],
  ADANIENT: [
    { date: "Jan", price: 2480 }, { date: "Feb", price: 2550 }, { date: "Mar", price: 2420 },
    { date: "Apr", price: 2380 }, { date: "May", price: 2510 }, { date: "Jun", price: 2580 },
    { date: "Jul", price: 2650 }, { date: "Aug", price: 2520 }, { date: "Sep", price: 2610 },
    { date: "Oct", price: 2550 }, { date: "Nov", price: 2590 }, { date: "Dec", price: 2634 },
  ],
  SUNPHARMA: [
    { date: "Jan", price: 1420 }, { date: "Feb", price: 1480 }, { date: "Mar", price: 1510 },
    { date: "Apr", price: 1550 }, { date: "May", price: 1580 }, { date: "Jun", price: 1620 },
    { date: "Jul", price: 1660 }, { date: "Aug", price: 1640 }, { date: "Sep", price: 1700 },
    { date: "Oct", price: 1720 }, { date: "Nov", price: 1740 }, { date: "Dec", price: 1756 },
  ],
  WIPRO: [
    { date: "Jan", price: 480 }, { date: "Feb", price: 490 }, { date: "Mar", price: 475 },
    { date: "Apr", price: 495 }, { date: "May", price: 510 }, { date: "Jun", price: 520 },
    { date: "Jul", price: 505 }, { date: "Aug", price: 530 }, { date: "Sep", price: 525 },
    { date: "Oct", price: 540 }, { date: "Nov", price: 535 }, { date: "Dec", price: 542 },
  ],
};

export const allStocks: Stock[] = [
  ...unusualMovers,
  { ticker: "ICICIBANK", name: "ICICI Bank", sector: "Banking", price: 1245.30, change: 12.40, changePercent: 1.01, volume: 8900000, avgVolume: 7200000, marketCap: "₹8.7L Cr", pe: 18.2, high52w: 1310.00, low52w: 898.45 },
  { ticker: "HINDUNILVR", name: "Hindustan Unilever", sector: "FMCG", price: 2380.60, change: -5.20, changePercent: -0.22, volume: 2100000, avgVolume: 1900000, marketCap: "₹5.6L Cr", pe: 56.8, high52w: 2859.00, low52w: 2172.05 },
  { ticker: "BHARTIARTL", name: "Bharti Airtel", sector: "Telecom", price: 1580.45, change: 22.10, changePercent: 1.42, volume: 5600000, avgVolume: 4100000, marketCap: "₹9.4L Cr", pe: 74.3, high52w: 1778.00, low52w: 1098.65 },
  { ticker: "KOTAKBANK", name: "Kotak Mahindra Bank", sector: "Banking", price: 1820.90, change: -14.30, changePercent: -0.78, volume: 3400000, avgVolume: 2800000, marketCap: "₹3.6L Cr", pe: 21.4, high52w: 1942.00, low52w: 1544.15 },
];
