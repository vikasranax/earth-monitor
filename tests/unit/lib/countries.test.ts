import { describe, it, expect } from "vitest";
import { countries, getCountryByCode } from "@/lib/countries";

describe("countries dataset", () => {
  it("has no duplicate country codes", () => {
    const codes = countries.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("finds a country by code", () => {
    const india = getCountryByCode("IN");
    expect(india?.name).toBe("India");
  });

  it("returns undefined for unknown code", () => {
    expect(getCountryByCode("XX")).toBeUndefined();
  });
});
