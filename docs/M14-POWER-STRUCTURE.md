# M14 — Power Structure & Leadership Intel

## How this actually works — live, not hardcoded

Rather than hardcoding leader names (which go stale immediately and risk being wrong), this queries **Wikidata's live SPARQL endpoint** for each country's current head of state (P35) and head of government (P6), filtering for statements with no "end time" qualifier — i.e., the current officeholder.

## ⚠️ Needs live verification

This SPARQL query was written against documented Wikidata patterns but **could not be tested from the development sandbox** (no network access to query.wikidata.org there). Once deployed, check `/power-structure` — if every country shows "Unconfirmed," the query likely needs debugging. Check the browser console / server logs for the actual error from `fetchPowerStructure()`.

## Adding more countries

Add one line to `src/lib/power-structure/country-registry.ts` with the country's ISO code, name, and Wikidata QID. No other code changes needed — the SPARQL query and page both iterate the registry automatically.

## Caching

6-hour TTL via M03's `fetchWithCache` — leadership doesn't change fast enough to justify shorter caching, and this respects Wikidata's fair-use policy (a descriptive User-Agent is sent per their guidelines).

## Known limitation

Only head of state + head of government are tracked (2 roles), not the full "top 5" template described in the original design doc (foreign minister, defense minister, etc.) — those aren't reliably available via a single Wikidata property across all government types. This is a solid v1; expanding to more roles is a future iteration.
