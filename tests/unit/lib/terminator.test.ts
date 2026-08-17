import { describe, it, expect } from "vitest";
import { computeTerminatorPolygon } from "@/lib/terminator";

describe("computeTerminatorPolygon", () => {
  it("returns a closed polygon with valid lat/lng ranges", () => {
    const points = computeTerminatorPolygon(new Date("2026-06-21T12:00:00Z"));
    expect(points.length).toBeGreaterThan(300);
    for (const [lat, lng] of points) {
      expect(lat).toBeGreaterThanOrEqual(-90);
      expect(lat).toBeLessThanOrEqual(90);
      expect(lng).toBeGreaterThanOrEqual(-360);
      expect(lng).toBeLessThanOrEqual(360);
    }
  });

  it("produces different polygons for different times of day", () => {
    const noon = computeTerminatorPolygon(new Date("2026-06-21T12:00:00Z"));
    const midnight = computeTerminatorPolygon(new Date("2026-06-21T00:00:00Z"));
    expect(noon).not.toEqual(midnight);
  });
});
