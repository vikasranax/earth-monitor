import { describe, it, expect } from "vitest";
import { fetchMarketQuotes } from "@/lib/providers/twelvedata";

describe("fetchMarketQuotes", () => {
  it("returns armed:false when TWELVEDATA_API_KEY is not set", async () => {
    const result = await fetchMarketQuotes();
    expect(result.armed).toBe(false);
    expect(result.quotes).toEqual([]);
  });
});
