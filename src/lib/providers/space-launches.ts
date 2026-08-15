import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";

export interface LaunchEvent {
  id: string;
  name: string;
  provider: string;
  rocket: string;
  padName: string;
  locationName: string;
  net: string; // "No Earlier Than" launch time, ISO string
  status: string;
  missionDescription: string | null;
}

export interface SpaceLaunchesResult {
  launches: LaunchEvent[];
  cached: boolean;
  error?: string;
}

const PROVIDER_ID = "space-launches";
const LL2_ENDPOINT = "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=15&mode=list";

interface LL2Response {
  results: Array<{
    id: string;
    name: string;
    net: string;
    status?: { name?: string };
    launch_service_provider?: { name?: string };
    rocket?: { configuration?: { name?: string } };
    pad?: { name?: string; location?: { name?: string } };
    mission?: { description?: string } | null;
  }>;
}

export async function fetchUpcomingLaunches(): Promise<SpaceLaunchesResult> {
  const rate = await checkRateLimit(PROVIDER_ID, 10, 3600); // conservative — anon LL2 tier is ~15/hr
  if (!rate.success) {
    return { launches: [], cached: false, error: "Rate limit reached — try again later." };
  }

  try {
    const { data, cached } = await fetchWithCache(
      "space:ll2:upcoming",
      async () => {
        const res = await fetch(LL2_ENDPOINT, {
          headers: { "User-Agent": "EarthMonitor/1.0 (open-source project)" },
        });
        if (!res.ok) throw new Error(`Launch Library API responded ${res.status}`);
        const json = (await res.json()) as LL2Response;

        return json.results.map((r): LaunchEvent => ({
          id: r.id,
          name: r.name,
          provider: r.launch_service_provider?.name ?? "Unknown",
          rocket: r.rocket?.configuration?.name ?? "Unknown",
          padName: r.pad?.name ?? "Unknown",
          locationName: r.pad?.location?.name ?? "Unknown",
          net: r.net,
          status: r.status?.name ?? "Unknown",
          missionDescription: r.mission?.description ?? null,
        }));
      },
      { ttlSeconds: 1800 }, // 30 min — respects the tight anonymous rate limit
    );

    return { launches: data, cached };
  } catch (err) {
    return {
      launches: [],
      cached: false,
      error: err instanceof Error ? err.message : "Unknown error fetching launch data",
    };
  }
}
