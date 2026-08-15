import { describe, it, expect } from "vitest";
import { pressFreedomIndex, getPressFreedomByCode } from "@/lib/press-freedom-index";

describe("pressFreedomIndex", () => {
  it("has unique country codes", () => {
    const codes = pressFreedomIndex.map((e) => e.countryCode);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("every entry has a source year", () => {
    for (const e of pressFreedomIndex) {
      expect(e.sourceYear).toBeGreaterThan(2000);
    }
  });

  it("finds an entry by code", () => {
    expect(getPressFreedomByCode("NO")?.countryName).toBe("Norway");
  });
});
