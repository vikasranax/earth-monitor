import { describe, it, expect } from "vitest";
import { straits } from "@/lib/straits";

describe("straits dataset", () => {
  it("has unique ids", () => {
    const ids = straits.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every entry has a valid bounding box", () => {
    for (const s of straits) {
      expect(s.boundingBox.length).toBe(2);
      expect(s.boundingBox[0].length).toBe(2);
      expect(s.boundingBox[1].length).toBe(2);
    }
  });
});
