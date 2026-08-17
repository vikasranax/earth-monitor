import { describe, it, expect } from "vitest";
import { clockCities, formatCityTime, formatCityDate } from "@/lib/world-clock";

describe("world-clock", () => {
  it("has India first in the list", () => {
    expect(clockCities[0]?.label).toBe("New Delhi");
  });

  it("every city has a valid IANA timezone", () => {
    const testDate = new Date("2026-08-16T12:00:00Z");
    for (const c of clockCities) {
      expect(() => formatCityTime(c.timezone, testDate)).not.toThrow();
    }
  });

  it("formats time as HH:MM", () => {
    const time = formatCityTime("Asia/Kolkata", new Date("2026-08-16T12:00:00Z"));
    expect(time).toMatch(/^\d{2}:\d{2}$/);
  });

  it("formats date as DD Mon", () => {
    const date = formatCityDate("Asia/Kolkata", new Date("2026-08-16T12:00:00Z"));
    expect(date).toMatch(/^\d{2} \w{3}$/);
  });
});
