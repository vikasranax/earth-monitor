import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchCryptoSnapshot } from "@/lib/providers/coingecko";

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

describe("coingecko provider", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockRate.mockClear();
    mockRate.mockResolvedValue({ success: true, remaining: 9, limit: 10 });
  });

  it("returns live data when API responds", async () => {
    mockFetch.mockResolvedValue({
      data: [
        {
          id: "bitcoin",
          symbol: "btc",
          name: "Bitcoin",
          current_price: 64200,
          market_cap: 1270000000000,
          total_volume: 28000000000,
          price_change_percentage_24h: 2.4,
          image: "https://example.com/btc.png",
        },
      ],
      cached: false,
    });

    const result = await fetchCryptoSnapshot();
    expect(result.error).toBeUndefined();
    expect(result.count).toBe(1);
    expect(result.coins[0]?.symbol).toBe("btc");
  });

  it("returns error when rate limited", async () => {
    mockRate.mockResolvedValue({ success: false, remaining: 0, limit: 10 });
    const result = await fetchCryptoSnapshot();
    expect(result.error).toBe("Rate limit exceeded");
    expect(result.count).toBe(0);
  });

  it("returns error when fetch throws", async () => {
    mockFetch.mockRejectedValue(new Error("network"));
    const result = await fetchCryptoSnapshot();
    expect(result.error).toBe("network");
    expect(result.count).toBe(0);
  });
});
