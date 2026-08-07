import { fetchWithCache } from "@/lib/fetch-with-cache";

export interface EarthquakeEvent {
  id: string;
  place: string;
  magnitude: number;
  time: string;
  lat: number;
  lng: number;
  depth: number;
  url: string;
  alert: "green" | "yellow" | "orange" | "red" | null;
}

export interface UsgsFetchResult {
  events: EarthquakeEvent[];
  cached: boolean;
  error?: string;
  count: number;
}

const USGS_API =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson";
const USGS_API_WEEK =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

export async function fetchEarthquakes(period: "day" | "week" = "day"): Promise<UsgsFetchResult> {
  const url = period === "day" ? USGS_API : USGS_API_WEEK;
  try {
    const { data, cached } = await fetchWithCache(
      `hazard:usgs:${period}`,
      async () => {
        const res = await fetch(url, { next: { revalidate: 60 } });
        if (!res.ok) throw new Error(`USGS responded ${res.status}`);
        const json = (await res.json()) as {
          features: Array<{
            id: string;
            properties: {
              place: string;
              mag: number;
              time: number;
              url: string;
              alert: string | null;
            };
            geometry: { coordinates: [number, number, number] };
          }>;
        };
        return json.features.map((f): EarthquakeEvent => ({
          id: f.id,
          place: f.properties.place,
          magnitude: f.properties.mag,
          time: new Date(f.properties.time).toISOString(),
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
          depth: f.geometry.coordinates[2],
          url: f.properties.url,
          alert: (f.properties.alert as EarthquakeEvent["alert"]) || null,
        }));
      },
      { ttlSeconds: 120 },
    );
    return { events: data, cached, count: data.length };
  } catch (err) {
    return {
      events: [],
      cached: false,
      count: 0,
      error: err instanceof Error ? err.message : "USGS fetch failed",
    };
  }
}
