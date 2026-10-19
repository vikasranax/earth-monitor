/**
 * SERVER-ONLY environment contract. Never import from "use client" modules —
 * the client surface lives in src/lib/env.public.ts.
 *
 * Design (AD-03/AD-08): every provider key is OPTIONAL at the schema level so
 * a fresh clone boots clean; readiness() reports which providers are armed.
 * Malformed values (e.g. a non-URL SITE_URL) fail boot with an actionable message.
 *
 * 2026-10: OPENSKY_USER/OPENSKY_PASS (Basic Auth) removed — deprecated by
 * OpenSky for accounts created after March 2025. Use OPENSKY_CLIENT_ID +
 * OPENSKY_CLIENT_SECRET (OAuth2 client credentials) instead.
 * Added: NASA_FIRMS_MAP_KEY (M21 wildfires), OPENSANCTIONS_API_KEY (M36),
 * LOCATIONIQ_API_KEY (reliable geocoding).
 *
 * 2026-10-19: SITE_URL now falls back to VERCEL_PROJECT_PRODUCTION_URL so
 * production metadata never points at localhost. readiness() now marks keys
 * that exist in the schema but are not consumed by any code as wired:false and
 * excludes them from the armed/total counts (honest reporting).
 */
import { z } from "zod";
import { publicEnv } from "@/lib/env.public";

// Treat empty-string env vars as unset, so `.optional()` fields with
// extra validators (min length, url, etc.) don't fail on `KEY=` (blank).
const emptyToUndefined = (schema: z.ZodTypeAny) =>
  z.preprocess((val) => (val === "" ? undefined : val), schema);

export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SITE_URL: z.string().url().default("http://localhost:3000"),
  INGEST_HMAC_KEY: emptyToUndefined(z.string().min(16).optional()),

  UPSTASH_REDIS_REST_URL: emptyToUndefined(z.string().url().optional()),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  FIREBASE_SERVICE_ACCOUNT: z.string().optional(),

  GUARDIAN_API_KEY: z.string().optional(),
  TWELVEDATA_API_KEY: z.string().optional(),
  FRED_API_KEY: z.string().optional(),
  EIA_API_KEY: z.string().optional(),
  NASA_API_KEY: z.string().optional(),
  NASA_FIRMS_MAP_KEY: z.string().optional(),
  OPENSANCTIONS_API_KEY: z.string().optional(),

  // OpenSky OAuth2 client credentials (NOT Basic Auth — deprecated 2025-03).
  OPENSKY_CLIENT_ID: z.string().optional(),
  OPENSKY_CLIENT_SECRET: z.string().optional(),

  OPENAQ_KEY: z.string().optional(),
  CLOUDFLARE_RADAR_TOKEN: z.string().optional(),

  GEMINI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),

  ACLED_EMAIL: z.string().optional(),
  ACLED_PASSWORD: z.string().optional(),

  WINDY_WEBCAMS_API_KEY: z.string().optional(),

  LOCATIONIQ_API_KEY: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

// SITE_URL resolution: explicit SITE_URL wins; otherwise, on Vercel, use the
// production domain Vercel injects (host only, no protocol); otherwise unset
// so the schema default (localhost) applies for local dev.
const rawEnv: NodeJS.ProcessEnv = { ...process.env };
if (!rawEnv.SITE_URL) {
  if (rawEnv.VERCEL_PROJECT_PRODUCTION_URL) {
    rawEnv.SITE_URL = `https://${rawEnv.VERCEL_PROJECT_PRODUCTION_URL}`;
  } else {
    delete rawEnv.SITE_URL;
  }
}

const parsed = serverEnvSchema.safeParse(rawEnv);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(
    `[JAGAT-MANTHAN] env contract violation:\n${issues}\nFix .env.local — see .env.example`,
  );
}

export const serverEnv: ServerEnv = parsed.data;

/* ── readiness report ───────────────────────────────────────────*/

export interface ReadinessItem {
  key: string;
  armed: boolean;
  /** Key unlocks an optional/limited feature rather than core function. */
  optional?: boolean;
  /**
   * false = key exists in the schema but NO code consumes it yet.
   * Excluded from armed/total counts so readiness never reports a score
   * that depends on features that do not exist.
   */
  wired?: boolean;
}

export interface ReadinessGroup {
  id: string;
  label: string;
  items: ReadinessItem[];
}

export interface Readiness {
  groups: ReadinessGroup[];
  armedCount: number;
  totalCount: number;
}

export function readiness(): Readiness {
  const s = serverEnv;
  const p = publicEnv;

  const groups: ReadinessGroup[] = [
    {
      id: "core",
      label: "CORE",
      items: [
        // Armed only when SITE_URL is not the localhost default.
        { key: "SITE_URL", armed: !/localhost|127\.0\.0\.1/.test(s.SITE_URL) },
        { key: "INGEST_HMAC_KEY", armed: Boolean(s.INGEST_HMAC_KEY) },
      ],
    },
    {
      id: "cache",
      label: "CACHE & RATE-LIMIT",
      items: [
        {
          key: "UPSTASH_REDIS_*",
          armed: Boolean(s.UPSTASH_REDIS_REST_URL && s.UPSTASH_REDIS_REST_TOKEN),
        },
      ],
    },
    {
      id: "backend",
      label: "FIREBASE BACKEND",
      items: [
        {
          key: "NEXT_PUBLIC_FIREBASE_*",
          armed: Boolean(p.NEXT_PUBLIC_FIREBASE_API_KEY && p.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
          wired: false,
        },
        {
          key: "FIREBASE_SERVICE_ACCOUNT",
          armed: Boolean(s.FIREBASE_SERVICE_ACCOUNT),
          wired: false,
        },
      ],
    },
    {
      id: "news",
      label: "NEWS WIRE",
      items: [{ key: "GUARDIAN_API_KEY", armed: Boolean(s.GUARDIAN_API_KEY) }],
    },
    {
      id: "markets",
      label: "MARKETS",
      items: [
        // Yahoo Finance (primary) is keyless; TwelveData is the fallback.
        { key: "TWELVEDATA_API_KEY", armed: Boolean(s.TWELVEDATA_API_KEY), optional: true },
        { key: "FRED_API_KEY", armed: Boolean(s.FRED_API_KEY), wired: false },
        { key: "EIA_API_KEY", armed: Boolean(s.EIA_API_KEY), wired: false },
      ],
    },
    {
      id: "space",
      label: "SPACE",
      items: [{ key: "NASA_API_KEY", armed: Boolean(s.NASA_API_KEY), optional: true }],
    },
    {
      id: "wildfires",
      label: "WILDFIRES",
      items: [
        { key: "NASA_FIRMS_MAP_KEY", armed: Boolean(s.NASA_FIRMS_MAP_KEY), optional: true },
      ],
    },
    {
      id: "sanctions",
      label: "SANCTIONS",
      items: [
        { key: "OPENSANCTIONS_API_KEY", armed: Boolean(s.OPENSANCTIONS_API_KEY), optional: true },
      ],
    },
    {
      id: "ships",
      label: "SHIPPING (AIS)",
      items: [
        { key: "NEXT_PUBLIC_AISSTREAM_API_KEY", armed: Boolean(p.NEXT_PUBLIC_AISSTREAM_API_KEY) },
      ],
    },
    {
      id: "flights",
      label: "AIRSPACE",
      items: [
        {
          key: "OPENSKY_CLIENT_ID",
          armed: Boolean(s.OPENSKY_CLIENT_ID && s.OPENSKY_CLIENT_SECRET),
        },
      ],
    },
    {
      id: "ai",
      label: "AI GATEWAY",
      items: [
        // Copilot works if EITHER Groq or OpenRouter is armed.
        { key: "GROQ_API_KEY", armed: Boolean(s.GROQ_API_KEY) },
        { key: "OPENROUTER_API_KEY", armed: Boolean(s.OPENROUTER_API_KEY), optional: true },
        { key: "GEMINI_API_KEY", armed: Boolean(s.GEMINI_API_KEY), wired: false },
      ],
    },
    {
      id: "alerts",
      label: "ALERTING",
      items: [{ key: "RESEND_API_KEY", armed: Boolean(s.RESEND_API_KEY), wired: false }],
    },
    {
      id: "atmosphere",
      label: "ATMOSPHERE & OUTAGES",
      items: [
        { key: "OPENAQ_KEY", armed: Boolean(s.OPENAQ_KEY), wired: false },
        { key: "CLOUDFLARE_RADAR_TOKEN", armed: Boolean(s.CLOUDFLARE_RADAR_TOKEN), wired: false },
      ],
    },
    {
      id: "unrest",
      label: "CIVIL UNREST",
      items: [
        { key: "ACLED_EMAIL", armed: Boolean(s.ACLED_EMAIL && s.ACLED_PASSWORD), optional: true },
      ],
    },
    {
      id: "geocoding",
      label: "GEOCODING",
      items: [
        { key: "LOCATIONIQ_API_KEY", armed: Boolean(s.LOCATIONIQ_API_KEY), optional: true },
      ],
    },
  ];

  const counted = groups.flatMap((g) => g.items).filter((i) => i.wired !== false);
  return {
    groups,
    armedCount: counted.filter((i) => i.armed).length,
    totalCount: counted.length,
  };
}
