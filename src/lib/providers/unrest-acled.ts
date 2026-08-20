import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";
import { serverEnv } from "@/lib/env";

export interface UnrestDetail {
  label: string;
  url?: string;
}

export interface UnrestMarker {
  id: string;
  locationName: string;
  lat: number;
  lng: number;
  count: number;
  details: UnrestDetail[];
}

export interface UnrestLiveResult {
  markers: UnrestMarker[];
  cached: boolean;
  fetchedAt: string;
  armed: boolean;
  source: "acled" | "guardian" | "none";
  error?: string;
}

const PROVIDER_ID = "acled-unrest";
const TOKEN_ENDPOINT = "https://acleddata.com/oauth/token";
const DATA_ENDPOINT = "https://acleddata.com/api/acled/read";

// Only these event types count as "civil unrest" for this layer
const UNREST_EVENT_TYPES = new Set(["Protests", "Riots"]);

interface TokenState {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

let cachedToken: TokenState | null = null;

interface AcledTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

async function requestNewToken(): Promise<TokenState | null> {
  const email = serverEnv.ACLED_EMAIL;
  const password = serverEnv.ACLED_PASSWORD;
  if (!email || !password) return null;

  try {
    const res = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username: email,
        password,
        grant_type: "password",
        client_id: "acled",
        scope: "authenticated",
      }),
    });

    if (!res.ok) return null;
    const json = (await res.json()) as AcledTokenResponse;
    return {
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
      expiresAt: Date.now() + (json.expires_in - 300) * 1000, // refresh 5 min early
    };
  } catch {
    return null;
  }
}

async function refreshToken(refresh_token: string): Promise<TokenState | null> {
  try {
    const res = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        refresh_token,
        grant_type: "refresh_token",
        client_id: "acled",
      }),
    });

    if (!res.ok) return null;
    const json = (await res.json()) as AcledTokenResponse;
    return {
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
      expiresAt: Date.now() + (json.expires_in - 300) * 1000,
    };
  } catch {
    return null;
  }
}

async function getAccessToken(): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.accessToken;
  }
  if (cachedToken) {
    const refreshed = await refreshToken(cachedToken.refreshToken);
    if (refreshed) {
      cachedToken = refreshed;
      return refreshed.accessToken;
    }
  }
  const fresh = await requestNewToken();
  if (!fresh) return null;
  cachedToken = fresh;
  return fresh.accessToken;
}

interface AcledEvent {
  event_id_cnty?: string;
  event_date?: string;
  event_type?: string;
  sub_event_type?: string;
  country?: string;
  location?: string;
  latitude?: string;
  longitude?: string;
  notes?: string;
  source?: string;
}

interface AcledReadResponse {
  data?: AcledEvent[];
  error?: string;
  message?: string;
}

export async function fetchLiveUnrestAcled(): Promise<UnrestLiveResult> {
  const token = await getAccessToken();
  if (!token) {
    return {
      markers: [],
      cached: false,
      fetchedAt: new Date().toISOString(),
      armed: false,
      source: "none",
    };
  }

  const rate = await checkRateLimit(PROVIDER_ID, 10, 60);
  if (!rate.success) {
    return {
      markers: [],
      cached: false,
      fetchedAt: new Date().toISOString(),
      armed: true,
      source: "none",
      error: "Rate limit reached — try again shortly.",
    };
  }

  try {
    const { data, cached } = await fetchWithCache(
      "unrest:acled:v2",
      async () => {
        // FIX: Added event_type to URL params so ACLED only returns Protests/Riots
        const params = new URLSearchParams({
          limit: "500",
          event_type: "Protests|Riots",
        });
        const res = await fetch(DATA_ENDPOINT + "?" + params.toString(), {
          headers: { Authorization: "Bearer " + token },
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`ACLED API responded ${res.status}: ${errText}`);
        }

        const json = (await res.json()) as AcledReadResponse;
        if (json.error || !json.data) {
          throw new Error(json.error || json.message || "No data returned from ACLED");
        }

        const events = json.data ?? [];
        const byLocation = new Map<string, UnrestMarker>();

        for (const e of events) {
          if (!e.event_type || !UNREST_EVENT_TYPES.has(e.event_type)) continue;
          if (!e.latitude || !e.longitude || !e.location) continue;

          const lat = parseFloat(e.latitude);
          const lng = parseFloat(e.longitude);
          if (Number.isNaN(lat) || Number.isNaN(lng)) continue;

          const key = e.location + "|" + e.country;
          const detailLabel =
            (e.sub_event_type ?? e.event_type) + (e.notes ? ": " + e.notes.slice(0, 100) : "");

          const existing = byLocation.get(key);
          if (existing) {
            existing.count += 1;
            if (existing.details.length < 3) {
              existing.details.push({ label: detailLabel });
            }
          } else {
            byLocation.set(key, {
              id: key,
              locationName: e.location + ", " + (e.country ?? ""),
              lat,
              lng,
              count: 1,
              details: [{ label: detailLabel }],
            });
          }
        }

        return Array.from(byLocation.values()).sort((a, b) => b.count - a.count);
      },
      { ttlSeconds: 21600 }, // 6 hours
    );

    return {
      markers: data,
      cached,
      fetchedAt: new Date().toISOString(),
      armed: true,
      source: "acled",
    };
  } catch (err) {
    return {
      markers: [],
      cached: false,
      fetchedAt: new Date().toISOString(),
      armed: true,
      source: "none",
      error: err instanceof Error ? err.message : "Unknown error fetching ACLED data",
    };
  }
}
