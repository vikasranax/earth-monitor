import { describe, it, expect, vi, beforeEach } from "vitest";
import { geocode, reverseGeocode } from "@/lib/providers/nominatim";

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

describe("nominatim provider", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockRate.mockClear();
    mockRate.mockResolvedValue({ success: true, remaining: 0, limit: 1 });
  });

  it("returns live results for forward geocode", async () => {
    mockFetch.mockResolvedValue({
      data: [
        {
          place_id: 123,
          lat: "51.5074",
          lon: "-0.1278",
          display_name: "London, Greater London, England, UK",
          type: "city",
          address: { country: "United Kingdom", country_code: "gb", city: "London" },
        },
      ],
      cached: false,
    });

    const result = await geocode("London");
    expect(result.error).toBeUndefined();
    expect(result.results[0]?.display_name).toContain("London");
  });

  it("returns error when API throws", async () => {
    mockFetch.mockRejectedValue(new Error("timeout"));
    const result = await geocode("Unknown");
    expect(result.error).toBe("timeout");
  });

  it("reverseGeocode returns parsed result", async () => {
    mockFetch.mockResolvedValue({
      data: {
        place_id: 456,
        lat: "48.8566",
        lon: "2.3522",
        display_name: "Paris, France",
        address: { country: "France", country_code: "fr", city: "Paris" },
      },
      cached: false,
    });

    const result = await reverseGeocode(48.8566, 2.3522);
    expect(result).not.toBeNull();
    expect(result?.address?.country).toBe("France");
  });

  it("reverseGeocode returns null on error", async () => {
    mockFetch.mockRejectedValue(new Error("fail"));
    const result = await reverseGeocode(0, 0);
    expect(result).toBeNull();
  });
});
