import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchUpcomingLaunches } from "@/lib/providers/space-launches";

describe("fetchUpcomingLaunches", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("parses launch data correctly", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            id: "abc-123",
            name: "Test Mission",
            net: "2026-09-01T12:00:00Z",
            status: { name: "Go" },
            launch_service_provider: { name: "Test Provider" },
            rocket: { configuration: { name: "Test Rocket" } },
            pad: { name: "Test Pad", location: { name: "Test Site" } },
            mission: { description: "A test mission." },
          },
        ],
      }),
    }) as unknown as typeof fetch;

    const result = await fetchUpcomingLaunches();
    expect(result.launches).toHaveLength(1);
    expect(result.launches[0]?.name).toBe("Test Mission");
    expect(result.error).toBeUndefined();
  });
});
