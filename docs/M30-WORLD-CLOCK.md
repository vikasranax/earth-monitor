# M30 — World Clock

## Zero API
Uses the browser's built-in `Intl.DateTimeFormat` with IANA timezone
identifiers — fully accurate, automatically handles daylight saving, no
external dependency at all.

## Where it lives
- `src/lib/world-clock.ts` — city list + formatting helpers
- `src/components/terminal/WorldClock.tsx` — live-ticking panel, updates
  every second

## Weighting
India (New Delhi) listed first, followed by broad Asia coverage (China,
Japan, Singapore, UAE), then major global hubs — consistent with project
convention.
