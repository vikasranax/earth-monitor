import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";
import { serverEnv } from "@/lib/env";
import { airRegions } from "@/lib/air-regions";

export interface AircraftState {
  icao24: string;
  callsign: string;
  originCountry: string;
  lon: number;
  lat: number;
  altitude: number | null;
  velocity: number | null;
  onGround: boolean;
}

export interface AirspaceFetchResult {
  authenticated: boolean;
  totalAircraft: number;
  regionCounts: { regionId: string; count: number }[];
  cached: boolean;
  error?: string;
}

const PROVIDER_ID = "opensky";

function isWithinBox(lat: number, lon: number, box: [[number, number], [number, number]]): boolean {
  const [[lat1, lon1], [lat2, lon2]] = box;
  const minLat = Math.min(lat1, lat2);
  const maxLat = Math.max(lat1, lat2);
  const minLon = Math.min(lon1, lon2);
  const maxLon = Math.max(lon1, lon2);
  return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
}

export async function fetchAirspaceSnapshot(): Promise<AirspaceFetchResult> {
  const authenticated = Boolean(serverEnv.OPENSKY_USER && serverEnv.OPENSKY_PASS);

  const rate = await checkRateLimit(PROVIDER_ID, authenticated ? 20 : 4, 60);
  if (!rate.success) {
    return {
      authenticated,
      totalAircraft: 0,
      regionCounts: [],
      cached: false,
      error: "Rate limit reached — try again shortly.",
    };
  }

  try {
    const { data, cached } = await fetchWithCache(
      "airspace:opensky:global",
      async () => {
        const headers: HeadersInit = {};
        if (authenticated) {
          const basic = Buffer.from(`${serverEnv.OPENSKY_USER}:${serverEnv.OPENSKY_PASS}`).toString(
            "base64",
          );
          headers.Authorization = `Basic ${basic}`;
        }
        const res = await fetch("https://opensky-network.org/api/states/all", { headers });
        if (!res.ok) throw new Error(`OpenSky API responded ${res.status}`);
        const json = (await res.json()) as { states: Array<Array<unknown>> | null };
        const rawStates = json.states ?? [];

        return rawStates
          .map((s): AircraftState => ({
            icao24: String(s[0] ?? ""),
            callsign: String(s[1] ?? "").trim(),
            originCountry: String(s[2] ?? ""),
            lon: Number(s[5]),
            lat: Number(s[6]),
            altitude: s[7] !== null ? Number(s[7]) : null,
            velocity: s[9] !== null ? Number(s[9]) : null,
            onGround: Boolean(s[8]),
          }))
          .filter((a) => !Number.isNaN(a.lat) && !Number.isNaN(a.lon));
      },
      { ttlSeconds: 60 },
    );

    const regionCounts = airRegions.map((r) => ({
      regionId: r.id,
      count: data.filter((a) => isWithinBox(a.lat, a.lon, r.boundingBox)).length,
    }));

    return { authenticated, totalAircraft: data.length, regionCounts, cached };
  } catch (err) {
    return {
      authenticated,
      totalAircraft: 0,
      regionCounts: [],
      cached: false,
      error: err instanceof Error ? err.message : "Unknown error fetching airspace data",
    };
  }
}
