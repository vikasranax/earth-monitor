import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { OnThisDay } from "@/components/terminal/OnThisDay";

afterEach(cleanup);

describe("OnThisDay", () => {
  it("shows the day's events and the day-first title", () => {
    render(<OnThisDay date={new Date(2026, 7, 15)} />);
    expect(screen.getByText("On This Day — 15 August")).toBeTruthy();
    expect(screen.getByText("India gains independence from British rule.")).toBeTruthy();
  });

  it("falls back to upcoming events when the day is empty", () => {
    render(<OnThisDay date={new Date(2026, 0, 2)} />); // 2 January: no entry
    expect(screen.getByText("On This Day — 2 January")).toBeTruthy();
    expect(screen.getByText("No entry for 2 January in our curated set.")).toBeTruthy();
    expect(screen.getByText("Coming up")).toBeTruthy();
    expect(screen.getByText("Burma (Myanmar) gains independence from Britain.")).toBeTruthy();
  });
});
