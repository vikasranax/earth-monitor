# M07 — Markets Suite

## What this provides

- `src/lib/markets-watchlist.ts` — curated symbol list (index/commodity/forex/crypto proxies chosen for free-tier compatibility)
- `src/lib/providers/twelvedata.ts` — fetches each watchlist symbol individually (not batched), cached via M03's `fetchWithCache`, rate-limited via `checkRateLimit`
- `/markets` route — KPI card grid with live price + % change, or an honest "not armed" state

## Getting a free TwelveData key

Sign up at https://twelvedata.com — free tier gives 800 requests/day, plenty given 90s caching means at most ~960 calls/day even under constant traffic.
