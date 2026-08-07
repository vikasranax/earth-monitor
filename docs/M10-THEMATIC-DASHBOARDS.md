# M10 — Thematic Dashboards

Composes existing M06–M09 providers into unified views, rather than one provider per page.

## Conflict Watch (`/dashboards/conflict-watch`)
Combines: filtered Guardian news (conflict/war/military query), OpenSky tension-zone aircraft counts, disputed territories count, sample unrest markers. Server component — all data fetched server-side in parallel.

## Trade & Flows (`/dashboards/trade-flows`)
Combines: TwelveData markets (via new `/api/markets/snapshot` route, since client components can't call server-only fetchers directly) + live AIS shipping chokepoint counts. Client component, since AIS requires a browser WebSocket.

## Why the new API route
`/api/markets/snapshot` exposes `fetchMarketQuotes()` as JSON so client components can reach it via `fetch()` — server-only functions (using `serverEnv`) can't be called directly from client code.
