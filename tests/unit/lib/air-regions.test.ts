import { describe, it, expect } from "vitest";
import { airRegions } from "@/lib/air-regions";

describe("air-regions dataset", () => {
  it("has unique ids", () => {
    const ids = airRegions.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
