import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";
import { serverEnv } from "@/lib/env";
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
}

export interface MarketsFetchResult {
  armed: boolean;
  quotes: MarketQuote[];
  cached: boolean;
  error?: string;
}

interface TwelveDataQuoteResponse {
  symbol?: string;
  close?: string;
  percent_change?: string;
  status?: string;
  message?: string;
}

interface TwelveDataSearchResult {
  data?: Array<{
    symbol: string;
    instrument_name: string;
    exchange: string;
    type: string;
  }>;
}

const PROVIDER_ID = "twelvedata";

/* ── Fetch full watchlist ─────────────────────────────────── */
export async function fetchMarketQuotes(): Promise<MarketsFetchResult> {
  if (!serverEnv.TWELVEDATA_API_KEY) {
    return { armed: false, quotes: [], cached: false };
  }

  const rate = await checkRateLimit(PROVIDER_ID, 8, 60);
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
      "markets:twelvedata:watchlist",
      async () => {
        const results = await Promise.all(
          watchlist.map(async (w): Promise<MarketQuote | null> => {
            const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(w.symbol)}&apikey=${serverEnv.TWELVEDATA_API_KEY}`;
            const res = await fetch(url);
            if (!res.ok) return null;
            const json = (await res.json()) as TwelveDataQuoteResponse;
            if (json.status === "error" || !json.close) return null;
            return {
              symbol: w.symbol,
              label: w.label,
              category: w.category,
              region: w.region,
              regionName: w.regionName,
              price: parseFloat(json.close),
              percentChange: parseFloat(json.percent_change ?? "0"),
            };
          }),
        );
        return results.filter((r): r is MarketQuote => r !== null);
      },
      { ttlSeconds: 90 },
    );

    return { armed: true, quotes: data, cached };
  } catch (err) {
    return {
      armed: true,
      quotes: [],
      cached: false,
      error: err instanceof Error ? err.message : "Unknown error fetching market data",
    };
  }
}

/* ── Search symbol by name (for copilot) ──────────────────── */
export async function searchSymbol(
  query: string,
): Promise<Array<{ symbol: string; name: string; type: string }>> {
  if (!serverEnv.TWELVEDATA_API_KEY) return [];

  try {
    const url = `https://api.twelvedata.com/symbol_search?symbol=${encodeURIComponent(query)}&apikey=${serverEnv.TWELVEDATA_API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = (await res.json()) as TwelveDataSearchResult;
    return (json.data || []).slice(0, 5).map((d) => ({
      symbol: d.symbol,
      name: d.instrument_name,
      type: d.type,
    }));
  } catch {
    return [];
  }
}

/* ── Fetch a specific quote (for copilot) ─────────────────── */
export async function fetchQuote(symbol: string): Promise<MarketQuote | null> {
  if (!serverEnv.TWELVEDATA_API_KEY) return null;

  try {
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${serverEnv.TWELVEDATA_API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = (await res.json()) as TwelveDataQuoteResponse;
    if (json.status === "error" || !json.close) return null;

    const w = watchlist.find((x) => x.symbol === symbol);
    return {
      symbol: json.symbol || symbol,
      label: w?.label || symbol,
      category: w?.category || "equity",
      region: w?.region || "GL",
      regionName: w?.regionName || "Global",
      price: parseFloat(json.close),
      percentChange: parseFloat(json.percent_change ?? "0"),
    };
  } catch {
    return null;
  }
}
