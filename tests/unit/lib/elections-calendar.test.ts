import { describe, it, expect } from "vitest";
import { electionsCalendar, getUpcomingElections } from "@/lib/elections-calendar";

describe("electionsCalendar", () => {
  it("every entry has a valid ISO date", () => {
    for (const e of electionsCalendar) {
      expect(Number.isNaN(new Date(e.expectedDate).getTime())).toBe(false);
    }
  });

  it("getUpcomingElections excludes past dates and sorts ascending", () => {
    const future = new Date("2026-01-01");
    const upcoming = getUpcomingElections(future);
    for (let i = 1; i < upcoming.length; i++) {
      expect(new Date(upcoming[i]!.expectedDate).getTime()).toBeGreaterThanOrEqual(
        new Date(upcoming[i - 1]!.expectedDate).getTime(),
      );
    }
  });
});
