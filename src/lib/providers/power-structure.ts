import { fetchWithCache } from "@/lib/fetch-with-cache";
import { countryRegistry } from "@/lib/power-structure/country-registry";

export interface LeaderEntry {
  countryCode: string;
  countryName: string;
  role: "head_of_state" | "head_of_government";
  personName: string;
  since: string | null;
}

export interface PowerStructureResult {
  leaders: LeaderEntry[];
  fetchedAt: string;
  cached: boolean;
  error?: string;
}

const WIKIDATA_ENDPOINT = "https://query.wikidata.org/sparql";
const QID_TO_CODE = new Map(countryRegistry.map((c) => [c.wikidataId, c]));
const RAW_QID_PATTERN = /^Q\d+$/;

interface SparqlBinding {
  country: { value: string };
  role: { value: string };
  person: { value: string };
  personLabel: { value: string };
  start?: { value: string };
}

interface SparqlResponse {
  results: { bindings: SparqlBinding[] };
}

function buildQuery(qids: string[]): string {
  const values = qids.map((q) => `wd:${q}`).join(" ");
  return `
    SELECT ?country ?role ?person ?personLabel ?start WHERE {
      VALUES ?country { ${values} }
      {
        ?country p:P35 ?statement .
        ?statement ps:P35 ?person .
        BIND("head_of_state" AS ?role)
      } UNION {
        ?country p:P6 ?statement .
        ?statement ps:P6 ?person .
        BIND("head_of_government" AS ?role)
      }
      FILTER NOT EXISTS { ?statement pq:P582 ?end }
      OPTIONAL { ?statement pq:P580 ?start }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
  `;
}

function qidFromUrl(url: string): string {
  return url.substring(url.lastIndexOf("/") + 1);
}

export function parseBindings(bindings: SparqlBinding[]): LeaderEntry[] {
  const entries: LeaderEntry[] = [];
  for (const b of bindings) {
    const countryQid = qidFromUrl(b.country.value);
    const registryEntry = QID_TO_CODE.get(countryQid);
    if (!registryEntry) continue;

    // Occasionally Wikidata's label service misses and returns the raw
    // QID string instead of a name — don't surface that to users.
    const rawLabel = b.personLabel.value;
    const personName = RAW_QID_PATTERN.test(rawLabel) ? "Name unavailable" : rawLabel;

    entries.push({
      countryCode: registryEntry.code,
      countryName: registryEntry.name,
      role: b.role.value as LeaderEntry["role"],
      personName,
      since: b.start?.value ? b.start.value.slice(0, 10) : null,
    });
  }
  return entries;
}

async function queryWikidata(qids: string[]): Promise<LeaderEntry[]> {
  const query = buildQuery(qids);
  const res = await fetch(WIKIDATA_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/sparql-results+json",
      "User-Agent": "EarthMonitor/1.0 (https://jagatmanthan.vercel.app; open-source project)",
    },
    body: new URLSearchParams({ query }),
  });

  if (!res.ok) throw new Error(`Wikidata query failed: ${res.status}`);
  const json = (await res.json()) as SparqlResponse;
  return parseBindings(json.results.bindings);
}

export async function fetchPowerStructure(): Promise<PowerStructureResult> {
  try {
    const { data, cached } = await fetchWithCache(
      "power-structure:wikidata:all",
      async () => {
        const qids = countryRegistry.map((c) => c.wikidataId);
        const chunkSize = 40;
        const chunks: string[][] = [];
        for (let i = 0; i < qids.length; i += chunkSize) {
          chunks.push(qids.slice(i, i + chunkSize));
        }
        const results = await Promise.all(chunks.map((chunk) => queryWikidata(chunk)));
        return results.flat();
      },
      { ttlSeconds: 21600 },
    );

    return { leaders: data, fetchedAt: new Date().toISOString(), cached };
  } catch (err) {
    return {
      leaders: [],
      fetchedAt: new Date().toISOString(),
      cached: false,
      error: err instanceof Error ? err.message : "Unknown error querying Wikidata",
    };
  }
}
