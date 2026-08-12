import { describe, it, expect } from "vitest";
import { modules } from "@/lib/modules";

describe("modules manifest", () => {
  it("has no duplicate module IDs", () => {
    const ids = modules.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("reflects current online status", () => {
    const onlineIds = modules.filter((m) => m.status === "online").map((m) => m.id);

    expect(onlineIds).toEqual([
      "M01",
      "M02",
      "M03",
      "M04",
      "M05",
      "M05a",
      "M06",
      "M07",
      "M08",
      "M09",
      "M09a",
      "M09b",
      "M10",
      "M10a",
      "M12",
    ]);
  });

  it("has expected standby modules", () => {
    const standbyIds = modules.filter((m) => m.status === "standby").map((m) => m.id);

    expect(standbyIds).toEqual(["M11", "M13", "M14", "M15", "M16", "M17"]);
  });
});
