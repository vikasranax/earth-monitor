import { describe, it, expect } from "vitest";
import { countryRegistry } from "@/lib/power-structure/country-registry";

describe("countryRegistry", () => {
  it("has unique country codes", () => {
    const codes = countryRegistry.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("has unique Wikidata QIDs", () => {
    const qids = countryRegistry.map((c) => c.wikidataId);
    expect(new Set(qids).size).toBe(qids.length);
  });

  it("every QID matches the expected Q-number format", () => {
    for (const c of countryRegistry) {
      expect(c.wikidataId).toMatch(/^Q\d+$/);
    }
  });
});
