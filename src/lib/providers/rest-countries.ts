import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";

export interface CountryDossier {
  name: { common: string; official: string };
  cca2: string;
  cca3: string;
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area?: number;
  flags: { png?: string; svg?: string };
  latlng: [number, number];
  borders?: string[];
  landlocked?: boolean;
  independent?: boolean;
  unMember?: boolean;
  currencies?: Record<string, { name: string; symbol?: string }>;
  languages?: Record<string, string>;
  timezones?: string[];
}

export interface CountryDossierSnapshot {
  countries: CountryDossier[];
  cached: boolean;
  count: number;
  error?: string;
}

const COUNTRIESNOW_BASE = "https://countriesnow.space/api/v0.1/countries";
const RESTCOUNTRIES_BASE = "https://restcountries.com/v3.1";

export async function fetchAllCountryDossiers(): Promise<CountryDossierSnapshot> {
  const rateOk = await checkRateLimit("countriesnow", 5, 60);
  if (!rateOk.success) {
    return { countries: [], cached: false, count: 0, error: "Rate limit exceeded" };
  }

  try {
    const { data, cached } = await fetchWithCache(
      "countries:dossier:all:cn",
      async () => {
        const res = await fetch(`${COUNTRIESNOW_BASE}/positions`);
        if (!res.ok) throw new Error(`CountriesNow ${res.status}`);
        const json = (await res.json()) as {
          error: boolean;
          msg: string;
          data: Array<{ name: string; iso2: string; iso3: string; lat: number; long: number }>;
        };
        if (json.error) throw new Error(json.msg);
        return json.data;
      },
      { ttlSeconds: 3600 },
    );

    if (!Array.isArray(data)) {
      return { countries: [], cached, count: 0, error: "Unexpected response format" };
    }

    const countries: CountryDossier[] = data.map((c) => ({
      name: { common: c.name, official: c.name },
      cca2: c.iso2,
      cca3: c.iso3,
      region: "Unknown",
      population: 0,
      flags: {},
      latlng: [c.lat, c.long],
    }));

    return { countries, cached, count: countries.length };
  } catch (err) {
    return {
      countries: [],
      cached: false,
      count: 0,
      error: err instanceof Error ? err.message : "CountriesNow fetch failed",
    };
  }
}

export async function fetchCountryByCode(code: string): Promise<CountryDossier | null> {
  const upperCode = code.toUpperCase();

  // ── Attempt 1: REST Countries ──────────────────────────
  try {
    const { data } = await fetchWithCache(
      `countries:rest:v2:${upperCode}`,
      async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        try {
          const res = await fetch(`${RESTCOUNTRIES_BASE}/alpha/${upperCode}`, {
            signal: controller.signal,
          });
          if (!res.ok) {
            throw new Error(`REST Countries ${res.status}`);
          }
          return (await res.json()) as unknown;
        } finally {
          clearTimeout(timeout);
        }
      },
      { ttlSeconds: 3600 },
    );

    const raw = Array.isArray(data) ? data[0] : data;
    if (raw && typeof raw === "object") {
      const c = raw as Record<string, unknown>;
      const name = c.name;
      if (name && typeof name === "object" && "common" in name && typeof c.cca2 === "string") {
        return c as unknown as CountryDossier;
      }
    }
    console.warn(`[fetchCountryByCode] REST Countries returned invalid data for ${upperCode}`);
  } catch (err) {
    console.warn(
      `[fetchCountryByCode] REST Countries failed for ${upperCode}:`,
      err instanceof Error ? err.message : err,
    );
  }

  // ── Attempt 2: CountriesNow fallback ───────────────────
  return fetchCountryByCodeFromCountriesNow(upperCode);
}

async function fetchCountryByCodeFromCountriesNow(code: string): Promise<CountryDossier | null> {
  try {
    // Step 1: Resolve name, iso3, lat/lng from positions list
    let name = code;
    let iso3 = code;
    let lat = 0;
    let lng = 0;

    try {
      const res = await fetch(`${COUNTRIESNOW_BASE}/positions`);
      if (res.ok) {
        const json = (await res.json()) as {
          error: boolean;
          data: Array<{ name: string; iso2: string; iso3: string; lat: number; long: number }>;
        };
        if (!json.error && Array.isArray(json.data)) {
          const match = json.data.find((c) => c.iso2 === code);
          if (match) {
            name = match.name;
            iso3 = match.iso3;
            lat = match.lat;
            lng = match.long;
          }
        }
      }
    } catch {
      // Positions lookup failed, continue with defaults
    }

    // Step 2: Try flag / capital / population with multiple identifiers
    const identifiers: Record<string, string>[] = [{ iso2: code }];
    if (iso3 !== code) identifiers.push({ iso3 });
    if (name !== code) identifiers.push({ country: name });

    let flag = "";
    let capital = "";
    let population = 0;

    for (const id of identifiers) {
      if (flag) break;
      try {
        const res = await fetch(`${COUNTRIESNOW_BASE}/flag/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(id),
        });
        if (res.ok) {
          const json = (await res.json()) as { error: boolean; data?: { flag?: string } };
          if (!json.error && json.data?.flag) {
            flag = json.data.flag;
            break;
          }
        }
      } catch {
        // try next identifier
      }
    }

    for (const id of identifiers) {
      if (capital) break;
      try {
        const res = await fetch(`${COUNTRIESNOW_BASE}/capital`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(id),
        });
        if (res.ok) {
          const json = (await res.json()) as { error: boolean; data?: { capital?: string } };
          if (!json.error && json.data?.capital) {
            capital = json.data.capital;
            break;
          }
        }
      } catch {
        // try next identifier
      }
    }

    for (const id of identifiers) {
      if (population) break;
      try {
        const res = await fetch(`${COUNTRIESNOW_BASE}/population`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(id),
        });
        if (res.ok) {
          const json = (await res.json()) as {
            error: boolean;
            data?: { populationCounts?: Array<{ year: number; value: number }> };
          };
          if (!json.error && json.data?.populationCounts?.length) {
            const counts = json.data.populationCounts;
            const latest = counts[counts.length - 1];
            if (latest) population = latest.value;
            break;
          }
        }
      } catch {
        // try next identifier
      }
    }

    // As long as we resolved the country name from positions, return a dossier
    if (name !== code || flag || capital || population) {
      return {
        name: { common: name, official: name },
        cca2: code,
        cca3: iso3,
        capital: capital ? [capital] : undefined,
        region: "Unknown",
        population,
        flags: flag ? { png: flag } : {},
        latlng: [lat, lng],
      } as unknown as CountryDossier;
    }

    return null;
  } catch {
    return null;
  }
}
