import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";
import type { WatchlistSymbol } from "@/lib/markets-watchlist";
import { watchlist } from "@/lib/markets-watchlist";

export interface MarketQuote {
  symbol: string;
  label: string;
  category: WatchlistSymbol["category"];
  region: string;
  regionName: string;
  price: number;
  percentChange: number;
  currency: string;
}

export interface MarketsFetchResult {
  armed: boolean;
  quotes: MarketQuote[];
  cached: boolean;
  error?: string;
}

interface YahooChartResponse {
  chart?: {
    result?: Array<{
      meta: {
        regularMarketPrice?: number;
        previousClose?: number;
        currency?: string;
        shortName?: string;
        symbol?: string;
      };
    }>;
    error?: { description?: string };
  };
}

const PROVIDER_ID = "yahoo-finance";

/* ── Fetch a single quote from Yahoo ──────────────────────── */
async function fetchYahooQuote(symbol: string): Promise<{
  price: number;
  prevClose: number;
  currency: string;
  shortName: string;
} | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.warn(`[YAHOO] ${symbol} HTTP ${res.status}`);
      return null;
    }

    const json = (await res.json()) as YahooChartResponse;
    const meta = json?.chart?.result?.[0]?.meta;

    if (!meta || meta.regularMarketPrice == null) {
      console.warn(`[YAHOO] ${symbol} no market data`);
      return null;
    }

    return {
      price: meta.regularMarketPrice,
      prevClose: meta.previousClose ?? meta.regularMarketPrice,
      currency: meta.currency || "USD",
      shortName: meta.shortName || symbol,
    };
  } catch (err) {
    console.warn(`[YAHOO] ${symbol} error:`, err instanceof Error ? err.message : err);
    return null;
  }
}

/* ── Fetch forex rates for currency conversion ────────────── */
export async function fetchForexRates(): Promise<Record<string, number>> {
  const pairs = [
    "USD/INR",
    "EUR/USD",
    "GBP/USD",
    "USD/JPY",
    "USD/CNY",
    "USD/SGD",
    "USD/KRW",
    "USD/RUB",
    "USD/ZAR",
    "USD/BRL",
    "USD/MXN",
    "USD/CAD",
  ];
  const rates: Record<string, number> = { USD: 1 };

  await Promise.all(
    pairs.map(async (pair) => {
      const quote = await fetchYahooQuote(pair);
      if (!quote) return;

      if (pair.startsWith("USD/")) {
        // USD/XYZ = how many XYZ per 1 USD
        const target = pair.replace("USD/", "");
        rates[target] = quote.price;
      } else if (pair.endsWith("/USD")) {
        // XYZ/USD = how many USD per 1 XYZ, so 1 USD = 1/quote.price XYZ
        const source = pair.replace("/USD", "");
        rates[source] = 1 / quote.price;
      }
    }),
  );

  return rates;
}

/* ── Convert price to target currency ─────────────────────── */
export function convertPrice(
  price: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>,
): number {
  if (fromCurrency === toCurrency) return price;

  // Step 1: from → USD
  let usdAmount: number;
  if (fromCurrency === "USD") {
    usdAmount = price;
  } else if (rates[fromCurrency]) {
    // rates[fromCurrency] = how many fromCurrency per 1 USD
    // So price in fromCurrency → USD = price / rate
    usdAmount = price / rates[fromCurrency];
  } else {
    return price; // can't convert
  }

  // Step 2: USD → to
  if (toCurrency === "USD") return usdAmount;
  if (rates[toCurrency]) {
    // rates[toCurrency] = how many toCurrency per 1 USD
    return usdAmount * rates[toCurrency];
  }

  return usdAmount;
}

/* ── Fetch full watchlist ───────────────────────────────── */
export async function fetchMarketQuotes(): Promise<MarketsFetchResult> {
  const rate = await checkRateLimit(PROVIDER_ID, 20, 60);
  if (!rate.success) {
    return {
      armed: true,
      quotes: [],
      cached: false,
      error: "Rate limit reached — try again shortly.",
    };
  }

  try {
    const { data, cached } = await fetchWithCache(
      "markets:yahoo:watchlist",
      async () => {
        const results = await Promise.all(
          watchlist.map(async (w): Promise<MarketQuote | null> => {
            const quote = await fetchYahooQuote(w.symbol);
            if (!quote) return null;

            const percentChange = quote.prevClose
              ? ((quote.price - quote.prevClose) / quote.prevClose) * 100
              : 0;

            return {
              symbol: w.symbol,
              label: w.label,
              category: w.category,
              region: w.region,
              regionName: w.regionName,
              price: quote.price,
              percentChange: Math.round(percentChange * 100) / 100,
              currency: quote.currency,
            };
          }),
        );
        return results.filter((r): r is MarketQuote => r !== null);
      },
      { ttlSeconds: 60 },
    );

    return { armed: true, quotes: data, cached };
  } catch (err) {
    return {
      armed: true,
      quotes: [],
      cached: false,
      error: err instanceof Error ? err.message : "Unknown error fetching Yahoo Finance data",
    };
  }
}

/* ── Fetch a specific quote (for copilot) ───────────────── */
export async function fetchQuote(symbol: string): Promise<MarketQuote | null> {
  try {
    const quote = await fetchYahooQuote(symbol);
    if (!quote) return null;

    const w = watchlist.find((x) => x.symbol === symbol);
    const percentChange = quote.prevClose
      ? ((quote.price - quote.prevClose) / quote.prevClose) * 100
      : 0;

    return {
      symbol,
      label: w?.label || quote.shortName || symbol,
      category: w?.category || "equity",
      region: w?.region || "GL",
      regionName: w?.regionName || "Global",
      price: quote.price,
      percentChange: Math.round(percentChange * 100) / 100,
      currency: quote.currency,
    };
  } catch {
    return null;
  }
}
