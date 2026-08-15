# M16 — Signal & Freedom Indices

## ⚠️ This is a starter set, not a complete index

RSF's World Press Freedom Index has no official free API. A third-party GitHub mirror
(dw-data/world-press-freedom-2026) has real underlying data but an undocumented,
unstable file structure — too fragile to build a live fetcher against.

Instead, `src/lib/press-freedom-index.ts` contains **10 manually-verified entries**,
each individually sourced from real 2026 reporting, with a `sourceYear` field and a
`note` explaining exactly what's known. This is intentionally small and honest rather
than large and guessed.

## Expanding this dataset

Cross-reference https://rsf.org/en/index directly and add entries following the same
pattern — country code, tier, rank if known, a specific sourced note, and the year.
Do not invent scores or ranks without a real source.

## Future upgrade path

If RSF ever publishes an official API, or the GitHub mirror's structure stabilizes
and gets documented, this can become a live-fetched dataset like M14's Power
Structure. Until then, treat this as a manually-maintained annual dataset (matching
the "usually annual not real-time" cadence noted in the original project blueprint).
