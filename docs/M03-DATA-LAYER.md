# M03 — Data Layer & Ingestion

## What this module provides

- **`src/lib/redis.ts`** — Upstash Redis client, singleton, gracefully falls back when `UPSTASH_REDIS_REST_URL`/`TOKEN` aren't set (per the M01 env contract — every provider is optional).
- **`src/lib/fetch-with-cache.ts`** — cache-aside fetch wrapper. Uses Redis when armed; uses a per-instance in-memory Map otherwise. Every future provider (news, markets, shipping) calls through this instead of fetching directly.
- **`src/lib/rate-limit.ts`** — sliding-window rate limiter per provider ID, backed by `@upstash/ratelimit`. Without Redis, requests pass through unthrottled (no shared state to enforce against).
- **`src/lib/providers/types.ts`** — shared `ProviderConfig`/`ProviderResult` shapes future data providers (M06+) will implement against.
- **`/api/health`** — reports env readiness count and whether Redis caching is active. Useful for verifying deploy config on Vercel.

## Why this comes before M04–M09

Every later data-fetching module (news, markets, shipping, airspace, disasters) needs a caching + rate-limiting pattern to avoid hammering free-tier API limits. Building this once now means M06 onward is just "write a fetcher, call `fetchWithCache`" — not reinventing caching per module.

## Local dev without Redis

Since Upstash is optional at this stage, `pnpm dev` works fine with empty `.env.local` — you'll just see the fallback warning in the console and get in-memory (non-shared) caching, which is fine for local development.
