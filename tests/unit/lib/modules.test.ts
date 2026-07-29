import { describe, it, expect } from "vitest";
import { modules } from "@/lib/modules";

describe("modules manifest", () => {
  it("has no duplicate module IDs", () => {
    const ids = modules.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes M01 through M04 as online", () => {
    const onlineIds = modules.filter((m) => m.status === "online").map((m) => m.id);
    expect(onlineIds).toEqual(["M01", "M02", "M03", "M04"]);
  });
});
