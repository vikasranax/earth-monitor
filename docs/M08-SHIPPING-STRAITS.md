# M08 — Shipping & Straits

## Architecture note: this module is client-only, by design

Unlike M06/M07, this doesn't go through M03's server-side cache. AISStream is built for **direct browser WebSocket connections** using a public key — that's why it's `NEXT_PUBLIC_AISSTREAM_API_KEY` (client-exposed by design), not a server secret. Each visitor's browser opens its own live connection.

## What this provides

- `src/lib/straits.ts` — bounding boxes for 6 major shipping chokepoints (Hormuz, Malacca, Suez, Bab-el-Mandeb, Bosphorus, Panama)
- `src/hooks/useAisStream.ts` — manages the WebSocket lifecycle, subscribes to all 6 bounding boxes, keeps the last 50 unique vessel pings
- `/shipping` route — live per-chokepoint vessel counts + recent pings table

## Getting a free AISStream key

Sign up at https://aisstream.io — free tier. Add to `.env.local`:
