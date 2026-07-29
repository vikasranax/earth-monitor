import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LedBadge } from "@/components/terminal/LedBadge";

describe("LedBadge", () => {
  it("renders the label", () => {
    render(<LedBadge status="ok" label="Online" />);
    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  it("applies pulse animation class when pulse is true", () => {
    render(<LedBadge status="ok" label="Online" pulse />);
    const dot = screen.getByTestId("led-dot");
    expect(dot).toHaveClass("animate-pulse");
  });
});
