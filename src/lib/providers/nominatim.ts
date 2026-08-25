import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";

export interface GeocodeResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  address?: {
    country?: string;
    country_code?: string;
    state?: string;
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    road?: string;
    postcode?: string;
  };
  boundingbox?: [string, string, string, string];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geojson?: any;
}

export interface GeocodeSnapshot {
  query: string;
  results: GeocodeResult[];
  cached: boolean;
  error?: string;
}

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

export async function geocode(
  query: string,
  options?: { limit?: number; polygonGeojson?: boolean; countrycodes?: string[] },
): Promise<GeocodeSnapshot> {
  const rateOk = await checkRateLimit("nominatim", 1, 1);
  if (!rateOk.success) {
    return { query, results: [], cached: false, error: "Rate limit exceeded" };
  }

  try {
    const params = new URLSearchParams({
      q: query,
      format: "json",
      limit: String(options?.limit ?? 5),
      addressdetails: "1",
      "accept-language": "en",
    });

    if (options?.polygonGeojson) {
      params.append("polygon_geojson", "1");
    }

    if (options?.countrycodes && options.countrycodes.length > 0) {
      params.append("countrycodes", options.countrycodes.join(","));
    }

    const { data, cached } = await fetchWithCache(
      `geocode:nominatim:${query}:${options?.limit ?? 5}`,
      async () => {
        const res = await fetch(`${NOMINATIM_BASE}/search?${params.toString()}`, {
          headers: {
            "User-Agent": "Earth-Monitor/1.0 (contact@jagatmanthan.vercel.app)",
          },
        });
        if (!res.ok) throw new Error(`Nominatim responded ${res.status}`);
        return (await res.json()) as unknown[];
      },
      { ttlSeconds: 3600 },
    );

    if (!Array.isArray(data)) {
      return { query, results: [], cached: false, error: "Unexpected response format" };
    }

    const results: GeocodeResult[] = data
      .filter((item): item is Record<string, unknown> => {
        const r = item as Record<string, unknown>;
        const placeId = r.place_id;
        const lat = r.lat;
        const lon = r.lon;
        const displayName = r.display_name;
        return (
          (typeof placeId === "number" || typeof placeId === "string") &&
          (typeof lat === "string" || typeof lat === "number") &&
          (typeof lon === "string" || typeof lon === "number") &&
          typeof displayName === "string"
        );
      })
      .map((r) => {
        const placeId = r.place_id as string | number;
        const lat = r.lat as string | number;
        const lon = r.lon as string | number;
        return {
          ...r,
          place_id: typeof placeId === "string" ? Number(placeId) : placeId,
          lat: String(lat),
          lon: String(lon),
        } as GeocodeResult;
      });

    return { query, results, cached };
  } catch (err) {
    return {
      query,
      results: [],
      cached: false,
      error: err instanceof Error ? err.message : "Nominatim fetch failed",
    };
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeocodeResult | null> {
  try {
    const { data } = await fetchWithCache(
      `geocode:reverse:${lat}:${lon}`,
      async () => {
        const params = new URLSearchParams({
          lat: String(lat),
          lon: String(lon),
          format: "json",
          addressdetails: "1",
        });
        const res = await fetch(`${NOMINATIM_BASE}/reverse?${params.toString()}`, {
          headers: {
            "User-Agent": "Earth-Monitor/1.0 (contact@jagatmanthan.vercel.app)",
          },
        });
        if (!res.ok) throw new Error(`Nominatim responded ${res.status}`);
        return (await res.json()) as unknown;
      },
      { ttlSeconds: 3600 },
    );

    const r = data as Record<string, unknown>;
    if (r && typeof r.display_name === "string") {
      const placeId = r.place_id;
      if (typeof placeId === "number" || typeof placeId === "string") {
        return {
          ...r,
          place_id: typeof placeId === "string" ? Number(placeId) : placeId,
          lat: r.lat !== undefined ? String(r.lat) : String(lat),
          lon: r.lon !== undefined ? String(r.lon) : String(lon),
        } as GeocodeResult;
      }
    }
    return null;
  } catch {
    return null;
  }
}
