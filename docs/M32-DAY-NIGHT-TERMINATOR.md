# M32 — Day/Night Terminator

## Source
Pure computation, no external API. Solar position math ported from the
established, MIT-licensed Leaflet.Terminator plugin rather than derived from
scratch — orbital/solar mechanics is easy to get subtly wrong.

## What this provides
- `src/lib/terminator.ts` — computes the current night-hemisphere polygon
- `src/components/map/DayNightLayer.tsx` — renders it on the map, recomputing
  every 60 seconds so it visibly moves over time

## Note
This layer is inherently global and has no regional framing — unlike future
curated layers (webcams, elections, disputed territories), there's no
India/Asia-priority decision to make here.
