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
  politicalStability: number | null;
  controlOfCorruption: number | null;
  ruleOfLaw: number | null;
  voiceAndAccountability: number | null;
  cached: boolean;
  error?: string;
}

const WB_BASE = "https://api.worldbank.org/v2/country";

async function fetchWbIndicator(countryCode: string, indicatorId: string): Promise<{ value: number | null; cached: boolean }> {
  try {
    const { data, cached } = await fetchWithCache(
      "wb:" + countryCode.toLowerCase() + ":" + indicatorId,
      async () => {
        const res = await fetch(WB_BASE + "/" + countryCode + "/indicator/" + indicatorId + "?format=json&date=2022:2024");
        if (!res.ok) throw new Error("WB API " + res.status);
        return (await res.json()) as unknown;
      },
      { ttlSeconds: 86400 },
    );

    const dataArray = Array.isArray(data) ? (data[1] as Array<Record<string, unknown>> | null) : null;
    if (!dataArray || dataArray.length === 0) return { value: null, cached };

    for (const entry of dataArray) {
      const value = entry.value as number | null;
      const date = entry.date as string | undefined;
      if (value !== null && value !== undefined && date) {
        return { value, cached };
      }
    }
    return { value: null, cached };
  } catch {
    return { value: null, cached: false };
  }
}

export async function fetchCountryGovernanceProfile(countryCode: string): Promise<CountryGovernanceProfile> {
  const rateOk = await checkRateLimit("worldbank", 10, 60);
  if (!rateOk.success) {
    return { countryCode, countryName: "Unknown", politicalStability: null, controlOfCorruption: null, ruleOfLaw: null, voiceAndAccountability: null, cached: false, error: "Rate limit exceeded" };
  }

  try {
    const { data: nameData } = await fetchWithCache(
      "wb:country-name:" + countryCode.toLowerCase(),
      async () => {
        const res = await fetch(WB_BASE + "/" + countryCode + "?format=json");
        if (!res.ok) throw new Error("WB Name API " + res.status);
        return (await res.json()) as unknown;
      },
      { ttlSeconds: 86400 },
    );

    const nameArray = Array.isArray(nameData) ? (nameData[1] as Array<Record<string, unknown>> | null) : null;
    const countryName = (nameArray?.[0]?.name as string) || countryCode;

    const [pv, cc, rl, va] = await Promise.all([
      fetchWbIndicator(countryCode, "PV.EST"),
      fetchWbIndicator(countryCode, "CC.EST"),
      fetchWbIndicator(countryCode, "RL.EST"),
      fetchWbIndicator(countryCode, "VA.EST"),
    ]);

    // Honest cache reporting: only true if every indicator was actually
    // served from cache, not hardcoded regardless of what really happened.
    const allCached = pv.cached && cc.cached && rl.cached && va.cached;

    return {
      countryCode,
      countryName,
      politicalStability: pv.value,
      controlOfCorruption: cc.value,
      ruleOfLaw: rl.value,
      voiceAndAccountability: va.value,
      cached: allCached,
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
