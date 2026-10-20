import { describe, expect, it } from "vitest";
import {
  MONTH_NAMES,
  formatDateDDMonth,
  formatDayMonth,
  getEventsForDate,
  getUpcomingEvents,
  onThisDayEvents,
} from "@/lib/on-this-day";

const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

describe("onThisDayEvents dataset", () => {
  it("has valid dates and years", () => {
    for (const e of onThisDayEvents) {
      expect(e.month).toBeGreaterThanOrEqual(1);
      expect(e.month).toBeLessThanOrEqual(12);
      expect(e.day).toBeGreaterThanOrEqual(1);
      expect(e.day).toBeLessThanOrEqual(DAYS_IN_MONTH[e.month - 1] ?? 0);
      expect(e.year).toBeGreaterThanOrEqual(1700);
      expect(e.year).toBeLessThanOrEqual(new Date().getFullYear());
    }
  });

  it("has complete, clean text", () => {
    for (const e of onThisDayEvents) {
      expect(e.event.trim()).toBe(e.event);
      expect(e.event.endsWith(".")).toBe(true);
      expect(e.region.trim().length).toBeGreaterThan(0);
    }
  });

  it("contains no hedging or conspiracy wording", () => {
    for (const e of onThisDayEvents) {
      expect(e.event).not.toMatch(/\b(maybe|fake|allegedly)\b/i);
    }
  });

  it("follows the 'West Asia' naming convention", () => {
    for (const e of onThisDayEvents) {
      expect(e.event).not.toMatch(/middle east/i);
      expect(e.region).not.toMatch(/middle east/i);
    }
  });

  it("has no duplicate entries", () => {
    const keys = onThisDayEvents.map((e) => `${e.month}-${e.day}-${e.year}-${e.event}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("covers every month with at least 5 entries", () => {
    for (let m = 1; m <= 12; m++) {
      expect(onThisDayEvents.filter((e) => e.month === m).length).toBeGreaterThanOrEqual(5);
    }
  });
});

describe("getEventsForDate", () => {
  it("returns matching events oldest first", () => {
    const events = getEventsForDate(new Date(2026, 7, 15)); // 15 August
    const years = events.map((e) => e.year);
    expect(years).toContain(1947);
    expect(years).toContain(1971);
    expect(years).toContain(2021);
    expect(years).toEqual([...years].sort((a, b) => a - b));
  });

  it("returns an empty array for a date with no entries", () => {
    expect(getEventsForDate(new Date(2026, 0, 2))).toEqual([]); // 2 January
  });
});

describe("getUpcomingEvents", () => {
  it("finds the nearest upcoming event", () => {
    const [first] = getUpcomingEvents(new Date(2026, 0, 2)); // 2 January
    expect(first?.year).toBe(1948);
    expect(first?.nextDay).toBe(4);
    expect(first?.nextMonth).toBe(1);
    expect(first?.daysAhead).toBe(2);
  });

  it("never includes today's events", () => {
    const upcoming = getUpcomingEvents(new Date(2026, 7, 15));
    expect(upcoming.length).toBeGreaterThan(0);
    for (const e of upcoming) expect(e.daysAhead).toBeGreaterThanOrEqual(1);
  });

  it("wraps into the next year", () => {
    const [first] = getUpcomingEvents(new Date(2026, 11, 27)); // 27 December
    expect(first?.nextMonth).toBe(1);
    expect(first?.nextDay).toBe(1);
    expect(first?.daysAhead).toBe(5);
  });

  it("is sorted by proximity and honours limit and window", () => {
    const upcoming = getUpcomingEvents(new Date(2026, 9, 18), 5);
    expect(upcoming.length).toBeLessThanOrEqual(5);
    const ahead = upcoming.map((e) => e.daysAhead);
    expect(ahead).toEqual([...ahead].sort((a, b) => a - b));
    expect(getUpcomingEvents(new Date(2026, 9, 18), 5, 0)).toEqual([]);
  });
});

describe("formatting", () => {
  it("formats day-first", () => {
    expect(formatDayMonth(5, 3)).toBe("5 March");
    expect(formatDateDDMonth(new Date(2026, 9, 18))).toBe("18 October");
  });

  it("has twelve month names", () => {
    expect(MONTH_NAMES).toHaveLength(12);
  });
});
