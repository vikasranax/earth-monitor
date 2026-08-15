import { fetchWithCache } from "@/lib/fetch-with-cache";

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
const RAW_QID_PATTERN = /^Q\d+$/;

interface SparqlBinding {
  country: { value: string };
  countryLabel: { value: string };
  iso: { value: string };
  role: { value: string };
  person: { value: string };
  personLabel: { value: string };
  start?: { value: string };
}

interface SparqlResponse {
  results: { bindings: SparqlBinding[] };
}

// Queries Wikidata directly for every sovereign state (P31 = instance of
// "sovereign state", Q3624078) along with its ISO 3166-1 alpha-2 code
// (P297) and current head of state (P35) / head of government (P6).
// No hand-maintained country list needed — Wikidata is the source of truth.
function buildQuery(): string {
  return `
    SELECT ?country ?countryLabel ?iso ?role ?person ?personLabel ?start WHERE {
      ?country wdt:P31 wd:Q3624078 .
      ?country wdt:P297 ?iso .
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

export function parseBindings(bindings: SparqlBinding[]): LeaderEntry[] {
  const entries: LeaderEntry[] = [];
  for (const b of bindings) {
    const code = b.iso?.value?.toUpperCase();
    if (!code || code.length !== 2) continue; // skip malformed/non-alpha2 entries

    const rawLabel = b.personLabel.value;
    const personName = RAW_QID_PATTERN.test(rawLabel) ? "Name unavailable" : rawLabel;

    entries.push({
      countryCode: code,
      countryName: b.countryLabel?.value ?? code,
      role: b.role.value as LeaderEntry["role"],
      personName,
      since: b.start?.value ? b.start.value.slice(0, 10) : null,
    });
  }
  return entries;
}

async function queryWikidata(): Promise<LeaderEntry[]> {
  const query = buildQuery();
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
      () => queryWikidata(),
      { ttlSeconds: 21600 }, // 6 hours
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
