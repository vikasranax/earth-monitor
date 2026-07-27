# M01 · FOUNDATION & DEVEX — module documentation

**Status:** ✅ ONLINE · **Issued:** 27 Jul 2026 · **Owner:** terminal core team

## 1 · Scope delivered

| Area          | What shipped                                                                                                                                        |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scaffold      | Next.js 15 (App Router, `src/`), React 19, TypeScript strict + `noUncheckedIndexedAccess`, Turbopack dev                                            |
| Styling       | Tailwind 3.4 + semantic token architecture (dark default, light via `data-theme`), ambient background layers, CRT scanline, reduced-motion support  |
| Env contract  | `src/lib/env.ts` (server) + `src/lib/env.public.ts` (client) — Zod-validated, fail-fast with actionable messages, `pnpm verify:env` readiness board |
| Security      | CSP + HSTS + nosniff + referrer + permissions headers on every route; `poweredByHeader` off; `NEXT_PUBLIC` secret audit in CI                       |
| Quality gate  | ESLint 9 flat (zero-warning policy) · Prettier · Vitest 3 · Playwright smoke · GitHub Actions CI on every push                                      |
| First surface | Boot/self-test screen: animated boot log, live UTC clock, module manifest LEDs, real provider readiness grid, crafted 404 + error boundary          |
| DevEx         | docker-compose Redis, VS Code workspace settings + recommended extensions, CONTRIBUTING, ADR log                                                    |

## 2 · File map

40 files — see the manifest in the M01 delivery. Key entry points:
`src/app/page.tsx` (boot screen) · `src/lib/env.ts` (contract) · `next.config.mjs` (headers) · `.github/workflows/ci.yml` (gate).

## 3 · The env contract, explained

- Every variable from blueprint §8.6 is declared in one of two Zod schemas.
- **Optional-armed design:** keys are optional so a fresh clone boots; `readiness()` reports armed/total. Each module's docs list which keys to arm before running it.
- **Malformed ≠ missing:** a bad `SITE_URL` or a weak `INGEST_HMAC_KEY` fails boot loudly. Missing keys never do.
- Server/client split is enforced by convention + CI grep audit until M03 adds the `server-only` boundary tests.

## 4 · Test evidence

| Suite                          | Files   | Covers                                                                             |
| ------------------------------ | ------- | ---------------------------------------------------------------------------------- |
| `tests/unit/lib/env.test.ts`   | 4 cases | fresh-clone boot, arming semantics, malformed-value rejection, weak-HMAC rejection |
| `tests/unit/lib/utils.test.ts` | 3 cases | `cn()` merge/conflict/conditional behaviour                                        |
| `tests/e2e/smoke.spec.ts`      | 2 flows | boot screen renders manifest; 404 renders signal-lost                              |

Run: `pnpm test:unit` · `pnpm exec playwright install chromium && pnpm test:e2e`

## 5 · Known constraints (by design)

- Light theme tokens exist but the toggle ships in M02 (theme store + statusbar switch).
- No data providers are called yet — M03 builds the adapter layer.
- `robots: noindex` until M13 launch.

## 6 · Arming roadmap (which key, which module)

| Module | Keys to arm before running                                                                 |
| ------ | ------------------------------------------------------------------------------------------ |
| M03    | `UPSTASH_REDIS_*`, `INGEST_HMAC_KEY`, `NEXT_PUBLIC_FIREBASE_*`, `FIREBASE_SERVICE_ACCOUNT` |
| M06    | `GUARDIAN_API_KEY`                                                                         |
| M07    | `TWELVEDATA_API_KEY`, `FRED_API_KEY`, `EIA_API_KEY`                                        |
| M08    | `NEXT_PUBLIC_AISSTREAM_API_KEY`                                                            |
| M10    | `OPENAQ_KEY`, `CLOUDFLARE_RADAR_TOKEN`                                                     |
| M11    | `RESEND_API_KEY`                                                                           |
| M12    | `GEMINI_API_KEY`, `GROQ_API_KEY` (≥1 of the chain)                                         |

## 7 · Next: M02 · TERMINAL UI DESIGN SYSTEM

Statusbar + live ticker · Panel/KpiCard/LedBadge/RiskGauge kit · DataTable · theme store + dark/light switcher · ⌘K command palette · hotkey engine · `/design` showcase page.
