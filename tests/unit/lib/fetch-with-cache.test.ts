import { describe, it, expect, vi } from "vitest";
import { fetchWithCache } from "@/lib/fetch-with-cache";

describe("fetchWithCache", () => {
  it("calls fetcher on cache miss and returns cached=false", async () => {
    const fetcher = vi.fn().mockResolvedValue({ hello: "world" });
    const result = await fetchWithCache("test:key:1", fetcher, { ttlSeconds: 60 });
    expect(result.cached).toBe(false);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("returns cached value on second call within TTL", async () => {
    const fetcher = vi.fn().mockResolvedValue({ count: 1 });
    await fetchWithCache("test:key:2", fetcher, { ttlSeconds: 60 });
    const second = await fetchWithCache("test:key:2", fetcher, { ttlSeconds: 60 });
    expect(second.cached).toBe(true);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
