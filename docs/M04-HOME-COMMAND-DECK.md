# M04 — Home Command Deck

## What changed

`src/app/page.tsx` was fully rewritten — the M01 boot screen is retired (it said it would be, from day one). The real dashboard now renders at `/`.

## What's genuinely live here (not mocked)

- **Providers Armed** — from `readiness()`, the same env contract system from M01
- **Modules Online** — from `src/lib/modules.ts`, the single source of truth for module status
- **Cache** — from `isRedisArmed()` (M03), shows whether Upstash is actually configured
- **System Readiness gauge** — `armedCount / totalCount`, reusing the M02 `RiskGauge` component for something honestly computable today

## What's intentionally NOT here yet

A real "global geopolitical risk score" needs live news/market signal (M06/M07), which doesn't exist yet. Rather than fake that number, this module only shows infrastructure/build-state data that's actually true right now. The RiskGauge component is proven out here and will be repointed to real risk data once M06 exists.

## Single source of truth

`src/lib/modules.ts` is now the one place module status lives — update it here when a module ships, rather than editing multiple UI locations.
