import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";

export interface MilitaryAircraft {
  id: string;
  callsign: string;
  registration: string;
  aircraftType: string;
  lat: number;
  lng: number;
  altitude: number | null;
  speed: number | null;
}

export interface MilitaryAirspaceResult {
  aircraft: MilitaryAircraft[];
  cached: boolean;
  fetchedAt: string;
  error?: string;
}

const PROVIDER_ID = "adsb-lol-mil";
const ENDPOINT = "https://api.adsb.lol/v2/mil";

interface RawAircraft {
  hex?: string;
  flight?: string;
  r?: string;
  t?: string;
  lat?: number;
  lon?: number;
  alt_baro?: number | string;
  gs?: number;
}

interface RawResponse {
  ac?: RawAircraft[];
}

export async function fetchMilitaryAircraft(): Promise<MilitaryAirspaceResult> {
  const rate = await checkRateLimit(PROVIDER_ID, 10, 60);
  if (!rate.success) {
    return {
      aircraft: [],
      cached: false,
      fetchedAt: new Date().toISOString(),
      error: "Rate limit reached",
    };
  }

  try {
    const { data, cached } = await fetchWithCache(
      "airspace:military:adsb:v1",
      async () => {
        const res = await fetch(ENDPOINT, {
          headers: { "User-Agent": "EarthMonitor/1.0" },
        });
        if (!res.ok) throw new Error("adsb.lol " + res.status);

        const json = (await res.json()) as RawResponse;
        const list = json.ac ?? [];

        return list
          .filter((a) => typeof a.lat === "number" && typeof a.lon === "number" && a.hex)
          .map((a) => ({
            id: a.hex!,
            callsign: (a.flight ?? "").trim() || "Unknown",
            registration: a.r ?? "—",
            aircraftType: a.t ?? "Unknown",
            lat: a.lat!,
            lng: a.lon!,
            altitude:
              typeof a.alt_baro === "number" ? a.alt_baro : a.alt_baro === "ground" ? 0 : null,
            speed: typeof a.gs === "number" ? a.gs : null,
          }));
      },
      { ttlSeconds: 60 },
    );

    return { aircraft: data, cached, fetchedAt: new Date().toISOString() };
  } catch (err) {
    return {
      aircraft: [],
      cached: false,
      fetchedAt: new Date().toISOString(),
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
