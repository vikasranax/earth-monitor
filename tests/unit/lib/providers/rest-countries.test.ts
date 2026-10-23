import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchAllCountryDossiers, fetchCountryByCode } from "@/lib/providers/rest-countries";

vi.mock("@/lib/fetch-with-cache", () => ({
  fetchWithCache: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(),
}));

import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";

const mockFetch = vi.mocked(fetchWithCache);
const mockRate = vi.mocked(checkRateLimit);

// The CountriesNow fallback calls the real global fetch. Stub it in every
// test so nothing ever touches the network.
const globalFetch = vi.fn();

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

/** Route the stubbed global fetch by URL suffix. Unlisted URLs return 404. */
function routeCountriesNow(routes: Record<string, unknown>) {
  globalFetch.mockImplementation((url: string) => {
    const key = Object.keys(routes).find((k) => String(url).endsWith(k));
    return Promise.resolve(key ? jsonResponse(routes[key]) : jsonResponse({}, 404));
  });
}

const FRANCE_POSITION = { name: "France", iso2: "FR", iso3: "FRA", lat: 46, long: 2 };

describe("rest-countries provider", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockRate.mockReset();
    globalFetch.mockReset();
    mockRate.mockResolvedValue({ success: true, remaining: 4, limit: 5 });
    vi.stubGlobal("fetch", globalFetch);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("fetchAllCountryDossiers", () => {
    it("returns all countries when API responds with array", async () => {
      mockFetch.mockResolvedValue({
        data: [{ name: "Japan", iso2: "JP", iso3: "JPN", lat: 36.0, long: 138.0 }],
        cached: false,
      });

      const result = await fetchAllCountryDossiers();
      expect(result.error).toBeUndefined();
      expect(result.count).toBe(1);
      expect(result.countries[0]?.cca2).toBe("JP");
      expect(result.countries[0]?.name.common).toBe("Japan");
    });

    it("returns error when response is not an array", async () => {
      mockFetch.mockResolvedValue({ data: { foo: "bar" }, cached: false });
      const result = await fetchAllCountryDossiers();
      expect(result.error).toBe("Unexpected response format");
    });

    it("returns an error without fetching when rate limited", async () => {
      mockRate.mockResolvedValue({ success: false, remaining: 0, limit: 5 });
      const result = await fetchAllCountryDossiers();
      expect(result.error).toBe("Rate limit exceeded");
      expect(result.count).toBe(0);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("returns the error message when the fetch fails", async () => {
      mockFetch.mockRejectedValue(new Error("CountriesNow 503"));
      const result = await fetchAllCountryDossiers();
      expect(result.error).toBe("CountriesNow 503");
      expect(result.countries).toEqual([]);
    });
  });

  describe("fetchCountryByCode", () => {
    it("returns country from REST Countries", async () => {
      mockFetch.mockResolvedValue({
        data: {
          name: { common: "France", official: "France" },
          cca2: "FR",
          cca3: "FRA",
          capital: ["Paris"],
          region: "Europe",
          population: 67000000,
          latlng: [46.0, 2.0],
          flags: {},
        },
        cached: false,
      });

      const country = await fetchCountryByCode("FR");
      expect(country).not.toBeNull();
      expect(country?.name.common).toBe("France");
      expect(globalFetch).not.toHaveBeenCalled();
    });

    it("accepts the array shape REST Countries actually returns", async () => {
      mockFetch.mockResolvedValue({
        data: [{ name: { common: "India", official: "Republic of India" }, cca2: "IN" }],
        cached: false,
      });
      const country = await fetchCountryByCode("in");
      expect(country?.cca2).toBe("IN");
    });

    it("returns null on error when CountriesNow has nothing either", async () => {
      mockFetch.mockRejectedValue(new Error("404"));
      globalFetch.mockRejectedValue(new Error("network down"));
      const country = await fetchCountryByCode("XX");
      expect(country).toBeNull();
    });

    it("falls back to CountriesNow when REST Countries fails", async () => {
      mockFetch.mockRejectedValue(new Error("REST Countries 500"));
      routeCountriesNow({
        "/positions": { error: false, data: [FRANCE_POSITION] },
        "/flag/images": { error: false, data: { flag: "https://flags.test/fr.png" } },
        "/capital": { error: false, data: { capital: "Paris" } },
        "/population": {
          error: false,
          data: {
            populationCounts: [
              { year: 2019, value: 66_000_000 },
              { year: 2020, value: 67_000_000 },
            ],
          },
        },
      });

      const country = await fetchCountryByCode("fr");
      expect(country?.name.common).toBe("France");
      expect(country?.cca2).toBe("FR");
      expect(country?.cca3).toBe("FRA");
      expect(country?.capital).toEqual(["Paris"]);
      expect(country?.population).toBe(67_000_000);
      expect(country?.flags.png).toBe("https://flags.test/fr.png");
      expect(country?.latlng).toEqual([46, 2]);
    });

    it("falls back when REST Countries returns data of the wrong shape", async () => {
      mockFetch.mockResolvedValue({ data: { unexpected: true }, cached: false });
      routeCountriesNow({ "/positions": { error: false, data: [FRANCE_POSITION] } });

      const country = await fetchCountryByCode("FR");
      expect(country?.name.common).toBe("France");
    });

    it("returns a partial dossier when only the name resolves", async () => {
      mockFetch.mockRejectedValue(new Error("down"));
      routeCountriesNow({ "/positions": { error: false, data: [FRANCE_POSITION] } });

      const country = await fetchCountryByCode("FR");
      expect(country?.name.common).toBe("France");
      expect(country?.capital).toBeUndefined();
      expect(country?.population).toBe(0);
      expect(country?.flags).toEqual({});
    });

    it("returns null when nothing resolves at all", async () => {
      mockFetch.mockRejectedValue(new Error("down"));
      routeCountriesNow({ "/positions": { error: false, data: [] } });

      const country = await fetchCountryByCode("XX");
      expect(country).toBeNull();
    });

    it("gives up after the fallback time budget instead of hanging", async () => {
      vi.useFakeTimers();
      mockFetch.mockRejectedValue(new Error("down"));
      // A fetch that never answers, but rejects when its signal is aborted.
      globalFetch.mockImplementation(
        (_url: string, init?: { signal?: AbortSignal }) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
          }),
      );

      const pending = fetchCountryByCode("XX");
      await vi.advanceTimersByTimeAsync(8_000);
      await expect(pending).resolves.toBeNull();
    });
  });
});
