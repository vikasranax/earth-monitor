import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";
import { serverEnv } from "@/lib/env";
import { watchlist } from "@/lib/markets-watchlist";

export interface MarketQuote {
  symbol: string;
  label: string;
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

const PROVIDER_ID = "twelvedata";

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
