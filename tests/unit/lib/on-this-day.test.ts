import { describe, it, expect } from "vitest";
import { getEventsForDate, onThisDayEvents } from "@/lib/on-this-day";

describe("on-this-day", () => {
  it("finds India's independence on August 15", () => {
    const events = getEventsForDate(new Date(2026, 7, 15)); // month is 0-indexed
    expect(events.some((e) => e.event.includes("India gains independence"))).toBe(true);
  });

  it("returns an empty array for a date with no entries", () => {
    const events = getEventsForDate(new Date(2026, 2, 3)); // March 3 — not in the set
    expect(events).toEqual([]);
  });

  it("every entry has a valid month (1-12) and day (1-31)", () => {
    for (const e of onThisDayEvents) {
      expect(e.month).toBeGreaterThanOrEqual(1);
      expect(e.month).toBeLessThanOrEqual(12);
      expect(e.day).toBeGreaterThanOrEqual(1);
      expect(e.day).toBeLessThanOrEqual(31);
    }
  });
});
