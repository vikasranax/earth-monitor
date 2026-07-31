# M06 — News Engine

## What this provides

- `src/lib/providers/guardian.ts` — Guardian Open Platform fetcher, cached via M03's `fetchWithCache`, rate-limited via M03's `checkRateLimit`
- `/news` route — displays live articles, or an honest "not armed" state with a link to get a free API key if `GUARDIAN_API_KEY` isn't set

## Getting a free Guardian API key

Sign up at https://open-platform.theguardian.com — free tier is generous for this use case. Add to `.env.local`:
