import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("@/lib/fetch-with-cache", () => ({
  fetchWithCache: async (_key: string, fetcher: () => Promise<unknown>) => ({
    data: await fetcher(),
    cached: false,
  }),
}));

import { fetchLiveUnrest } from "@/lib/providers/unrest-live";

describe("fetchLiveUnrest", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("matches article titles against known cities", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        articles: [
          { title: "Protest breaks out in New Delhi over policy", url: "https://example.com/1" },
          { title: "Second report on New Delhi unrest", url: "https://example.com/2" },
        ],
      }),
    }) as unknown as typeof fetch;

    const result = await fetchLiveUnrest();
    expect(result.markers.length).toBeGreaterThan(0);
    const delhi = result.markers.find((m) => m.locationName.includes("New Delhi"));
    expect(delhi?.count).toBe(2);
  });

  it("returns no markers when no city names match", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ articles: [{ title: "A generic headline with no city", url: "https://example.com/1" }] }),
    }) as unknown as typeof fetch;

    const result = await fetchLiveUnrest();
    expect(result.markers).toHaveLength(0);
  });

  it("returns an error on non-ok response", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 }) as unknown as typeof fetch;
    const result = await fetchLiveUnrest();
    expect(result.error).toBeDefined();
  });
});
