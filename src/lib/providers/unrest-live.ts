import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";
import { worldCities } from "@/lib/world-cities";

export interface UnrestMarker {
  id: string;
  locationName: string;
  lat: number;
  lng: number;
  count: number;
  articles: { title: string; url: string }[];
}

export interface UnrestLiveResult {
  markers: UnrestMarker[];
  cached: boolean;
  fetchedAt: string;
  error?: string;
}

const PROVIDER_ID = "gdelt-unrest-doc";
// Using the DOC 2.0 API — confirmed working reliably earlier in this
// project, unlike the GEO 2.0 endpoint which returned consistent 404s
// (confirmed directly from GDELT's own server, not a network issue on our
// end). City matching is done by scanning article titles against a
// curated city list instead of relying on GDELT's geocoding.
const GDELT_DOC_ENDPOINT = "https://api.gdeltproject.org/api/v2/doc/doc";
const QUERY = "protest OR unrest OR riot OR clashes OR uprising OR crackdown";

interface GdeltArticle {
  title?: string;
  url?: string;
  domain?: string;
  sourcecountry?: string;
}

interface GdeltResponse {
  articles?: GdeltArticle[];
}

export async function fetchLiveUnrest(): Promise<UnrestLiveResult> {
  const rate = await checkRateLimit(PROVIDER_ID, 6, 60);
  if (!rate.success) {
    return { markers: [], cached: false, fetchedAt: new Date().toISOString(), error: "Rate limit reached — try again shortly." };
  }

  try {
    const { data, cached } = await fetchWithCache(
      "unrest:gdelt:doc:cities:v1",
      async () => {
        const params = new URLSearchParams({
          query: QUERY,
          mode: "artlist",
          format: "json",
          maxrecords: "250",
          timespan: "1d",
        });
        const res = await fetch(GDELT_DOC_ENDPOINT + "?" + params.toString(), {
          headers: { "User-Agent": "EarthMonitor/1.0 (open-source project)" },
        });
        if (!res.ok) throw new Error("GDELT DOC API responded " + res.status);

        const json = (await res.json()) as GdeltResponse;
        const articles = json.articles ?? [];

        const byCity = new Map<string, UnrestMarker>();

        for (const a of articles) {
          if (!a.title || !a.url) continue;
          const titleLower = a.title.toLowerCase();

          for (const city of worldCities) {
            if (!titleLower.includes(city.name.toLowerCase())) continue;

            const key = city.name;
            const existing = byCity.get(key);
            if (existing) {
              existing.count += 1;
              if (existing.articles.length < 3) {
                existing.articles.push({ title: a.title, url: a.url });
              }
            } else {
              byCity.set(key, {
                id: city.name + "-" + city.country,
                locationName: city.name + ", " + city.country,
                lat: city.lat,
                lng: city.lng,
                count: 1,
                articles: [{ title: a.title, url: a.url }],
              });
            }
            break; // one city match per article is enough
          }
        }

        return Array.from(byCity.values()).sort((a, b) => b.count - a.count);
      },
      { ttlSeconds: 900 },
    );

    return { markers: data, cached, fetchedAt: new Date().toISOString() };
  } catch (err) {
    return {
      markers: [],
      cached: false,
      fetchedAt: new Date().toISOString(),
      error: err instanceof Error ? err.message : "Unknown error fetching GDELT data",
    };
  }
}
