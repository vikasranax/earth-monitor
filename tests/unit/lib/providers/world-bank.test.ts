import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchCountryGovernanceProfile } from "@/lib/providers/world-bank";

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

describe("world-bank provider", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockRate.mockClear();
    mockRate.mockResolvedValue({ success: true, remaining: 9, limit: 10 });
  });

  it("handles missing data gracefully", async () => {
    mockFetch.mockResolvedValue({ data: [[], []], cached: false });
    const profile = await fetchCountryGovernanceProfile("XX");
    expect(profile.countryCode).toBe("XX");
    expect(profile.politicalStability).toBeNull();
  });

  it("parses valid governance indicators", async () => {
    mockFetch.mockImplementation(async (key: string) => {
      if (key.includes("country-name")) {
        return { data: [[], [{ name: "Test Country" }]], cached: false };
      }
      // Mock indicator data: [metadata, [{value: 0.5, date: "2023"}]]
      return { data: [[], [{ value: 0.5, date: "2023" }]], cached: false };
    });

    const profile = await fetchCountryGovernanceProfile("IN");
    expect(profile.countryName).toBe("Test Country");
    expect(profile.politicalStability).toBe(0.5);
    expect(profile.controlOfCorruption).toBe(0.5);
  });
});
