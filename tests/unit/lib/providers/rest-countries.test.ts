import { describe, it, expect, vi, beforeEach } from "vitest";
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

describe("rest-countries provider", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockRate.mockClear();
    mockRate.mockResolvedValue({ success: true, remaining: 4, limit: 5 });
  });

  it("returns all countries when API responds with array", async () => {
    mockFetch.mockResolvedValue({
      data: [
        { name: "Japan", iso2: "JP", iso3: "JPN", lat: 36.0, long: 138.0 },
      ],
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

  it("fetchCountryByCode returns country from REST Countries", async () => {
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
  });

  it("fetchCountryByCode returns null on error", async () => {
    mockFetch.mockRejectedValue(new Error("404"));
    const country = await fetchCountryByCode("XX");
    expect(country).toBeNull();
  });
});
