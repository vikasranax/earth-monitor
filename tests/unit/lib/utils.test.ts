import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn()", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("last conflicting tailwind class wins", () => {
    expect(cn("p-2 text-muted", "p-4")).toBe("text-muted p-4");
  });

  it("handles conditionals and objects", () => {
    expect(cn("base", false && "off", undefined, { on: true })).toBe("base on");
  });
});