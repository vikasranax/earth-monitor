import { fetchWithCache } from "@/lib/fetch-with-cache";

export interface HazardEvent {
  id: string;
  place: string;
  magnitude: number;
  time: string;
  lat: number;
  lon: number;
}

export interface HazardSummaryResult {
  events: HazardEvent[];
  cached: boolean;
  error?: string;
}

interface UsgsFeature {
  id: string;
  properties: { place: string; mag: number; time: number };
  geometry: { coordinates: [number, number, number] };
}
interface UsgsResponse {
  features: UsgsFeature[];
}

export async function fetchHazardSummary(): Promise<HazardSummaryResult> {
  try {
    const { data, cached } = await fetchWithCache(
      "hazard:usgs:day-4.5",
      async () => {
        const res = await fetch(
          "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson",
        );
        if (!res.ok) throw new Error(`USGS responded ${res.status}`);
        const json = (await res.json()) as UsgsResponse;
        return json.features
          .map((f): HazardEvent => ({
            id: f.id,
            place: f.properties.place,
            magnitude: f.properties.mag,
            time: new Date(f.properties.time).toISOString(),
            lon: f.geometry.coordinates[0],
            lat: f.geometry.coordinates[1],
          }))
          .sort((a, b) => b.magnitude - a.magnitude)
          .slice(0, 8);
      },
      { ttlSeconds: 900 },
    );
    return { events: data, cached };
  } catch (err) {
    return {
      events: [],
      cached: false,
      error: err instanceof Error ? err.message : "Unknown error fetching hazard data",
    };
  }
}
