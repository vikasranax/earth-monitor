#### F39 · `docs/ADR.md`

```md
# Architecture Decision Records — JAGAT-MANTHAN

| ID    | Decision                                                                                                                                                                      | Status                 |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| AD-01 | Production news = GDELT 2.0 + Guardian API + RSS registry (NewsAPI is localhost-only on its free tier)                                                                        | Accepted               |
| AD-02 | Live ships = AISStream free AIS WebSocket; live flights = OpenSky. MarineTraffic/FlightRadar24 APIs are commercial — strait & port analytics are derived in-house from AIS    | Accepted               |
| AD-03 | Markets = TwelveData + Yahoo Finance (server-cached) + Binance WS (crypto real-time) + Frankfurter (ECB FX) + EIA (oil fundamentals). AlphaVantage's 25 calls/day is unusable | Accepted               |
| AD-04 | Real-time on serverless = client-direct WS (Binance, AISStream) + Edge SSE + React Query SWR polling over Redis-cached routes. No server WebSockets on Hobby tiers            | Accepted               |
| AD-05 | AI = provider-agnostic gateway with failover: Gemini free → Groq free → OpenRouter free → local Ollama; Zod-structured output; citations mandatory                            | Accepted               |
| AD-06 | i18n = client-side react-i18next (13 languages, no page reload, no route prefixes)                                                                                            | Accepted               |
| AD-07 | Maps = Leaflet + CARTO tiles primary, Mapbox only if a token is added. Charts = Recharts + Chart.js + TradingView free widgets                                                | Accepted               |
| AD-08 | Ingestion scheduling = GitHub Actions cron hitting HMAC-protected `/api/ingest/*` (free, reliable, bypasses Hobby cron limits)                                                | Accepted               |
| AD-09 | **Project renamed GLOBAL MONITOR AI → JAGAT-MANTHAN (जगत्-मन्थन).** Blueprint doc IDs (GMAI-BP-\*) remain for traceability; all code, commits and docs use the new name       | Accepted · 27 Jul 2026 |
| AD-10 | Tailwind v3.4 (classic `tailwind.config.ts`) over v4 CSS-first — ecosystem stability and full ShadCN compatibility                                                            | Accepted               |
| AD-11 | Hand-authored scaffold instead of `create-next-app` — deterministic dependency ranges, zero drift between local/CI                                                            | Accepted               |
| AD-12 | Theming = dark-default token switching via `html[data-theme]`; components consume semantic tokens only                                                                        | Accepted               |
| AD-13 | Toolchain = pnpm 10 · ESLint 9 flat config · Vitest 3 · Playwright · strict TS with `noUncheckedIndexedAccess`                                                                | Accepted               |
```
