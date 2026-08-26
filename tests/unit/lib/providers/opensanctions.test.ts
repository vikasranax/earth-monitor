import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchSanctions } from "@/lib/providers/opensanctions";

vi.mock("@/lib/fetch-with-cache", () => ({
  fetchWithCache: vi.fn(),
}));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(),
}));
vi.mock("@/lib/env", () => ({
  env: { OPENSANCTIONS_API_KEY: undefined },
}));

import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";

const mockFetch = vi.mocked(fetchWithCache);
const mockRate = vi.mocked(checkRateLimit);

describe("opensanctions provider", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockRate.mockClear();
    mockRate.mockResolvedValue({ success: true, remaining: 9, limit: 10 });
  });

  it("returns empty array for short queries", async () => {
    const result = await searchSanctions("ab");
    expect(result.error).toBe("Query must be at least 3 characters");
    expect(result.entities.length).toBe(0);
  });

  it("parses valid sanctions data correctly", async () => {
    mockFetch.mockResolvedValue({
      data: {
        responses: {
          q1: {
            results: [
              {
                id: "Q123",
                schema: "Person",
                properties: { name: ["Test Person"], country: ["US"] },
                datasets: ["ofac"],
              },
            ],
          },
        },
      },
      cached: false,
    });

    const result = await searchSanctions("test");
    expect(result.error).toBeUndefined();
    expect(result.total).toBe(1);
    expect(result.entities[0]?.name).toBe("Test Person");
    expect(result.entities[0]?.type).toBe("Person");
  });
});
