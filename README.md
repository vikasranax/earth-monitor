# जगत्-मन्थन · Earth Monitor

**The churning of the world.** An open-source, real-time global intelligence terminal — geopolitics, markets, shipping, airspace, disasters, cyber, and space, ingested live and unified into one Bloomberg-grade dashboard.

🔴 **Live:** [jagatmanthan.vercel.app](https://jagatmanthan.vercel.app)

---

## What it does

Earth Monitor tracks what's actually happening on the planet right now, grounded in real data — not summaries written after the fact. It's built in public, in numbered modules, entirely on free-tier infrastructure.

### Currently Live (M01–M12)

| Module | Feature                                                                           | Status    |
| ------ | --------------------------------------------------------------------------------- | --------- |
| M01    | Foundation & DevEx — env contract, CI gate, boot screen                           | ✅ Online |
| M05    | Global map with country dossiers & disputed territories                           | ✅ Online |
| M06    | **News Wire** — 20 sources (Guardian + 18 regional RSS) grouped by region & topic | ✅ Online |
| M07    | **Markets Suite** — 62 symbols across 9 regions via TwelveData                    | ✅ Online |
| M09a   | Hazard layer (USGS earthquakes — sample data)                                     | ✅ Online |
| M11    | Alerts, auth, personalisation scaffolding                                         | ✅ Online |
| M12    | **AI Copilot** — streaming, multilingual, cites live data                         | ✅ Online |

### Copilot Capabilities

- **Natural language** queries in any language
- **Live grounding** — every answer cites real data sources [1], [2], etc.
- **Intent detection** — news, markets, or general knowledge
- **Auto-detects** Groq or OpenAI from API key prefix
- **Regional awareness** — understands "nifty", "yuan", "riyal", "real" natively

### News Coverage (20 Sources)

| Region          | Sources                                                         |
| --------------- | --------------------------------------------------------------- |
| South Asia      | The Hindu, Indian Express, NDTV, Dawn                           |
| East Asia       | Japan Times, SCMP, Korea Herald                                 |
| South-East Asia | Bangkok Post, Straits Times                                     |
| Middle East     | Al Jazeera, Middle East Eye                                     |
| Europe & Russia | The Guardian, BBC World, France24, Deutsche Welle, Moscow Times |
| Africa          | BBC Africa                                                      |
| Americas        | NYT World, Washington Post                                      |

### Markets Coverage (62 Symbols, 9 Regions)

- **South Asia:** Nifty 50, USD/INR, Reliance
- **East Asia:** China Large-Cap, Nikkei, KOSPI, USD/CNY, USD/JPY
- **South-East Asia:** STI, KLCI, PSEi, JCI, SET
- **Middle East:** USD/SAR, USD/AED, USD/ILS, Oil
- **Europe & Russia:** FTSE, DAX, CAC, MIB, EUR/USD, GBP/USD, USD/RUB
- **Africa:** JSE, USD/ZAR, USD/EGP, USD/NGN
- **Americas:** S&P 500, Nasdaq, Dow, Bovespa, Merval, IPC
- **Global:** Gold, Silver, Oil, Gas, Bitcoin, Ethereum

---

## Tech Stack

Next.js 15 (App Router, Turbopack) · TypeScript · Tailwind CSS · Zustand · Leaflet · Framer Motion · Upstash Redis (caching) · Vitest · Playwright

### Data Providers (Free Tier)

| Domain      | Primary              | Fallback                  |
| ----------- | -------------------- | ------------------------- |
| News        | Guardian API         | 18 Regional RSS feeds     |
| Markets     | TwelveData           | (Yahoo Finance — planned) |
| Earthquakes | USGS                 | GDACS                     |
| AI          | Groq (llama-3.3-70b) | OpenAI (gpt-4o-mini)      |

Every external provider is optional at the schema level — the app boots clean on a fresh clone with zero configuration.

---

## Getting Started

```bash
git clone https://github.com/vikasranax/earth-monitor.git
cd earth-monitor
pnpm install
cp .env.example .env.local
```

### Environment Variables

```bash
# AI (required for copilot)
GROQ_API_KEY=gsk_...                    # or OPENAI_API_KEY=sk-...

# Markets (required for live prices)
TWELVEDATA_API_KEY=...                  # free tier: 800 req/day

# News (optional — Guardian only)
GUARDIAN_API_KEY=...
```

```bash
pnpm verify:env    # provider readiness board
pnpm dev           # http://localhost:3000
```

---

## Module Roadmap

| Module | Feature                            | State         |
| ------ | ---------------------------------- | ------------- |
| M01    | Foundation & DevEx                 | ✅            |
| M02    | Terminal UI Design System          | ⏳            |
| M03    | Data Layer & Ingestion             | ⏳            |
| M04    | Home Command Deck                  | ⏳            |
| M05    | Global Map & Country Intel         | ✅            |
| M05a   | Multilayer Map Engine              | ⏳            |
| M06    | News Engine                        | ✅            |
| M07    | Markets Suite                      | ✅            |
| M08    | Shipping & Straits                 | ⏳            |
| M09    | Airspace                           | ⏳            |
| M09a   | Hazard & Disaster Layer            | ✅ (partial)  |
| M09b   | Infrastructure & Outages           | ⏳            |
| M10    | Thematic Dashboards                | ⏳            |
| M11    | Alerts · Auth · Personalisation    | ✅ (scaffold) |
| M12    | AI Copilot                         | ✅            |
| M13    | Global Polish & Ship               | ⏳            |
| M14    | Power Structure & Leadership Intel | ⏳            |
| M15    | Space & Orbital Tracker            | ⏳            |
| M16    | Signal & Freedom Indices           | ⏳            |
| M17    | Multilingual Core                  | ✅ (copilot)  |

---

## Architecture

```
src/
  app/
    api/copilot/route.ts       ← AI copilot API (SSE streaming, intent detection)
    news/page.tsx              ← Categorized news (regions + topics)
    markets/page.tsx           ← Markets dashboard
  lib/
    providers/
      news.ts                  ← Unified Guardian + 18 regional RSS
      twelvedata.ts            ← Market quotes (62 symbols, 9 regions)
    markets-watchlist.ts       ← Symbol definitions + alias map
    fetch-with-cache.ts        ← Redis/Upstash caching
    rate-limit.ts              ← Per-provider rate limiting
  components/
    copilot/
      ChatPanel.tsx            ← Streaming copilot UI
      CopilotButton.tsx        ← Toggle button
```

---

## A Note on Neutrality

This project deliberately avoids taking sides on disputed territorial claims (e.g. Kashmir, Tibet, Taiwan). Every claimant's stated position is shown, none is presented as more authoritative than another. See `docs/M05-GLOBAL-MAP.md` for the full reasoning.

---

## Contributing

Contributions are welcome — see [`CONTRIBUTING.md`](CONTRIBUTING.md) for setup and the quality gate PRs must pass. Please also review our [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

---

## License

[AGPL-3.0](LICENSE) — if you run a modified version of this as a network service, you're required to release your source changes too. This keeps the project open even if forked into a hosted product.

---

## Acknowledgments

Built with significant development assistance from Claude (Anthropic) and Kimi (Moonshot AI).
