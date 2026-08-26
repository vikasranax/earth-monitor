import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";

export interface WorldBankIndicator {
  indicatorId: string;
  indicatorName: string;
  country: string;
  countryCode: string;
  value: number | null;
  year: number;
}

export interface CountryGovernanceProfile {
  countryCode: string;
  countryName: string;
  politicalStability: number | null; // PV.EST
  controlOfCorruption: number | null; // CC.EST
  ruleOfLaw: number | null; // RL.EST
  voiceAndAccountability: number | null; // VA.EST
  cached: boolean;
  error?: string;
}

const WB_BASE = "https://api.worldbank.org/v2/country";

async function fetchWbIndicator(countryCode: string, indicatorId: string): Promise<number | null> {
  try {
    const { data } = await fetchWithCache(
      `wb:${countryCode.toLowerCase()}:${indicatorId}`,
      async () => {
        const res = await fetch(`${WB_BASE}/${countryCode}/indicator/${indicatorId}?format=json&date=2022:2024`);
        if (!res.ok) throw new Error(`WB API ${res.status}`);
        return (await res.json()) as unknown;
      },
      { ttlSeconds: 86400 } // Cache for 24 hours
    );

    // World Bank returns [metadata, dataArray]
    const dataArray = Array.isArray(data) ? (data[1] as Array<Record<string, unknown>> | null) : null;
    
    if (!dataArray || dataArray.length === 0) return null;

    // Find the most recent year with a non-null value
    for (const entry of dataArray) {
      const value = entry.value as number | null;
      const date = entry.date as string | undefined;
      if (value !== null && value !== undefined && date) {
        return value;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchCountryGovernanceProfile(countryCode: string): Promise<CountryGovernanceProfile> {
  const rateOk = await checkRateLimit("worldbank", 10, 60);
  if (!rateOk.success) {
    return { countryCode, countryName: "Unknown", politicalStability: null, controlOfCorruption: null, ruleOfLaw: null, voiceAndAccountability: null, cached: false, error: "Rate limit exceeded" };
  }

  try {
    // Fetch country name first
    const { data: nameData } = await fetchWithCache(
      `wb:country-name:${countryCode.toLowerCase()}`,
      async () => {
        const res = await fetch(`${WB_BASE}/${countryCode}?format=json`);
        if (!res.ok) throw new Error(`WB Name API ${res.status}`);
        return (await res.json()) as unknown;
      },
      { ttlSeconds: 86400 }
    );

    const nameArray = Array.isArray(nameData) ? (nameData[1] as Array<Record<string, unknown>> | null) : null;
    const countryName = (nameArray?.[0]?.name as string) || countryCode;

    // Fetch indicators in parallel
    const [pv, cc, rl, va] = await Promise.all([
      fetchWbIndicator(countryCode, "PV.EST"), // Political Stability
      fetchWbIndicator(countryCode, "CC.EST"), // Control of Corruption
      fetchWbIndicator(countryCode, "RL.EST"), // Rule of Law
      fetchWbIndicator(countryCode, "VA.EST"), // Voice and Accountability
    ]);

    return {
      countryCode,
      countryName,
      politicalStability: pv,
      controlOfCorruption: cc,
      ruleOfLaw: rl,
      voiceAndAccountability: va,
      cached: true, // Since we use fetchWithCache, assume cached or fresh-but-cached
    };
  } catch (err) {
    return {
      countryCode,
      countryName: countryCode,
      politicalStability: null,
      controlOfCorruption: null,
      ruleOfLaw: null,
      voiceAndAccountability: null,
      cached: false,
      error: err instanceof Error ? err.message : "World Bank fetch failed",
    };
  }
}
