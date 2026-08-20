import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/fetch-with-cache", () => ({
  fetchWithCache: async (_key: string, fetcher: () => Promise<unknown>) => ({
    data: await fetcher(),
    cached: false,
  }),
}));

import { fetchLiveUnrestGuardian } from "@/lib/providers/unrest-guardian";

describe("fetchLiveUnrestGuardian", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns armed:false when GUARDIAN_API_KEY is not set", async () => {
    const result = await fetchLiveUnrestGuardian();
    expect(result.armed).toBe(false);
    expect(result.markers).toEqual([]);
  });
});
