import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchFxSnapshot, convertFx } from "@/lib/providers/frankfurter";

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

describe("frankfurter provider", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockRate.mockClear();
    mockRate.mockResolvedValue({ success: true, remaining: 9, limit: 10 });
  });

  it("returns live rates when API responds", async () => {
    mockFetch.mockResolvedValue({
      data: { base: "USD", date: "2026-08-24", rates: { EUR: 0.92, INR: 83.4 } },
      cached: false,
    });

    const result = await fetchFxSnapshot("USD");
    expect(result.error).toBeUndefined();
    expect(result.rates.rates.INR).toBe(83.4);
  });

  it("returns error when API throws", async () => {
    mockFetch.mockRejectedValue(new Error("timeout"));
    const result = await fetchFxSnapshot("USD");
    expect(result.error).toBe("timeout");
  });

  it("convertFx returns converted amount", async () => {
    mockFetch.mockResolvedValue({
      data: { base: "USD", date: "2026-08-24", rates: { INR: 83.4 } },
      cached: false,
    });

    const result = await convertFx(100, "USD", "INR");
    expect(result.result).toBe(83.4);
  });

  it("convertFx returns null on error", async () => {
    mockFetch.mockRejectedValue(new Error("fail"));
    const result = await convertFx(100, "USD", "XXX");
    expect(result.result).toBeNull();
    expect(result.error).toBe("fail");
  });
});
