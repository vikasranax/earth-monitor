# Earth Monitor · UI Vision & Expanded Tracking Scope

**Status:** Living document · Companion to COMPETITIVE-STRATEGY.md
**Purpose:** Define what "clean and eye-catching" actually means for this product, and expand the list of signals we track beyond the current M01–M13 roadmap.

---

## 1. Typography Direction

Your M02 fonts are already a strong foundation:

- **Big Shoulders** (display) — bold, condensed, high-impact for headlines/numbers. Good "terminal command deck" feel.
- **IBM Plex Sans** (body) — clean, technical, readable at small sizes.
- **IBM Plex Mono** (data/mono) — for tickers, timestamps, coordinates, status codes.

**To make it more "eye-catching" without losing the terminal identity:**

| Element                                | Treatment                                                                                                                                             |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| KPI numbers (risk score, market ticks) | Big Shoulders at large size (32–48px), tabular-nums so digits don't jitter when live-updating                                                         |
| Section headers                        | Big Shoulders, wide letter-spacing, uppercase — reinforces the "command deck" feel                                                                    |
| Body/panel text                        | IBM Plex Sans, restrained size (13–14px), high line-height for scannability                                                                           |
| Data/timestamps/IDs                    | IBM Plex Mono — never use display font for numbers that update live, motion reads better in mono                                                      |
| Devanagari (Hindi) pairing             | Add **Noto Sans Devanagari** or **Hind** as the Hindi-script counterpart — matched x-height to IBM Plex Sans so bilingual lines don't look mismatched |

**Optional accent font** for hero moments only (landing page, boot screen title) — something like **Space Grotesk** or keep Big Shoulders exclusively; introducing a 4th font risks diluting identity. Recommendation: **don't add a 4th font** — three is already a strong, disciplined system.

---

## 2. Clean UI Principles

World Monitor's own docs describe a dense, 45-panel, analyst-first interface. That's a deliberate choice for their audience — but "clean" for Earth Monitor should mean:

1. **Progressive density** — default view is calm and readable; density increases only when the user opts into more panels/layers, not by default
2. **One primary focal element per screen** — the map, or the chat, or the risk gauge — never three competing for attention at once
3. **Generous negative space between panels** — avoid the "wall of boxes" look; use `--bg-0`/`--bg-1` layering (already in your M02 tokens) to create depth without clutter
4. **Motion with restraint** — your M02 Framer Motion presets (fadeIn, slideUp, panelEnter) should stay subtle; live-updating data (tickers, KPIs) should transition, not jump-cut, but nothing should distract from reading
5. **Color used only for meaning** — `--ok`/`--warn`/`--danger`/`--info` reserved strictly for status; never used decoratively, so when something IS red, it actually means something
6. **Dark mode as the primary identity, light mode as a fully-supported equal** — not an afterthought toggle

---

## 3. Expanded Tracking Scope

Beyond your current M01–M13 roadmap (geopolitics, markets, shipping, airspace, news, atmosphere/outages), here are categories worth considering — grouped by how well they fit the "churning of the world" mission and how feasible free-tier data makes them:

### Tier 1 — High value, feasible on free tiers

| Category                                             | Why it fits                                                                                          | Possible source                                                    |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Elections & political calendar**                   | Upcoming elections/referendums globally, real geopolitical relevance                                 | Wikipedia/curated calendar, no API needed initially                |
| **Protests & civil unrest tracker**                  | Direct geopolitical signal, complements your risk score                                              | ACLED (free for academic/non-commercial), GDELT protest events     |
| **Disease outbreak tracker**                         | Real "what's going on" value, low-noise                                                              | WHO Disease Outbreak News (public feed)                            |
| **Space launches & satellite activity**              | Fits "space" already in your module manifest, visually engaging                                      | Launch Library 2 API (free)                                        |
| **Submarine cable & internet infrastructure health** | Ties into your existing outages module, underrated geopolitical signal (cable cuts = real incidents) | Cloudflare Radar (already planned), TeleGeography public cable map |
| **Currency & crypto volatility board**               | Extends your markets module with a dedicated volatility lens                                         | Already-planned market APIs, just a new view                       |
| **Wildfire & volcanic activity**                     | Strong visual/map value, disaster-adjacent                                                           | NASA FIRMS (fire), USGS/Smithsonian volcano feeds                  |

### Tier 2 — Valuable but higher effort/cost

| Category                                   | Why it fits                                          | Notes                                                |
| ------------------------------------------ | ---------------------------------------------------- | ---------------------------------------------------- |
| **Press freedom / internet freedom index** | Strong geopolitical signal, aligns with your mission | RSF/Freedom House data, usually annual not real-time |
| **Refugee & displacement flows**           | Major geopolitical/humanitarian signal               | UNHCR API exists but is heavier to integrate well    |
| **Food & water security indices**          | High relevance, low real-time granularity            | FAO/FEWS NET, mostly slow-moving data                |
| **Solar/space weather activity**           | Genuinely fits "everything," fun visual layer        | NOAA SWPC free API                                   |

### Tier 3 — Nice-to-have, lower priority

- International summit/treaty calendar (G7, G20, UN sessions)
- Historical "on this day in geopolitics" — good for engagement, zero real-time cost
- Sports/cultural mega-events as a lighter counterweight (optional toggle, not core)

---

## 4. Recommendation

Don't try to add all of Tier 1 at once — it'll dilute focus exactly the way we're trying to avoid with World Monitor's 5-variant spread (see COMPETITIVE-STRATEGY.md §2). Suggested approach:

1. Finish core roadmap (M01–M09) as scoped
2. Fold in **2–3 Tier 1 additions** as a new module — protests/unrest tracker and submarine cable health are the strongest fits, since they extend modules you're already building (news scoring, outages) rather than starting from scratch
3. Revisit Tier 2/3 after the AI Copilot (M12) exists, since many of these are more valuable as things the copilot can _answer questions about_ than as standalone panels

---

## 5. Open Decisions (bring to next session)

- Confirm: keep 3-font system (Big Shoulders / IBM Plex Sans / IBM Plex Mono) + add Devanagari pairing, or explore alternatives?
- Which Tier 1 tracking category to prioritize first as a new module (suggest: protests/unrest, since it directly strengthens the existing risk score)?
- Should elections/summit calendar be a lightweight addition to M04 (Home Command Deck) rather than its own module?
