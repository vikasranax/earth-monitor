# M15 — Space & Orbital Tracker

## Source

Launch Library 2 (`ll.thespacedevs.com`) — free, no API key. Anonymous tier is tightly
rate-limited (~15 req/hour), so this module caches for 30 minutes and self-throttles
to 10 requests/hour via M03's rate limiter, well under the ceiling.

## What this provides

- `src/lib/providers/space-launches.ts` — fetches the next 15 upcoming launches globally
- `/space` route — table of mission, provider, launch site, launch window, status
