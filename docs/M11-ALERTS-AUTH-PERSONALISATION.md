# M11 — Alerts · Auth · Personalisation

## Scope decision: device-local v1, not full account auth

Full login (Firebase) is a substantial separate task — sign-in flow, security rules, session handling — and conflicts with the project's stated "$0/month, no-login" design philosophy from M01. This ships instead as **device-local personalisation**: watchlists and alerts persisted via `localStorage` (Zustand), same pattern as the existing theme store. No account needed.

## What's here
- `src/stores/watchlist.ts` — saved symbols + alert rules, persisted per-browser
- `src/components/alerts/AlertBanner.tsx` — polls `/api/markets/snapshot` every 60s, shows a dismissible warning banner when a threshold is crossed
- `/watchlist` — add/remove saved symbols, set/remove alert rules

## Future: real account auth
If cross-device sync becomes a real need, Firebase env vars already exist in the schema (`NEXT_PUBLIC_FIREBASE_*`, `FIREBASE_SERVICE_ACCOUNT`) unused since M01 — that's the natural path when you're ready for it.
