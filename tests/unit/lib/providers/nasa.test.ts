import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchNasaSnapshot } from "@/lib/providers/nasa";

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

describe("nasa provider", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockRate.mockClear();
    mockRate.mockResolvedValue({ success: true, remaining: 9, limit: 10 });
  });

  it("returns both APOD and NEO when both endpoints respond", async () => {
    mockFetch
      .mockResolvedValueOnce({
        data: {
          date: "2026-08-24",
          explanation: "A beautiful nebula",
          url: "https://example.com/image.jpg",
          title: "Nebula",
          media_type: "image",
        },
        cached: false,
      })
      .mockResolvedValueOnce({
        data: {
          near_earth_objects: {
            "2026-08-24": [
              {
                id: "1",
                name: "Asteroid A",
                is_potentially_hazardous_asteroid: true,
                close_approach_data: [
                  {
                    close_approach_date: "2026-08-24",
                    miss_distance: { kilometers: "1000000", lunar: "3" },
                  },
                ],
              },
            ],
          },
        },
        cached: false,
      });

    const result = await fetchNasaSnapshot();
    expect(result.error).toBeUndefined();
    expect(result.apod?.title).toBe("Nebula");
    expect(result.neo.hazardous).toBe(1);
  });

  it("returns partial data when one endpoint fails", async () => {
    mockFetch
      .mockResolvedValueOnce({
        data: {
          date: "2026-08-24",
          explanation: "Stars",
          url: "",
          title: "Stars",
          media_type: "image",
        },
        cached: false,
      })
      .mockRejectedValueOnce(new Error("NEO timeout"));

    const result = await fetchNasaSnapshot();
    expect(result.apod).not.toBeNull();
    expect(result.neo.count).toBe(0);
  });

  it("returns error when rate limited", async () => {
    mockRate.mockResolvedValue({ success: false, remaining: 0, limit: 10 });
    const result = await fetchNasaSnapshot();
    expect(result.error).toBe("Rate limit exceeded");
  });
});
