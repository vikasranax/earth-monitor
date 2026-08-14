import { describe, it, expect } from "vitest";
import { parseBindings } from "@/lib/providers/power-structure";

describe("parseBindings", () => {
  it("parses a valid SPARQL binding into a LeaderEntry", () => {
    const result = parseBindings([
      {
        country: { value: "http://www.wikidata.org/entity/Q30" },
        role: { value: "head_of_state" },
        person: { value: "http://www.wikidata.org/entity/Q123" },
        personLabel: { value: "Test Person" },
        start: { value: "2021-01-20T00:00:00Z" },
      },
    ]);

    expect(result).toHaveLength(1);
    const entry = result[0];
    if (!entry) throw new Error("expected an entry");
    expect(entry.countryCode).toBe("US");
    expect(entry.personName).toBe("Test Person");
    expect(entry.since).toBe("2021-01-20");
  });

  it("skips bindings for QIDs not in the registry", () => {
    const result = parseBindings([
      {
        country: { value: "http://www.wikidata.org/entity/Q99999999" },
        role: { value: "head_of_state" },
        person: { value: "http://www.wikidata.org/entity/Q1" },
        personLabel: { value: "Unknown" },
      },
    ]);
    expect(result).toHaveLength(0);
  });

  it("replaces a raw QID label with 'Name unavailable'", () => {
    const result = parseBindings([
      {
        country: { value: "http://www.wikidata.org/entity/Q30" },
        role: { value: "head_of_state" },
        person: { value: "http://www.wikidata.org/entity/Q22686" },
        personLabel: { value: "Q22686" },
      },
    ]);
    expect(result[0]?.personName).toBe("Name unavailable");
  });
});
