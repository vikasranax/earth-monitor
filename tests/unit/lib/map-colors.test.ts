import { describe, expect, it } from "vitest";
import { LAYER_COLORS } from "@/lib/map-colors";

// Either a bare theme token, or a --layer-* variable with a hex fallback.
const THEME_TOKEN = /^var\(--(accent|ok|warn|danger|info)\)$/;
const LAYER_TOKEN_WITH_FALLBACK = /^var\(--layer-[a-z]+, #[0-9a-fA-F]{6}\)$/;

describe("LAYER_COLORS", () => {
  it("never uses a raw hex colour", () => {
    for (const [key, value] of Object.entries(LAYER_COLORS)) {
      expect(value, key).toMatch(/^var\(/);
    }
  });

  it("uses only known theme tokens or --layer-* variables with a fallback", () => {
    for (const [key, value] of Object.entries(LAYER_COLORS)) {
      const ok = THEME_TOKEN.test(value) || LAYER_TOKEN_WITH_FALLBACK.test(value);
      expect(ok, `${key}: ${value}`).toBe(true);
    }
  });

  it("gives every layer its own variable name where no theme token exists", () => {
    const layerVars = Object.values(LAYER_COLORS).filter((v) => v.startsWith("var(--layer-"));
    expect(new Set(layerVars).size).toBe(layerVars.length);
  });
});
