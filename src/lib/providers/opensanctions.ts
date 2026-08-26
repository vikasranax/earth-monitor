import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";

export interface SanctionEntity {
  id: string;
  name: string;
  type: "Person" | "Organization" | "Company" | "Vessel" | "Aircraft" | "Unknown";
  countries: string[];
  programs: string[];
  remarks?: string;
  datasets: string[];
}

export interface SanctionSearchResult {
  entities: SanctionEntity[];
  total: number;
  cached: boolean;
  error?: string;
}

export async function searchSanctions(query: string): Promise<SanctionSearchResult> {
  const rateOk = await checkRateLimit("opensanctions", 10, 60);
  if (!rateOk.success) {
    return { entities: [], total: 0, cached: false, error: "Rate limit exceeded" };
  }

  if (!query || query.trim().length < 3) {
    return { entities: [], total: 0, cached: false, error: "Query must be at least 3 characters" };
  }

  try {
    const { data, cached } = await fetchWithCache(
      `sanctions:search:${query.toLowerCase()}`,
      async () => {
        const apiKey = process.env.OPENSANCTIONS_API_KEY;
        
        if (apiKey) {
          const res = await fetch("https://api.opensanctions.org/search/entities", {
            method: "POST",
            headers: {
              "Authorization": `ApiKey ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              queries: {
                q1: {
                  schema: "Thing",
                  properties: {
                    name: [query],
                  },
                },
              },
            }),
          });

          if (!res.ok) {
            throw new Error(`OpenSanctions API returned ${res.status}`);
          }

          return (await res.json()) as unknown;
        } else {
          const res = await fetch(
            `https://www.opensanctions.org/search?q=${encodeURIComponent(query)}`,
            {
              headers: {
                "Accept": "application/json",
              },
            }
          );

          if (res.status === 401 || res.status === 403) {
            return getSampleSanctionsData(query);
          }

          if (!res.ok) {
            throw new Error(`OpenSanctions API returned ${res.status}`);
          }

          return (await res.json()) as unknown;
        }
      },
      { ttlSeconds: 1800 }
    );

    const entities = parseSanctionsResponse(data, query);
    
    return {
      entities,
      total: entities.length,
      cached,
    };
  } catch (err) {
    console.warn("OpenSanctions API failed, using sample data:", err);
    const sampleData = getSampleSanctionsData(query);
    return {
      entities: sampleData.entities,
      total: sampleData.length,
      cached: false,
      error: "API unavailable - showing sample data",
    };
  }
}

function parseSanctionsResponse(data: unknown, _query: string): SanctionEntity[] {
  const responseData = data as Record<string, unknown>;
  
  let results: Array<Record<string, unknown>> = [];
  
  if (Array.isArray(responseData.results)) {
    results = responseData.results as Array<Record<string, unknown>>;
  } else if (responseData.responses && typeof responseData.responses === "object") {
    const responses = responseData.responses as Record<string, unknown>;
    const q1 = responses.q1 as Record<string, unknown> | undefined;
    if (q1?.results && Array.isArray(q1.results)) {
      results = q1.results as Array<Record<string, unknown>>;
    }
  } else if (Array.isArray(data)) {
    results = data as Array<Record<string, unknown>>;
  }

  return results.map((r) => {
    const props = (r.properties as Record<string, unknown> | undefined) || {};
    const nameArr = (props.name as string[] | undefined) || [];
    const countryArr = (props.country as string[] | undefined) || [];
    const programArr = (props.program as string[] | undefined) || [];
    const remarksArr = (props.remarks as string[] | undefined) || [];

    return {
      id: (r.id as string) || `entity-${Math.random().toString(36).substr(2, 9)}`,
      name: nameArr[0] || (r.name as string) || "Unknown",
      type: (r.schema as SanctionEntity["type"]) || "Organization",
      countries: countryArr,
      programs: programArr,
      remarks: remarksArr[0],
      datasets: (r.datasets as string[]) || [],
    };
  });
}

function getSampleSanctionsData(query: string): { entities: SanctionEntity[]; length: number } {
  const samples: SanctionEntity[] = [];
  
  if (query.toLowerCase().includes("russia") || query.toLowerCase().includes("putin")) {
    samples.push(
      {
        id: "sample-1",
        name: "Vladimir Putin",
        type: "Person",
        countries: ["RU"],
        programs: ["EU Sanctions", "UK Sanctions", "US OFAC"],
        remarks: "President of Russia",
        datasets: ["eu", "uk", "us"],
      },
      {
        id: "sample-2",
        name: "Rosneft",
        type: "Company",
        countries: ["RU"],
        programs: ["EU Sanctions", "US OFAC"],
        remarks: "State-owned energy company",
        datasets: ["eu", "us"],
      },
      {
        id: "sample-3",
        name: "Gazprom",
        type: "Company",
        countries: ["RU"],
        programs: ["EU Sanctions"],
        remarks: "State-owned energy corporation",
        datasets: ["eu"],
      }
    );
  } else if (query.toLowerCase().includes("iran")) {
    samples.push(
      {
        id: "sample-4",
        name: "Islamic Revolutionary Guard Corps",
        type: "Organization",
        countries: ["IR"],
        programs: ["US OFAC", "EU Sanctions"],
        remarks: "Designated terrorist organization",
        datasets: ["us", "eu"],
      },
      {
        id: "sample-5",
        name: "Central Bank of Iran",
        type: "Organization",
        countries: ["IR"],
        programs: ["US OFAC", "UN Sanctions"],
        remarks: "Financial institution",
        datasets: ["us", "un"],
      }
    );
  } else if (query.toLowerCase().includes("north korea")) {
    samples.push(
      {
        id: "sample-6",
        name: "Korea Mining Development Trading Corp",
        type: "Company",
        countries: ["KP"],
        programs: ["UN Sanctions", "US OFAC", "EU Sanctions"],
        remarks: "Primary arms dealer",
        datasets: ["un", "us", "eu"],
      }
    );
  } else {
    samples.push({
      id: "sample-generic",
      name: `Sample Entity for "${query}"`,
      type: "Organization",
      countries: ["XX"],
      programs: ["Sample Program"],
      remarks: "This is sample data - API requires authentication",
      datasets: ["sample"],
    });
  }
  
  return { entities: samples, length: samples.length };
}
