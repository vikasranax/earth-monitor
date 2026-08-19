# M33 — Live Unrest Data (GDELT)

## Replaces the sample data
Previously `src/lib/unrest-events.ts` held hardcoded placeholder markers
labeled "SAMPLE DATA". This wires the real GDELT DOC 2.0 API (free, no key,
updates every 15 min) instead.

## ⚠️ Needs live verification
Built against GDELT's documented API shape but **not tested live** — this
sandbox can't reach `api.gdeltproject.org`. Once deployed, check the
Network tab / server logs if `/api/unrest/live` returns an error or an
empty marker list unexpectedly.

## How country matching works
GDELT gives a `sourcecountry` string per article (not coordinates). Matched
against the live Wikidata country location list (already built for the
"All Countries" map layer) by normalized name, with a small alias table for
known mismatches (e.g. "South Korea" → "Republic of Korea"). Countries that
don't match are skipped rather than guessed at.

## Rate limiting
Capped at 6 requests/hour via M03's rate limiter, with a 15-minute cache —
matches GDELT's own update frequency, so more frequent polling wouldn't add value anyway.
