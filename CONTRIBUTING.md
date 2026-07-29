# Contributing to Earth Monitor

Thanks for wanting to help build जगत्-मन्थन · Earth Monitor — a real-time, open-source global intelligence terminal.

## Getting started

1. Fork the repo, then clone your fork:

```bash
   git clone https://github.com/<your-username>/earth-monitor.git
   cd earth-monitor
```

2. Install dependencies:

```bash
   pnpm install
```

3. Copy the env file (everything's optional at early modules):

```bash
   cp .env.example .env.local
```

4. Start the dev server:

```bash
   pnpm dev
```

## Before opening a PR

Run the full quality gate locally:

```bash
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm build
```

All four must pass — this is the same gate CI runs automatically on your PR.

## Project structure

The project is built in numbered modules (M01, M02, M03…) — see `docs/` for specs on each module and `docs/VISION-AND-TRACKING.md` for the overall roadmap. Check open issues labeled `good first issue` if you're new.

## Code style

- TypeScript, strict mode
- Prettier formatting (`pnpm format` before committing)
- Components go in `src/components/`, following the existing terminal design system in `src/components/terminal/`

## License

By contributing, you agree your contributions will be licensed under the project's AGPL-3.0 license.
