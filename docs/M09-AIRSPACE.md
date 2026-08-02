# M09 — Airspace

## Note: works without credentials

Unlike M06/M07, this module isn't "not armed" by default — OpenSky Network allows free anonymous access to live aircraft state data, just with a lower rate limit (~4 requests/min vs ~20 authenticated). `OPENSKY_USER`/`OPENSKY_PASS` are optional and only raise the ceiling.

## What this provides

- `src/lib/air-regions.ts` — 6 watched airspace regions (Taiwan Strait, Eastern Europe, Middle East, South China Sea, Korean Peninsula, Kashmir)
- `src/lib/providers/opensky.ts` — fetches global aircraft states once, buckets them into regions server-side, cached 60s via M03
- `/airspace` route — global aircraft count + per-region breakdown

## Getting free OpenSky credentials (optional)

Register at https://opensky-network.org — no cost, just raises your rate limit ceiling.

## Testing note

`opensky.test.ts` mocks `global.fetch` rather than hitting the real API, since OpenSky isn't in the network allowlist and live network calls in CI would be flaky/rate-limited.
