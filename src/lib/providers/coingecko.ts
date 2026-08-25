import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";

export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  current_price: number | null;
  market_cap: number | null;
  total_volume: number | null;
  price_change_percentage_24h: number | null;
  image: string;
}

export interface CryptoSnapshot {
  coins: CryptoCoin[];
  cached: boolean;
  count: number;
  error?: string;
}

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

const TOP_IDS = [
  "bitcoin", "ethereum", "solana", "binancecoin", "ripple",
  "cardano", "dogecoin", "tron", "polkadot", "chainlink",
];

export async function fetchCryptoSnapshot(): Promise<CryptoSnapshot> {
  const rateOk = await checkRateLimit("coingecko", 10, 60);
  if (!rateOk.success) {
    return { coins: [], cached: false, count: 0, error: "Rate limit exceeded" };
  }

  try {
    const ids = TOP_IDS.join(",");
    const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`;

    const { data, cached } = await fetchWithCache(
      "markets:crypto:coingecko",
      async () => {
        const res = await fetch(url, { next: { revalidate: 60 } });
        if (!res.ok) throw new Error(`CoinGecko responded ${res.status}`);
        return (await res.json()) as Array<{
          id: string;
          symbol: string;
          name: string;
          current_price: number | null;
          market_cap: number | null;
          total_volume: number | null;
          price_change_percentage_24h: number | null;
          image: string;
        }>;
      },
      { ttlSeconds: 60 },
    );

    const coins: CryptoCoin[] = data.map((c) => ({
      id: c.id,
      symbol: c.symbol,
      name: c.name,
      current_price: c.current_price,
      market_cap: c.market_cap,
      total_volume: c.total_volume,
      price_change_percentage_24h: c.price_change_percentage_24h,
      image: c.image,
    }));

    return { coins, cached, count: coins.length };
  } catch (err) {
    return {
      coins: [],
      cached: false,
      count: 0,
      error: err instanceof Error ? err.message : "CoinGecko fetch failed",
    };
  }
}
