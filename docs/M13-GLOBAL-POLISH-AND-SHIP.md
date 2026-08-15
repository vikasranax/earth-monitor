# M13 — Global Polish & Ship

## What this module does
Not new features — this is the launch-readiness pass: SEO metadata, sitemap/robots,
real E2E tests (Playwright config existed since M01, unused until now), and a manual
polish checklist for things automated tools in this environment can't verify.

## Shipped
- `robots: { index: true, follow: true }` — public indexing now ON
- Open Graph + Twitter card metadata for link previews
- `/sitemap.xml` and `/robots.txt` auto-generated from `src/app/sitemap.ts` / `robots.ts`
- Real Playwright smoke tests covering: home load, command palette open/close,
  map render, power structure live data, cross-page navigation

## Manual checklist — verify these yourself
- [ ] Color contrast on `--fg-muted` text
- [ ] Mobile responsiveness on `/dashboards`, `/power-structure`
- [ ] Keyboard navigation through command palette
- [ ] No loading flash on hard refresh
- [ ] Every nav link resolves correctly
