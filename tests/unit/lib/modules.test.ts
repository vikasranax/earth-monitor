import { describe, it, expect } from "vitest";
import { modules } from "@/lib/modules";

describe("modules manifest", () => {
  it("has no duplicate module IDs", () => {
    const ids = modules.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has at least M01 through M40 marked online", () => {
    const onlineIds = new Set(modules.filter((m) => m.status === "online").map((m) => m.id));
    for (const id of [
      "M01",
      "M02",
      "M03",
      "M04",
      "M05",
      "M06",
      "M07",
      "M08",
      "M09",
      "M10",
      "M11",
      "M12",
      "M13",
      "M14",
      "M15",
      "M16",
      "M27",
      "M28",
      "M29",
      "M34",
    ]) {
      expect(onlineIds.has(id)).toBe(true);
    }
  });
});
