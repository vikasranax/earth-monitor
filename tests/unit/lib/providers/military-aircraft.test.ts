import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("@/lib/fetch-with-cache", () => ({
  fetchWithCache: async (_key: string, fetcher: () => Promise<unknown>) => ({
    data: await fetcher(),
    cached: false,
  }),
}));

import { fetchMilitaryAircraft } from "@/lib/providers/military-aircraft";

describe("fetchMilitaryAircraft", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("parses valid aircraft entries", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ ac: [{ hex: "abc123", flight: "RCH123", r: "12-3456", t: "C17", lat: 28.6, lon: 77.2, alt_baro: 35000, gs: 450 }] }),
    }) as unknown as typeof fetch;

    const result = await fetchMilitaryAircraft();
    expect(result.aircraft).toHaveLength(1);
    expect(result.aircraft[0]?.callsign).toBe("RCH123");
    expect(result.aircraft[0]?.altitude).toBe(35000);
  });

  it("skips entries missing coordinates", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ ac: [{ hex: "abc123", flight: "TEST" }] }),
    }) as unknown as typeof fetch;

    const result = await fetchMilitaryAircraft();
    expect(result.aircraft).toHaveLength(0);
  });

  it("returns a clear error on non-JSON response", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, text: async () => "<html>not json</html>" }) as unknown as typeof fetch;
    const result = await fetchMilitaryAircraft();
    expect(result.error).toContain("non-JSON");
  });
});
