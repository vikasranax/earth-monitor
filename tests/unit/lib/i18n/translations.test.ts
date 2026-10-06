import { describe, it, expect } from "vitest";
import { translations } from "@/lib/i18n/translations";
import { locales } from "@/lib/i18n/locales";

describe("translations", () => {
  it("has an entry for every declared locale", () => {
    for (const l of locales) {
      expect(translations[l.code]).toBeDefined();
    }
  });

  it("every locale has the same set of keys as English", () => {
    const enKeys = Object.keys(translations.en!).sort();
    for (const l of locales) {
      const keys = Object.keys(translations[l.code]!).sort();
      expect(keys).toEqual(enKeys);
    }
  });

  it("Arabic is flagged as RTL, others are not", () => {
    const ar = locales.find((l) => l.code === "ar");
    const en = locales.find((l) => l.code === "en");
    expect(ar?.rtl).toBe(true);
    expect(en?.rtl).toBe(false);
  });
});
