# M41 — Live Unrest Data (ACLED primary, Guardian fallback)

## Primary: ACLED

Real event-level coordinates (not text-matching) via OAuth token exchange
(`ACLED_EMAIL`/`ACLED_PASSWORD` in `.env.local`). Only `Protests` and `Riots`
event types included — ACLED's broader conflict data is a candidate for a
separate future layer, not folded in here.

## Fallback: Guardian

If ACLED isn't armed or returns no markers, `/api/unrest/live` automatically
falls back to the Guardian-based city-text-matching version — same pattern
as M07's Yahoo→TwelveData fallback.

## Getting ACLED credentials

Register at https://acleddata.com. Note: this is NOT a simple copy-paste
API key — authentication is OAuth (email+password → access token), per
ACLED's current access model.
