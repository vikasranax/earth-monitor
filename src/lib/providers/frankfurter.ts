import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";

export interface FxRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface FxSnapshot {
  rates: FxRates;
  cached: boolean;
  error?: string;
}

const FRANKFURTER_BASE = "https://api.frankfurter.app";

const PRIORITY_SYMBOLS = [
  "USD", "EUR", "GBP", "JPY", "CNY", "INR", "AUD", "CAD",
  "CHF", "SEK", "NZD", "SGD", "HKD", "KRW", "BRL", "RUB",
  "ZAR", "MXN", "AED", "SAR", "TRY", "IDR", "THB", "MYR",
  "PHP", "VND", "PKR", "BDT", "NGN", "EGP", "ILS", "PLN",
];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function fetchFxSnapshot(base = "USD"): Promise<FxSnapshot> {
  const rateOk = await checkRateLimit("frankfurter", 10, 60);
  if (!rateOk.success) {
    return {
      rates: { base, date: today(), rates: {} },
      cached: false,
      error: "Rate limit exceeded",
    };
  }

  try {
    const symbols = PRIORITY_SYMBOLS.filter((c) => c !== base).join(",");
    const { data, cached } = await fetchWithCache(
      `markets:fx:${base}`,
      async () => {
        const res = await fetch(
          `${FRANKFURTER_BASE}/latest?from=${base}&to=${symbols}`,
          { next: { revalidate: 300 } },
        );
        if (!res.ok) throw new Error(`Frankfurter responded ${res.status}`);
        return (await res.json()) as FxRates;
      },
      { ttlSeconds: 300 },
    );

    return { rates: data, cached };
  } catch (err) {
    return {
      rates: { base, date: today(), rates: {} },
      cached: false,
      error: err instanceof Error ? err.message : "Frankfurter fetch failed",
    };
  }
}

export async function convertFx(
  amount: number,
  from: string,
  to: string,
): Promise<{ result: number | null; cached: boolean; error?: string }> {
  try {
    const { data, cached } = await fetchWithCache(
      `markets:fx:convert:${amount}:${from}:${to}`,
      async () => {
        const res = await fetch(
          `${FRANKFURTER_BASE}/latest?amount=${amount}&from=${from}&to=${to}`,
        );
        if (!res.ok) throw new Error(`Frankfurter responded ${res.status}`);
        return (await res.json()) as FxRates;
      },
      { ttlSeconds: 300 },
    );

    return { result: data.rates[to] ?? null, cached };
  } catch (err) {
    return {
      result: null,
      cached: false,
      error: err instanceof Error ? err.message : "Conversion failed",
    };
  }
}
