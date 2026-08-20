/**
 * SERVER-ONLY environment contract. Never import from "use client" modules —
 * the client surface lives in src/lib/env.public.ts.
 *
 * Design (AD-03/AD-08): every provider key is OPTIONAL at the schema level so
 * a fresh clone boots clean; readiness() reports which providers are armed.
 * Malformed values (e.g. a non-URL SITE_URL) fail boot with an actionable message.
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

  OPENSKY_USER: z.string().optional(),
  OPENSKY_PASS: z.string().optional(),

  OPENAQ_KEY: z.string().optional(),
  CLOUDFLARE_RADAR_TOKEN: z.string().optional(),

  GEMINI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),

  ACLED_EMAIL: z.string().optional(),
  ACLED_PASSWORD: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

const parsed = serverEnvSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(
    `[JAGAT-MANTHAN] env contract violation:\n${issues}\nFix .env.local — see .env.example`,
  );
}

export const serverEnv: ServerEnv = parsed.data;

/* ── readiness report ─────────────────────────────────────────── */

export interface ReadinessItem {
  key: string;
  armed: boolean;
  optional?: boolean;
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
        { key: "SITE_URL", armed: true },
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
        },
        { key: "FIREBASE_SERVICE_ACCOUNT", armed: Boolean(s.FIREBASE_SERVICE_ACCOUNT) },
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
        { key: "TWELVEDATA_API_KEY", armed: Boolean(s.TWELVEDATA_API_KEY) },
        { key: "FRED_API_KEY", armed: Boolean(s.FRED_API_KEY) },
        { key: "EIA_API_KEY", armed: Boolean(s.EIA_API_KEY) },
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
      items: [{ key: "OPENSKY_USER", armed: Boolean(s.OPENSKY_USER), optional: true }],
    },
    {
      id: "ai",
      label: "AI GATEWAY",
      items: [
        { key: "GEMINI_API_KEY", armed: Boolean(s.GEMINI_API_KEY) },
        { key: "GROQ_API_KEY", armed: Boolean(s.GROQ_API_KEY) },
        { key: "OPENROUTER_API_KEY", armed: Boolean(s.OPENROUTER_API_KEY), optional: true },
      ],
    },
    {
      id: "alerts",
      label: "ALERTING",
      items: [{ key: "RESEND_API_KEY", armed: Boolean(s.RESEND_API_KEY) }],
    },
    {
      id: "atmosphere",
      label: "ATMOSPHERE & OUTAGES",
      items: [
        { key: "OPENAQ_KEY", armed: Boolean(s.OPENAQ_KEY) },
        { key: "CLOUDFLARE_RADAR_TOKEN", armed: Boolean(s.CLOUDFLARE_RADAR_TOKEN) },
      ],
    },
    {
      id: "unrest",
      label: "CIVIL UNREST",
      items: [
        { key: "ACLED_EMAIL", armed: Boolean(s.ACLED_EMAIL && s.ACLED_PASSWORD), optional: true },
      ],
    },
  ];

  const all = groups.flatMap((g) => g.items);
  return {
    groups,
    armedCount: all.filter((i) => i.armed).length,
    totalCount: all.length,
  };
}
