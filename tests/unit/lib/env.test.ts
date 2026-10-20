import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = process.env;

const MANAGED_KEYS = [
  "SITE_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
  "INGEST_HMAC_KEY",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "FIREBASE_SERVICE_ACCOUNT",
  "GUARDIAN_API_KEY",
  "TWELVEDATA_API_KEY",
  "FRED_API_KEY",
  "EIA_API_KEY",
  "NASA_API_KEY",
  "NASA_FIRMS_MAP_KEY",
  "OPENSANCTIONS_API_KEY",
  "OPENSKY_CLIENT_ID",
  "OPENSKY_CLIENT_SECRET",
  "OPENAQ_KEY",
  "CLOUDFLARE_RADAR_TOKEN",
  "GEMINI_API_KEY",
  "GROQ_API_KEY",
  "OPENROUTER_API_KEY",
  "RESEND_API_KEY",
  "ACLED_EMAIL",
  "ACLED_PASSWORD",
  "WINDY_WEBCAMS_API_KEY",
  "LOCATIONIQ_API_KEY",
  "NEXT_PUBLIC_AISSTREAM_API_KEY",
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
];

beforeEach(() => {
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV };
  for (const k of MANAGED_KEYS) delete process.env[k];
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

/** Import a fresh copy of env.ts with the given variables set. */
async function load(vars: Record<string, string> = {}) {
  vi.resetModules();
  Object.assign(process.env, vars);
  return import("@/lib/env");
}

describe("serverEnv", () => {
  it("boots with zero configuration and defaults SITE_URL to localhost", async () => {
    const { serverEnv } = await load();
    expect(serverEnv.SITE_URL).toBe("http://localhost:3000");
  });

  it("uses the Vercel production domain when SITE_URL is unset", async () => {
    const { serverEnv } = await load({ VERCEL_PROJECT_PRODUCTION_URL: "jagatmanthan.vercel.app" });
    expect(serverEnv.SITE_URL).toBe("https://jagatmanthan.vercel.app");
  });

  it("lets an explicit SITE_URL win over the Vercel domain", async () => {
    const { serverEnv } = await load({
      SITE_URL: "https://example.org",
      VERCEL_PROJECT_PRODUCTION_URL: "jagatmanthan.vercel.app",
    });
    expect(serverEnv.SITE_URL).toBe("https://example.org");
  });

  it("treats a blank SITE_URL as unset", async () => {
    const { serverEnv } = await load({ SITE_URL: "" });
    expect(serverEnv.SITE_URL).toBe("http://localhost:3000");
  });

  it("fails boot with an actionable message on a malformed SITE_URL", async () => {
    await expect(load({ SITE_URL: "not-a-url" })).rejects.toThrow(/env contract violation/);
  });
});

describe("readiness()", () => {
  it("does not report SITE_URL as armed on localhost", async () => {
    const { readiness } = await load();
    const core = readiness().groups.find((g) => g.id === "core");
    expect(core?.items[0]?.key).toBe("SITE_URL");
    expect(core?.items[0]?.armed).toBe(false);
  });

  it("reports SITE_URL as armed on a real domain", async () => {
    const { readiness } = await load({ SITE_URL: "https://jagatmanthan.vercel.app" });
    const core = readiness().groups.find((g) => g.id === "core");
    expect(core?.items[0]?.armed).toBe(true);
  });

  it("totalCount counts only wired keys and armedCount never exceeds it", async () => {
    const { readiness } = await load();
    const r = readiness();
    const wired = r.groups.flatMap((g) => g.items).filter((i) => i.wired !== false);
    expect(r.totalCount).toBe(wired.length);
    expect(r.armedCount).toBeLessThanOrEqual(r.totalCount);
  });

  it("ignores keys that no code consumes yet", async () => {
    const base = (await load()).readiness();
    const withUnwired = (
      await load({
        FRED_API_KEY: "x",
        EIA_API_KEY: "x",
        GEMINI_API_KEY: "x",
        RESEND_API_KEY: "x",
        OPENAQ_KEY: "x",
        CLOUDFLARE_RADAR_TOKEN: "x",
      })
    ).readiness();
    expect(withUnwired.armedCount).toBe(base.armedCount);
    expect(withUnwired.totalCount).toBe(base.totalCount);
  });

  it("counts a wired key once it is set", async () => {
    const base = (await load()).readiness();
    const armed = (await load({ TWELVEDATA_API_KEY: "x" })).readiness();
    expect(armed.armedCount).toBe(base.armedCount + 1);
  });

  it("requires both OpenSky credentials to arm Airspace", async () => {
    const base = (await load()).readiness();
    const idOnly = (await load({ OPENSKY_CLIENT_ID: "id" })).readiness();
    expect(idOnly.armedCount).toBe(base.armedCount);
    const both = (await load({ OPENSKY_CLIENT_ID: "id", OPENSKY_CLIENT_SECRET: "secret" })).readiness();
    expect(both.armedCount).toBe(base.armedCount + 1);
  });
});
