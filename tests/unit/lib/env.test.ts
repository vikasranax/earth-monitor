import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const KEYS = [
  "SITE_URL",
  "INGEST_HMAC_KEY",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "FIREBASE_SERVICE_ACCOUNT",
  "GUARDIAN_API_KEY",
  "TWELVEDATA_API_KEY",
  "FRED_API_KEY",
  "EIA_API_KEY",
  "OPENAQ_KEY",
  "CLOUDFLARE_RADAR_TOKEN",
  "GEMINI_API_KEY",
  "GROQ_API_KEY",
  "OPENROUTER_API_KEY",
  "OPENSKY_USER",
  "OPENSKY_PASS",
  "RESEND_API_KEY",
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_AISSTREAM_API_KEY",
] as const;

describe("env contract (src/lib/env.ts)", () => {
  const original = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    for (const key of KEYS) delete process.env[key];
  });

  afterEach(() => {
    process.env = { ...original };
  });

  it("boots safely with zero provider keys (fresh-clone state)", async () => {
    const { readiness } = await import("@/lib/env");
    const r = readiness();
    expect(r.totalCount).toBeGreaterThanOrEqual(14);
    expect(r.armedCount).toBe(1); // only SITE_URL (schema default) is armed
  });

  it("marks groups armed when their keys exist", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token";
    process.env.GUARDIAN_API_KEY = "test-key";
    process.env.GEMINI_API_KEY = "gm-key";

    const { readiness } = await import("@/lib/env");
    const byId = Object.fromEntries(
      readiness().groups.map((g) => [g.id, g.items.every((i) => i.armed)]),
    );

    expect(byId.cache).toBe(true);
    expect(byId.news).toBe(true);
    expect(byId.ai).toBe(false); // GROQ still missing
    expect(byId.markets).toBe(false);
  });

  it("rejects malformed values with an actionable message", async () => {
    process.env.SITE_URL = "not-a-url";
    await expect(import("@/lib/env")).rejects.toThrow(/env contract violation/);
  });

  it("rejects a weak INGEST_HMAC_KEY", async () => {
    process.env.INGEST_HMAC_KEY = "short";
    await expect(import("@/lib/env")).rejects.toThrow(/INGEST_HMAC_KEY/);
  });
});