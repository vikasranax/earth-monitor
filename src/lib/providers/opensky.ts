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

// OpenSky OAuth2 (client credentials). Basic Auth (OPENSKY_USER/PASS) was
// deprecated for accounts created after March 2025 — do not reintroduce it.
const TOKEN_URL =
  "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token";

interface TokenCache {
  token: string;
  expiresAt: number;
}

// Module-level in-memory cache. On Vercel this persists for the lifetime of
// one warm lambda — good enough; a cold start just re-fetches a token.
let tokenCache: TokenCache | null = null;

async function getAccessToken(): Promise<string | null> {
  const { OPENSKY_CLIENT_ID, OPENSKY_CLIENT_SECRET } = serverEnv;
  if (!OPENSKY_CLIENT_ID || !OPENSKY_CLIENT_SECRET) return null;

  // Reuse the cached token if it still has >15s of life left.
  if (tokenCache && tokenCache.expiresAt > Date.now() + 15_000) {
    return tokenCache.token;
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: OPENSKY_CLIENT_ID,
      client_secret: OPENSKY_CLIENT_SECRET,
    }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`OpenSky token endpoint responded ${res.status}`);

  const json = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!json.access_token) throw new Error("OpenSky token endpoint returned no access_token");

  tokenCache = {
    token: json.access_token,
    // Refresh 15s before real expiry; OpenSky tokens are typically ~300s.
    expiresAt: Date.now() + (json.expires_in ?? 300) * 1000 - 15_000,
  };
  return tokenCache.token;
}

function isWithinBox(lat: number, lon: number, box: [[number, number], [number, number]]): boolean {
  const [[lat1, lon1], [lat2, lon2]] = box;
  const minLat = Math.min(lat1, lat2);
  const maxLat = Math.max(lat1, lat2);
  const minLon = Math.min(lon1, lon2);
  const maxLon = Math.max(lon1, lon2);
  return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
}

export async function fetchAirspaceSnapshot(): Promise<AirspaceFetchResult> {
  // Graceful two-tier auth: try OAuth2 token; if creds are absent or the
  // token call fails, fall back to the anonymous tier (more rate-limited).
  // `authenticated` honestly reports which tier served the data.
  let accessToken: string | null = null;
  try {
    accessToken = await getAccessToken();
  } catch {
    accessToken = null;
  }
  const authenticated = accessToken !== null;

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

        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
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
