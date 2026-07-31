# जगत्-मन्थन · Earth Monitor

**The churning of the world.** An open-source, real-time global intelligence terminal — geopolitics, markets, shipping, airspace, disasters, cyber, and space, ingested live and unified into one dashboard.

🔴 **Live:** [jagatmanthan.vercel.app](https://jagatmanthan.vercel.app)

## What it does

Earth Monitor tracks what's actually happening on the planet right now, grounded in real data — not summaries written after the fact. It's built in public, in numbered modules, entirely on free-tier infrastructure.

**Currently live:**
- 🗺️ Interactive global map with country dossiers
- ⚖️ Disputed territories layer — shows every claimant's stated position side by side, without taking a side
- 🚨 Civil unrest layer (currently sample data, pending live GDELT integration)
- 📊 System readiness dashboard — live provider/module status
- 🌐 Bilingual identity (Hindi/English) baked in from the ground up

**Planned:** live news wire, markets suite, shipping & airspace tracking, natural disaster tracking, power structure & leadership intel per country, a conversational AI copilot grounded in cited data, and full multilingual support.

See [`docs/VISION-AND-TRACKING.md`](docs/VISION-AND-TRACKING.md) for the full roadmap.

## Tech stack

Next.js 15 (App Router, Turbopack) · TypeScript · Tailwind CSS · Zustand · Leaflet · Framer Motion · Upstash Redis (optional caching) · Vitest · Playwright

Every external provider is optional at the schema level — the app boots clean on a fresh clone with zero configuration. See `docs/M01-FOUNDATION.md` for the env contract design.

## Getting started

```bash
git clone https://github.com/vikasranax/earth-monitor.git
cd earth-monitor
pnpm install
cp .env.example .env.local
pnpm dev
```

Visit `http://localhost:3000`.

## Contributing

Contributions are welcome — see [`CONTRIBUTING.md`](CONTRIBUTING.md) for setup and the quality gate PRs must pass. Please also review our [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## A note on neutrality

This project deliberately avoids taking sides on disputed territorial claims (e.g. Kashmir, Tibet, Taiwan). Every claimant's stated position is shown, none is presented as more authoritative than another. See `docs/M05-GLOBAL-MAP.md` for the full reasoning.

## License

[AGPL-3.0](LICENSE) — if you run a modified version of this as a network service, you're required to release your source changes too. This keeps the project open even if forked into a hosted product.

## Acknowledgments

Built with significant development assistance from Claude (Anthropic).
