import Link from "next/link";
import { readiness, serverEnv } from "@/lib/env";
import { fetchPowerStructure } from "@/lib/providers/power-structure";
import { isRedisArmed } from "@/lib/redis";
import { modules, type ModuleInfo } from "@/lib/modules";
import { ThemeProvider } from "@/components/theme-provider";
import {
  StatusBar,
  CommandPalette,
  Panel,
  KpiCard,
  LedBadge,
  RiskGauge,
  DataTable,
  Ticker,
  OnThisDay,
  WorldClock,
} from "@/components/terminal";

// Re-generate the homepage at most every 15 minutes (ISR). Without this, Next
// prerenders it once at build time and the date, leaders and readiness freeze.
export const revalidate = 900;

// Curated for variety and for India/Asia relevance: India, two nuclear powers
// in active tension (RU), the largest East Asian economy (CN), the US, plus
// Iran and North Korea for West/East Asia security context. Edit freely.
const HIGHLIGHT_COUNTRY_CODES = ["IN", "RU", "CN", "US", "IR", "KP"];

type Leaders = Awaited<ReturnType<typeof fetchPowerStructure>>["leaders"];

export default async function HomeCommandDeck() {
  const r = readiness();
  const redisArmed = isRedisArmed();
  const readinessPct = Math.round((r.armedCount / Math.max(r.totalCount, 1)) * 100);
  const modulesOnline = modules.filter((m) => m.status === "online").length;

  // Never let a Wikidata hiccup take down the whole homepage.
  let leaders: Leaders = [];
  try {
    leaders = (await fetchPowerStructure()).leaders;
  } catch {
    leaders = [];
  }

  // Groups whose keys exist in the schema but are not consumed by any code
  // are shown as NOT WIRED instead of a misleading 0/N.
  const groupStats = r.groups.map((g) => {
    const wired = g.items.filter((i) => i.wired !== false);
    return { id: g.id, label: g.label, wiredCount: wired.length, armed: wired.filter((i) => i.armed).length };
  });

  const tickerItems = groupStats
    .filter((g) => g.wiredCount > 0)
    .map((g) => ({ label: g.label, value: `${g.armed}/${g.wiredCount}` }));

  const sanctionsDesc = serverEnv.OPENSANCTIONS_API_KEY ? "· OpenSanctions" : "· Sample data";

  const navItems = [
    { href: "/dashboards", label: "Thematic Deck", icon: "◈", desc: "· Unified view" },
    { href: "/map", label: "Global Map", icon: "◎", desc: "· Multilayer map" },
    { href: "/news", label: "News Wire", icon: "⚡", desc: "· Guardian + RSS" },
    { href: "/markets", label: "Markets", icon: "$", desc: "· Yahoo · TwelveData" },
    { href: "/groups", label: "Groups", icon: "⊕", desc: "· G20 · BRICS · SCO" },
    { href: "/shipping", label: "Shipping", icon: "▣", desc: "· AIS Stream" },
    { href: "/airspace", label: "Airspace", icon: "✈", desc: "· OpenSky" },
    { href: "/hazard", label: "Hazard", icon: "▲", desc: "· USGS" },
    { href: "/infrastructure", label: "Infrastructure", icon: "◉", desc: "· Submarine cables" },
    { href: "/power-structure", label: "Power Structure", icon: "♛", desc: "· Wikidata live" },
    { href: "/space", label: "Space Tracker", icon: "☄", desc: "· Launch Library 2" },
    { href: "/signal-freedom", label: "Signal & Freedom", icon: "▤", desc: "· Press freedom" },
    { href: "/sanctions", label: "Sanctions", icon: "⚠", desc: sanctionsDesc },
    { href: "/governance", label: "Governance", icon: "⚖", desc: "· World Bank WGI" },
    { href: "/architecture", label: "Architecture", icon: "▥", desc: "· Wonders & heritage" },
    { href: "/visas", label: "Visas", icon: "✦", desc: "· Entry requirements" },
    { href: "/watchlist", label: "Watchlist", icon: "★", desc: "· Alerts & saves" },
    { href: "/elections", label: "Elections", icon: "🗳", desc: "· Calendar" },
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <Ticker items={tickerItems} />
        <main className="flex-1 p-4 max-w-6xl mx-auto w-full flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard label="Providers Armed" value={`${r.armedCount}/${r.totalCount}`} />
            <KpiCard label="Modules Online" value={`${modulesOnline}/${modules.length}`} />
            <KpiCard label="Cache" value={redisArmed ? "REDIS" : "IN-MEMORY"} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col gap-1 p-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-1)] hover:border-[var(--accent)] hover:bg-[var(--bg-2)] transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-[var(--accent)]">{item.icon}</span>
                  <span className="font-display text-sm font-semibold text-[var(--fg-0)] group-hover:text-[var(--accent)] transition-colors">
                    {item.label}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[var(--fg-2)]">{item.desc}</span>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Panel
              title="System Readiness"
              eyebrow="LIVE"
              className="md:col-span-1 flex items-center justify-center"
            >
              <RiskGauge score={readinessPct} label={`${r.armedCount}/${r.totalCount} ARMED`} />
            </Panel>
            <Panel title="Provider Groups" eyebrow="LIVE" className="md:col-span-2">
              <div className="flex flex-col gap-2">
                {groupStats.map((g) => {
                  const notWired = g.wiredCount === 0;
                  const allArmed = !notWired && g.armed === g.wiredCount;
                  return (
                    <div
                      key={g.id}
                      className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-0"
                    >
                      <span className="font-mono text-xs text-[var(--fg-1)]">{g.label}</span>
                      <LedBadge
                        status={notWired ? "idle" : allArmed ? "ok" : g.armed > 0 ? "warn" : "idle"}
                        label={notWired ? "NOT WIRED" : `${g.armed}/${g.wiredCount}`}
                      />
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>

          <Panel title="Power Structure Highlight" eyebrow="WIKIDATA · LIVE">
            {leaders.length === 0 ? (
              <p className="font-mono text-xs text-[var(--fg-2)]">
                Wikidata is unreachable right now — showing nothing rather than stale names.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {HIGHLIGHT_COUNTRY_CODES.map((code) => {
                  const countryLeaders = leaders.filter((l) => l.countryCode === code);
                  const top =
                    countryLeaders.find((l) => l.role === "head_of_state") ?? countryLeaders[0];
                  if (!top) return null;
                  return (
                    <div key={code} className="font-mono text-xs">
                      <div className="text-[var(--fg-2)] uppercase tracking-widest text-[10px]">
                        {code} · {top.countryName}
                      </div>
                      <div className="text-[var(--fg-0)]">{top.personName}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>

          <OnThisDay />
          <WorldClock />

          <Panel title="Module Manifest" eyebrow="CAMPAIGN ROADMAP">
            <DataTable<ModuleInfo>
              columns={[
                { key: "id", header: "ID" },
                { key: "name", header: "Module" },
                {
                  key: "status",
                  header: "Status",
                  align: "right" as const,
                  render: (m) => (
                    <LedBadge
                      status={m.status === "online" ? "ok" : "idle"}
                      label={m.status.toUpperCase()}
                      pulse={m.status === "online"}
                    />
                  ),
                },
              ]}
              rows={modules}
              getRowKey={(m) => m.id}
            />
          </Panel>
        </main>

        {/* ── Brand Footer ────────────────────────────── */}
        <footer className="border-t border-[var(--border)] py-6 text-center">
          <p className="font-mono text-[11px] tracking-[0.12em] text-[var(--fg-2)] leading-relaxed">
            जगत्-मन्थन · EARTH MONITOR · 地球监测 · مراقبة الأرض · 지구 모니터링
          </p>
          <p className="font-mono text-[10px] tracking-[0.08em] text-[var(--fg-muted)] mt-1">
            built by <span className="text-[var(--accent)]">VRX</span>
          </p>
        </footer>

        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
