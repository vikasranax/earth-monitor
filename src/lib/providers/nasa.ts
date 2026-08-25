import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";

export interface ApodData {
  date: string;
  explanation: string;
  url: string;
  title: string;
  media_type: string;
  copyright?: string;
}

export interface NeoObject {
  id: string;
  name: string;
  is_potentially_hazardous_asteroid: boolean;
  estimated_diameter?: {
    kilometers?: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  close_approach_data?: Array<{
    close_approach_date: string;
    miss_distance: { kilometers: string; lunar: string };
  }>;
}

export interface NeoData {
  count: number;
  hazardous: number;
  objects: NeoObject[];
}

export interface NasaSnapshot {
  apod: ApodData | null;
  neo: NeoData;
  cached: boolean;
  error?: string;
}

const DEFAULT_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

function getToday(): string {
  const [date] = new Date().toISOString().split("T");
  return date ?? "";
}

export async function fetchNasaSnapshot(apiKey?: string): Promise<NasaSnapshot> {
  const rateOk = await checkRateLimit("nasa", 10, 60);
  if (!rateOk.success) {
    return {
      apod: null,
      neo: { count: 0, hazardous: 0, objects: [] },
      cached: false,
      error: "Rate limit exceeded",
    };
  }

  const key = apiKey ?? DEFAULT_API_KEY;
  const today = getToday();
  const apodUrl = `https://api.nasa.gov/planetary/apod?api_key=${key}&date=${today}`;
  const neoUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${key}`;

  let apod: ApodData | null = null;
  let neo: NeoData = { count: 0, hazardous: 0, objects: [] };
  let cached = false;

  // Fetch APOD
  try {
    const { data, cached: c } = await fetchWithCache(
      `nasa:apod:${today}`,
      async () => {
        const res = await fetch(apodUrl);
        if (!res.ok) throw new Error(`APOD ${res.status}`);
        return (await res.json()) as unknown;
      },
      { ttlSeconds: 3600 },
    );
    if (data && typeof data === "object" && "title" in data) {
      apod = data as ApodData;
      cached = c;
    }
  } catch {
    /* APOD failed */
  }

  // Fetch NEO
  try {
    const { data, cached: c } = await fetchWithCache(
      `nasa:neo:${today}`,
      async () => {
        const res = await fetch(neoUrl);
        if (!res.ok) throw new Error(`NEO ${res.status}`);
        return (await res.json()) as unknown;
      },
      { ttlSeconds: 3600 },
    );
    if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;
      const neoObjects = d.near_earth_objects as
        Record<string, Array<Record<string, unknown>>> | undefined;
      if (neoObjects && typeof neoObjects === "object") {
        // Use today's key if available; otherwise fall back to first key with data
        let rawObjects: Array<Record<string, unknown>> = neoObjects[today] || [];
        if (rawObjects.length === 0) {
          for (const k of Object.keys(neoObjects)) {
            const arr = neoObjects[k];
            if (Array.isArray(arr) && arr.length > 0) {
              rawObjects = arr;
              break;
            }
          }
        }

        const objects: NeoObject[] = [];
        let count = 0;
        let hazardous = 0;
        for (const obj of rawObjects) {
          const neoObj: NeoObject = {
            id: String(obj.id || ""),
            name: String(obj.name || ""),
            is_potentially_hazardous_asteroid: obj.is_potentially_hazardous_asteroid === true,
            estimated_diameter: obj.estimated_diameter as NeoObject["estimated_diameter"],
            close_approach_data: Array.isArray(obj.close_approach_data)
              ? (obj.close_approach_data as Array<Record<string, unknown>>).map((ca) => ({
                  close_approach_date: String(ca.close_approach_date || ""),
                  miss_distance: {
                    kilometers: String(
                      (ca.miss_distance as Record<string, unknown>)?.kilometers || "",
                    ),
                    lunar: String((ca.miss_distance as Record<string, unknown>)?.lunar || ""),
                  },
                }))
              : [],
          };
          objects.push(neoObj);
          count++;
          if (neoObj.is_potentially_hazardous_asteroid) {
            hazardous++;
          }
        }
        neo = { count, hazardous, objects };
        cached = cached || c;
      }
    }
  } catch {
    /* NEO failed */
  }

  return { apod, neo, cached };
}
