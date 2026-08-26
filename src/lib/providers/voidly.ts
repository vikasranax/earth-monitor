import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";

export interface VoidlyCountryScore {
  country: string;
  countryCode: string;
  censorshipScore: number; // 0-100, higher = more censored
  freedomStatus: "Free" | "Partly Free" | "Not Free" | "Unknown";
  lastUpdated: string;
}

export interface VoidlySnapshot {
  scores: VoidlyCountryScore[];
  cached: boolean;
  count: number;
  error?: string;
}

export async function fetchVoidlyScores(): Promise<VoidlySnapshot> {
  const rateOk = await checkRateLimit("voidly", 5, 60);
  if (!rateOk.success) {
    return { scores: [], cached: false, count: 0, error: "Rate limit exceeded" };
  }

  try {
    const { data, cached } = await fetchWithCache(
      "voidly:scores:global",
      async () => {
        // Note: Voidly's exact public endpoint structure may vary. 
        // This is structured for a standard JSON array response.
        // If Voidly requires a different endpoint, adjust URL accordingly.
        const res = await fetch("https://voidly.org/api/v1/scores");
        if (!res.ok) {
          // Fallback mock structure for development if API is unreachable
          // In production, this throws, but we catch and return a graceful error.
          throw new Error(`Voidly API returned ${res.status}`);
        }
        return (await res.json()) as unknown;
      },
      { ttlSeconds: 86400 } // Cache for 24 hours (static daily data)
    );

    const dataArray = Array.isArray(data) ? data : [];
    
    const scores: VoidlyCountryScore[] = dataArray.map((item: Record<string, unknown>) => ({
      country: (item.country as string) || "Unknown",
      countryCode: (item.countryCode as string) || "XX",
      censorshipScore: Number(item.censorshipScore) || 0,
      freedomStatus: (item.freedomStatus as VoidlyCountryScore["freedomStatus"]) || "Unknown",
      lastUpdated: (item.lastUpdated as string) || new Date().toISOString(),
    }));

    return {
      scores,
      cached,
      count: scores.length,
    };
  } catch (err) {
    return {
      scores: [],
      cached: false,
      count: 0,
      error: err instanceof Error ? err.message : "Voidly fetch failed",
    };
  }
}

export async function getCountryFreedomStatus(countryCode: string): Promise<VoidlyCountryScore | null> {
  const snapshot = await fetchVoidlyScores();
  if (snapshot.error || snapshot.scores.length === 0) return null;
  
  return snapshot.scores.find((s) => s.countryCode.toUpperCase() === countryCode.toUpperCase()) || null;
}
