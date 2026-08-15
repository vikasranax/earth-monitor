import { fetchWithCache } from "@/lib/fetch-with-cache";

export interface CountryLocation {
  code: string;
  name: string;
  lat: number;
  lng: number;
}

const WIKIDATA_ENDPOINT = "https://query.wikidata.org/sparql";

interface SparqlBinding {
  countryLabel: { value: string };
  iso: { value: string };
  coord: { value: string };
}
interface SparqlResponse {
  results: { bindings: SparqlBinding[] };
}

function buildQuery(): string {
  return `
    SELECT ?countryLabel ?iso ?coord WHERE {
      ?country wdt:P31 wd:Q3624078 .
      ?country wdt:P297 ?iso .
      ?country wdt:P625 ?coord .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
  `;
}

function parsePoint(wkt: string): { lat: number; lng: number } | null {
  const match = wkt.match(/Point\(([-\d.]+)\s+([-\d.]+)\)/);
  if (!match) return null;
  const lngStr = match[1];
  const latStr = match[2];
  if (!lngStr || !latStr) return null;
  return { lng: parseFloat(lngStr), lat: parseFloat(latStr) };
}

export async function fetchAllCountryLocations(): Promise<CountryLocation[]> {
  const { data } = await fetchWithCache(
    "countries:wikidata:locations",
    async () => {
      const res = await fetch(WIKIDATA_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/sparql-results+json",
          "User-Agent": "EarthMonitor/1.0 (open-source project)",
        },
        body: new URLSearchParams({ query: buildQuery() }),
      });
      if (!res.ok) throw new Error(`Wikidata locations query failed: ${res.status}`);
      const json = (await res.json()) as SparqlResponse;

      const seen = new Set<string>();
      const out: CountryLocation[] = [];
      for (const b of json.results.bindings) {
        const code = b.iso?.value?.toUpperCase();
        if (!code || code.length !== 2 || seen.has(code)) continue;
        const point = parsePoint(b.coord.value);
        if (!point) continue;
        seen.add(code);
        out.push({ code, name: b.countryLabel.value, lat: point.lat, lng: point.lng });
      }
      return out;
    },
    { ttlSeconds: 86400 }, // 24h — country coordinates essentially never change
  );
  return data;
}
