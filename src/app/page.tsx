import Link from "next/link";
import { readiness } from "@/lib/env";
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
} from "@/components/terminal";

export default async function HomeCommandDeck() {
  const r = readiness();
  const redisArmed = isRedisArmed();
  const readinessPct = Math.round((r.armedCount / r.totalCount) * 100);
  const modulesOnline = modules.filter((m) => m.status === "online").length;
  const tickerItems = r.groups.map((g) => ({
    label: g.label,
    value: `${g.items.filter((i) => i.armed).length}/${g.items.length}`,
  }));

  const navItems = [
    { href: "/dashboards", label: "Thematic Deck", icon: "◈", desc: "M10 · Unified view" },
    { href: "/map", label: "Global Map", icon: "◎", desc: "M05 · Multilayer globe" },
    { href: "/news", label: "News Wire", icon: "⚡", desc: "M06 · Guardian API" },
    { href: "/markets", label: "Markets", icon: "$", desc: "M07 · TwelveData" },
    { href: "/shipping", label: "Shipping", icon: "▣", desc: "M08 · AIS Stream" },
    { href: "/airspace", label: "Airspace", icon: "✈", desc: "M09 · OpenSky" },
    { href: "/hazard", label: "Hazard", icon: "▲", desc: "M09a · USGS" },
    {
      href: "/infrastructure",
      label: "Infrastructure",
      icon: "◉",
      desc: "M09b · Cables & outages",
    },
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
              <RiskGauge score={readinessPct} label="PROVIDERS ARMED" />
            </Panel>
            <Panel title="Provider Groups" eyebrow="LIVE" className="md:col-span-2">
              <div className="flex flex-col gap-2">
                {r.groups.map((g) => {
                  const armedCount = g.items.filter((i) => i.armed).length;
                  const allArmed = armedCount === g.items.length;
                  return (
                    <div
                      key={g.id}
                      className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-0"
                    >
                      <span className="font-mono text-xs text-[var(--fg-1)]">{g.label}</span>
                      <LedBadge
                        status={allArmed ? "ok" : armedCount > 0 ? "warn" : "idle"}
                        label={`${armedCount}/${g.items.length}`}
                      />
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>

          <Panel title="Module Manifest" eyebrow="CAMPAIGN M01–M17">
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
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
