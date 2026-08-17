# M29 — On This Day in Geopolitics

## Zero API, pure content
No external dependency at all — a curated, dated dataset filtered by today's
month/day. Starter set only includes well-established, unambiguous historical
facts; expand carefully, don't add a date without being certain of it.

## Where it lives
- `src/lib/on-this-day.ts` — the dataset + `getEventsForDate()`
- `src/components/terminal/OnThisDay.tsx` — renders it, honest empty state
  for days without an entry rather than padding with weak content

## Weighting
India/Asia-prioritized per project convention, with a few universally
significant global events (moon landing, UN founding, Berlin Wall) included
for broader relevance.
