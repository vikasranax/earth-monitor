# M05 — Global Map & Country Intel

## What this module provides

- **`src/lib/countries.ts`** — curated starter dataset of 25 countries (code, name, capital, coordinates, government type, population). Expand this list over time; it's the single source of truth other modules (M14 power structure, M05a multilayer engine) will build on.
- **`src/components/map/WorldMap.tsx`** — Leaflet-based interactive map using free CARTO dark tiles (no API key required, `$0/month` stack preserved). Client-only (`dynamic(..., { ssr: false })`) since Leaflet touches `window` at import time.
- **`src/components/map/CountryDossier.tsx`** — side panel showing selected country facts, reusing M02's `Panel`/`LedBadge` components.
- **`/map`** route — full page combining the two, wired into the M02 command palette ("Go to Global Map" already existed as a command).

## Known limitation

Only 25 countries are seeded. Clicking anywhere without a marker does nothing yet — this is a point dataset, not full country polygon boundaries. Full-boundary click-anywhere selection (GeoJSON shapes) is a reasonable M05a enhancement once the multilayer map engine is built.

## Dependency on M14

`CountryDossier` explicitly notes "Power structure detail arrives in M14" — this keeps the UI honest about what's real vs. planned, consistent with M04's approach.

## Disputed territories layer

Shows multiple claimants' stated positions side by side (Kashmir, Tibet, Taiwan, Crimea, Western Sahara, Golan Heights) — no claim is presented as more authoritative than another. This is a deliberate neutrality choice: the app doesn't adopt any single government's official map as "correct," since these are live, contested disputes between sovereign states. See project chat history for the full reasoning.

## Civil unrest layer

Currently seeded with clearly-labeled **sample data only** (`isSample: true` on every record, visible in the popup). Not connected to a live feed yet. Replace `src/lib/unrest-events.ts` with a real GDELT-backed fetcher (via M03's `fetchWithCache`) when that pipeline is built — likely alongside M06 (News Engine) or as its own M09a-style module.

## Future: 3D globe

`three` is already in dependencies. A 3D globe view (react-globe.gl or a custom Three.js scene) is a reasonable upgrade path once the 2D layer system is stable — worth its own module rather than retrofitting into M05.
