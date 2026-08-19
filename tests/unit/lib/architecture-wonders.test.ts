import { describe, it, expect } from "vitest";
import { architectureSites, getSitesByCategory } from "@/lib/architecture-wonders";

describe("architectureSites", () => {
  it("has unique site names", () => {
    const names = architectureSites.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("every site has valid lat/lng ranges", () => {
    for (const s of architectureSites) {
      expect(s.lat).toBeGreaterThanOrEqual(-90);
      expect(s.lat).toBeLessThanOrEqual(90);
      expect(s.lng).toBeGreaterThanOrEqual(-180);
      expect(s.lng).toBeLessThanOrEqual(180);
    }
  });

  it("finds heritage-india sites", () => {
    const sites = getSitesByCategory("heritage-india");
    expect(sites.length).toBeGreaterThan(0);
    expect(sites.some((s) => s.name === "Sun Temple")).toBe(true);
  });
});
