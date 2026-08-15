# M12 — AI Copilot

## What this provides

- `src/components/copilot/CopilotButton.tsx` — floating "Ask Copilot" button, also
  listens for a global `open-copilot` custom event so any page can trigger it
  (e.g. `window.dispatchEvent(new Event("open-copilot"))`)
- `src/components/copilot/ChatPanel.tsx` — the chat UI, streams responses via SSE
- `src/app/api/copilot/route.ts` — edge-runtime route: intent detection (news vs.
  markets vs. general), grounding context, and OpenAI-compatible streaming

## How grounding works

Every message is classified into `news`, `markets`, or `general` by keyword regex.

- **News intent** → fetches from `fetchAllNews()` (NEWS source aggregator),
  builds numbered `[1] [2]` citation context, sends citations to the client via
  the `X-Citations` response header (since the body itself is a stream)
- **Markets intent** → resolves mentioned symbols via `markets-watchlist.ts`'s
  alias map, fetches specific + reference + broad quotes as context (no
  per-item citations — the live numbers are inline in the prompt itself)
- **General intent** → no grounding; model answers from training knowledge,
  instructed not to claim it's live data

## AI provider resolution

Checked in order: `OPENAI_API_KEY` (direct override, not part of the standard
env schema) → `GROQ_API_KEY` → `OPENROUTER_API_KEY`. All three are OpenAI-
compatible chat completion APIs, so one client code path handles all of them.

**Known gap:** `GEMINI_API_KEY` exists in `src/lib/env.ts`'s schema (part of
the original M01 "AI Gateway, arm at least one" design) but is **not** wired
into this route. Gemini's native API isn't OpenAI-chat-completions-shaped
without a separate adapter layer — this was silently broken before this fix
(the key would be accepted by env validation but never actually used), and is
now honestly documented as unsupported rather than pretended to work.

## Future work

- Wire Gemini properly (needs its own request/response shape, not the OpenAI
  client path)
- Ground on Power Structure / hazard / shipping data too, not just news/markets
  (see `docs/FUTURE-LAYERS-AND-FEATURES.md`)
- Per-citation relevance beyond "first 8 articles" — currently no ranking
