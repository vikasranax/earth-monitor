# M17 — Multilingual Core (Phase 1: infrastructure + core UI)

## Honest scope
This is a **starter phase**, not full multilingual coverage. It provides:
- 12 languages: English, Hindi, Sanskrit, Arabic, French, Spanish, Russian,
  Chinese, Tamil, Telugu, Kannada, Malayalam
- A working language switcher, persisted locale, automatic RTL handling for Arabic
- ~27 core UI/navigation strings translated

**What this does NOT yet cover:** the actual content of your 30+ pages
(news articles, market labels, dossier text, Copilot responses) is still
English-only. That's a large, incremental follow-up — translate and test
one page at a time, not all at once.

## Why no [locale] URL routing yet
Proper i18n routing (e.g. next-intl with `/hi/map`, `/ar/news`) requires
moving every existing page file into a `[locale]/` folder — 30+ file moves.
Too risky to do without live verification. This phase uses a client-side
locale store instead (no URL change), which is safer and still gives real,
working language switching.

## Translation quality note
First-pass translations, especially for technical/political terminology
(e.g. "Power Structure," "Watchlist"). Sanskrit in particular has no
single standard modern-software register — treat all of this as a
starting point for native-speaker review, not a final translation.

## Integration — one safe step, do this in the morning
Add `<LanguageSelector />` next to wherever `<CopilotButton />` /
`<MediaButton />` currently render (likely `src/app/layout.tsx` or a
shared shell component) — same "add one line, don't touch anything else"
pattern used for the media button integration earlier. Import:
```ts
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
```
