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

const PROVIDER_ID = "airplanes-live-mil";
// airplanes.live's military endpoint — free, no key, unfiltered (unlike
// OpenSky, which filters/anonymizes some military traffic). Uses the
// standard tar1090-family JSON shape shared across most ADS-B community
// trackers (hex/flight/r/t/lat/lon/alt_baro/gs field names).
const ENDPOINT = "https://api.airplanes.live/v2/mil";

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
      error: "Rate limit reached — try again shortly.",
    };
  }

  try {
    const { data, cached } = await fetchWithCache(
      "airspace:military:v1",
      async () => {
        const res = await fetch(ENDPOINT, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error("airplanes.live responded " + res.status);

        const rawText = await res.text();
        let json: RawResponse;
        try {
          json = JSON.parse(rawText) as RawResponse;
        } catch {
          throw new Error("airplanes.live returned a non-JSON response: " + rawText.slice(0, 150));
        }

        const list = json.ac ?? [];
        const parsed: MilitaryAircraft[] = [];

        for (const a of list) {
          if (!a.hex || typeof a.lat !== "number" || typeof a.lon !== "number") continue;
          const altRaw = a.alt_baro;
          const altitude = typeof altRaw === "number" ? altRaw : altRaw === "ground" ? 0 : null;

          parsed.push({
            id: a.hex,
            callsign: (a.flight ?? "").trim() || "Unknown",
            registration: a.r ?? "—",
            aircraftType: a.t ?? "Unknown",
            lat: a.lat,
            lng: a.lon,
            altitude,
            speed: typeof a.gs === "number" ? a.gs : null,
          });
        }

        return parsed;
      },
      { ttlSeconds: 120 },
    );

    return { aircraft: data, cached, fetchedAt: new Date().toISOString() };
  } catch (err) {
    return {
      aircraft: [],
      cached: false,
      fetchedAt: new Date().toISOString(),
      error: err instanceof Error ? err.message : "Unknown error fetching military aircraft data",
    };
  }
}
