# जगत्-मन्थन · Earth Monitor

**The churning of the world.** An open-source, real-time global intelligence dashboard — geopolitics, markets, shipping, airspace, disasters, power structure, sanctions, governance and more, unified in one terminal-styled interface and built on free data sources.

🔴 **Live:** [jagatmanthan.vercel.app](https://jagatmanthan.vercel.app)

---

## Why this exists

The aim is the most useful, **honest**, free real-time view of the planet — depth and correctness over feature count. India and Asia are first-class in framing and curation, not an afterthought. If something isn't live, the interface says so.

## What it covers

Module status lives in [`src/lib/modules.ts`](src/lib/modules.ts) — that file is the single source of truth, and the homepage renders it live.

| Area | What you get |
| --- | --- |
| **Map** | Multilayer Leaflet map: disputed territories, civil unrest, earthquakes, submarine cables, all countries, places to visit, architecture & wonders, webcams, wildfires, military aircraft, day/night terminator, dark/satellite base layers, geocode search and country dossiers |
| **News** | Guardian API plus 18 regional RSS feeds, grouped by region and topic |
| **Markets** | 60+ symbols across 9 regions, currency conversion, Yahoo Finance with TwelveData fallback |
| **Shipping** | Live AIS vessels (AISStream) across key chokepoints |
| **Airspace** | OpenSky OAuth2 live tracking over tension regions, plus a callsign-filtered military aircraft layer |
| **Hazards** | USGS earthquakes, wildfire hotspots (NASA FIRMS) |
| **Power structure** | Heads of state and government for every sovereign state, live from Wikidata SPARQL |
| **Sanctions & governance** | OpenSanctions screening (sample data without a key) and World Bank governance indicators |
| **Politics** | Elections calendar, G20 / BRICS+ / SCO groups, signal & freedom indices, visa requirements |
| **Space** | Launch tracker (Launch Library 2) and NASA feeds |
| **Civil unrest** | ACLED when credentials are approved, Guardian-based city matching otherwise |
| **Culture** | Architecture & wonders, UNESCO and ASI heritage, "On This Day in Geopolitics" |
| **AI Copilot** | Streaming assistant (Groq / OpenRouter) grounded in live news, markets and power-structure data, with citations |
| **Multilingual UI** | 12 languages for core navigation, with RTL support — see limitations below |

## Data sources and honest status

Every key is optional — the app boots with zero configuration, and `/api/health` and the homepage report what is armed.

| Domain | Source | Works without a key? | Notes |
| --- | --- | --- | --- |
| Markets | Yahoo Finance → TwelveData | ✅ Yahoo | Yahoo is an unofficial endpoint and could break without notice |
| News | Guardian + RSS | ✅ RSS | Add `GUARDIAN_API_KEY` for the Guardian feed; RSS feeds can go stale |
| Earthquakes | USGS | ✅ | Authoritative and reliable |
| Power structure | Wikidata | ✅ | Head of state and government only, not full cabinets |
| Governance | World Bank | ✅ | |
| Space | Launch Library 2 | ✅ | Tight anonymous rate limit |
| Shipping | AISStream | ❌ | Needs `NEXT_PUBLIC_AISSTREAM_API_KEY`; coverage depends on receiver density |
| Airspace / military aircraft | OpenSky | ❌ | OAuth2 client credentials; Basic Auth is deprecated for new accounts |
| Wildfires | NASA FIRMS | ❌ | Free, instant key |
| Geocoding | LocationIQ → Nominatim | ⚠️ | Public Nominatim blocks many cloud IPs; a key makes it reliable |
| Sanctions | OpenSanctions | ⚠️ | **Sample data, clearly labelled**, until a key is set |
| Civil unrest | ACLED → Guardian | ⚠️ | ACLED approval is pending; the Guardian fallback only catches events with a known city in the headline |
| Webcams | Windy | ❌ | Needs API approval |
| AI Copilot | Groq / OpenRouter | ❌ | Either key enables it |

Sample or placeholder data is always marked (`SAMPLE DATA` / `STARTER SET` badges). Nothing is described as live when it is not.

## Tech stack

Next.js 15 (App Router, Turbopack) · TypeScript (strict, `noUncheckedIndexedAccess`) · Tailwind CSS · Zustand · Leaflet · Framer Motion · Upstash Redis (optional, in-memory fallback) · Vitest · Playwright · pnpm

## Getting started

```bash
git clone https://github.com/vikasranax/earth-monitor.git
cd earth-monitor
pnpm install
cp .env.example .env.local   # every key is optional
pnpm verify:env              # provider readiness board
pnpm dev                     # http://localhost:3000
```

### Environment variables

| Variable | Unlocks |
| --- | --- |
| `GROQ_API_KEY` or `OPENROUTER_API_KEY` | AI Copilot |
| `GUARDIAN_API_KEY` | Guardian news feed |
| `TWELVEDATA_API_KEY` | Markets fallback |
| `NEXT_PUBLIC_AISSTREAM_API_KEY` | Live shipping |
| `OPENSKY_CLIENT_ID` + `OPENSKY_CLIENT_SECRET` | Airspace and military aircraft |
| `NASA_API_KEY` | NASA space feeds |
| `NASA_FIRMS_MAP_KEY` | Wildfire hotspots |
| `LOCATIONIQ_API_KEY` | Reliable geocoding |
| `OPENSANCTIONS_API_KEY` | Real sanctions data (otherwise sample mode) |
| `ACLED_EMAIL` + `ACLED_PASSWORD` | Event-level civil unrest (after account approval) |
| `WINDY_WEBCAMS_API_KEY` | Live webcams (after approval) |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Shared cache and rate limiting |
| `SITE_URL` | Canonical URL; on Vercel it falls back to the production domain automatically |

`.env.example` also lists keys reserved for future modules (FRED, EIA, OpenAQ, Cloudflare Radar, Gemini, Resend, Firebase, Mapbox). They are not used by any code yet and are not counted in the readiness score.

**Never commit `.env.local`.**

### Deploying to Vercel

Add the same variables under *Project → Settings → Environment Variables* for the **Production** environment, then redeploy. `NEXT_PUBLIC_*` variables are baked in at build time, so they only take effect after a rebuild. Check `/api/health` afterwards to confirm what is armed.

### Quality gate

```bash
pnpm typecheck
pnpm lint
pnpm test                       # Vitest unit tests
pnpm exec playwright test       # end-to-end smoke tests
```

## Design conventions

- **Typography:** Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono (data). No fourth font.
- **Colour:** CSS custom properties only (`--bg-0…3`, `--fg-0…`, `--accent`, `--ok` / `--warn` / `--danger` / `--info`). Never raw hex in components — it silently breaks the light/dark toggle.
- **Components:** pages compose from `src/components/terminal/` (`Panel`, `KpiCard`, `LedBadge`, `RiskGauge`, `DataTable`, `Ticker`, `StatusBar`, `CommandPalette`, …) rather than hand-rolled styled divs.
- **New modules** go in new, self-contained files wherever possible.

## Principles

1. **Honesty over impressive fakes.** Sample data is labelled; cache and "live" flags report truthfully.
2. **Neutrality on disputed territories.** Every claimant's position is shown side by side (Kashmir, Tibet, Taiwan, Crimea, Western Sahara, Golan Heights). No single government's map is treated as authoritative — the same standard for every country. See [`docs/M05-GLOBAL-MAP.md`](docs/M05-GLOBAL-MAP.md).
3. **Global-first, India/Asia-weighted.** No default to US/EU framing; "West Asia", not "Middle East".
4. **Graceful fallback chains** over single points of failure (markets, unrest, geocoding).
5. **Public facts only.** Read-only location and entity data is fine; operational or targeting intelligence is out of scope.

## Known limitations

- **Translations cover core UI chrome only** (about 27 strings × 12 languages). Page content — news, market labels, Copilot answers, dossiers — is English-only. Translations are first-pass and not native-reviewed.
- **The map may fail to load on some phones** (suspected zero-height Leaflet container). Under investigation.
- **Gemini is not wired** to the Copilot; Groq and OpenRouter are.
- **Full country dossiers** exist in depth for about 25 curated countries; others fall back to REST Countries data on demand.
- Third-party endpoints (Yahoo, RSS feeds, OpenSky) can change or throttle without notice.

## Project layout

```
src/
  app/            pages (map, news, markets, shipping, airspace, …) and api/ routes
  components/     terminal/ (design system), map/, copilot/, i18n/, alerts/, …
  lib/
    providers/    one file per external data source
    i18n/         locales, translations, useTranslation
    modules.ts    module registry (source of truth for status)
    env.ts        server env contract and readiness report
  stores/         Zustand stores (settings, watchlist, locale)
docs/             per-module notes (M01–M44), ADR, vision and tracking
tests/            unit/ (Vitest) and e2e/ (Playwright)
```

## Contributing

Contributions are welcome — see [`CONTRIBUTING.md`](CONTRIBUTING.md) for setup and the quality gate PRs must pass, and review our [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## License

[AGPL-3.0-or-later](LICENSE) — if you run a modified version of this as a network service, you must release your source changes too. This keeps the project open even if forked into a hosted product.

## Acknowledgments

Built with significant development assistance from Claude (Anthropic) and Kimi (Moonshot AI).
