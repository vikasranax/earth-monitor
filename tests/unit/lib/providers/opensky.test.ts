import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchAirspaceSnapshot } from "@/lib/providers/opensky";

describe("fetchAirspaceSnapshot", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("parses states and buckets aircraft into the correct region", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        states: [
          [
            "abc123",
            "TEST1",
            "Testland",
            null,
            null,
            120.0,
            24.0,
            10000,
            false,
            250,
            90,
            0,
            null,
            10000,
            null,
            false,
            0,
          ],
        ],
      }),
    }) as unknown as typeof fetch;

    const result = await fetchAirspaceSnapshot();
    expect(result.totalAircraft).toBe(1);
    expect(result.error).toBeUndefined();
    const taiwan = result.regionCounts.find((r) => r.regionId === "taiwan-strait");
    expect(taiwan?.count).toBe(1);
  });
});
