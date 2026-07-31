import { describe, it, expect } from "vitest";
import { fetchGuardianNews } from "@/lib/providers/guardian";

describe("fetchGuardianNews", () => {
  it("returns armed:false when GUARDIAN_API_KEY is not set", async () => {
    const result = await fetchGuardianNews();
    expect(result.armed).toBe(false);
    expect(result.articles).toEqual([]);
  });
});
