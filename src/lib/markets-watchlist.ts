export interface WatchlistSymbol {
  symbol: string;
  label: string;
  category: "index" | "commodity" | "forex" | "crypto";
}

// Symbols chosen for broad TwelveData free-tier compatibility
// (ETF proxies for index/commodity exposure, since raw index/futures
// symbols often need a paid tier).
export const watchlist: WatchlistSymbol[] = [
  { symbol: "SPY", label: "S&P 500 (ETF)", category: "index" },
  { symbol: "QQQ", label: "Nasdaq 100 (ETF)", category: "index" },
  { symbol: "GLD", label: "Gold (ETF)", category: "commodity" },
  { symbol: "EUR/USD", label: "EUR/USD", category: "forex" },
  { symbol: "BTC/USD", label: "Bitcoin", category: "crypto" },
];
