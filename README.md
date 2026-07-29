# Earth Monitor (जगत्-मन्थन · Jagat-Manthan)

### The Churning of the World — a global intelligence terminal

> Geopolitics · markets · shipping · airspace · disasters · health · space ·
> energy · cyber · supply chains — ingested live from 31 free sources, analysed
> by AI, delivered as one Bloomberg-grade dashboard.
> **Target operating cost: $0/month.**

---

## Module status

| Module  | Name                              | State      |
| ------- | --------------------------------- | ---------- |
| M01     | Foundation & DevEx                | ✅ ONLINE  |
| M02     | Terminal UI Design System         | ⏳ STANDBY |
| M03     | Data Layer & Ingestion            | ⏳ STANDBY |
| M04–M13 | see docs/00-MASTER-BLUEPRINT.html | ⏳ STANDBY |

## Quickstart

```bash
pnpm install
cp .env.example .env.local   # every key optional at M01
pnpm verify:env              # provider readiness board
pnpm dev                     # http://localhost:3000 → boot screen
```
