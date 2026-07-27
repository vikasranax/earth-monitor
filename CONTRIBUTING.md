#### F38 · `CONTRIBUTING.md`

````md
# Contributing to JAGAT-MANTHAN

## Workflow

1. Modules ship in strict order (M01 → M13). Never start M(N+1) with M(N) unverified.
2. Branch per module or feature: `feat/m02-statusbar`, `fix/m01-csp-typo`.
3. Conventional commits: `feat(m02): add ticker component`, `test(m01): env contract`, `docs(m01): runbook`.
4. Squash-merge PRs. CI must be green: lint · typecheck · unit tests · build · secret audit.

## Conventions

- TypeScript strict; no `any` without a written justification in the PR.
- Server data access only through `src/services/*` adapters (from M03).
- Client env only through `src/lib/env.public.ts`; server env only through `src/lib/env.ts`.
- Colors only via semantic tokens (`text-muted`, `bg-panel`, `border-line`…) — never raw hex in components.
- Every new feature ships with tests and a docs update in the same PR.

## Local quality gate

```bash
pnpm quality
```
````
