"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel, KpiCard, LedBadge } from "@/components/terminal";

interface DomainStatus {
  id: string;
  label: string;
  href: string;
  icon: string;
  armed: boolean;
  liveCount: number;
  totalCount: number;
  accent: string;
}

const domains: DomainStatus[] = [
  {
    id: "geopolitics",
    label: "Geopolitics",
    href: "/news",
    icon: "⚡",
    armed: true,
    liveCount: 1,
    totalCount: 1,
    accent: "var(--accent)",
  },
  {
    id: "markets",
    label: "Markets",
    href: "/markets",
    icon: "$",
    armed: false,
    liveCount: 0,
    totalCount: 3,
    accent: "var(--ok)",
  },
  {
    id: "movement",
    label: "Movement",
    href: "/shipping",
    icon: "▣",
    armed: false,
    liveCount: 0,
    totalCount: 2,
    accent: "var(--info)",
  },
  {
    id: "airspace",
    label: "Airspace",
    href: "/airspace",
    icon: "✈",
    armed: true,
    liveCount: 1,
    totalCount: 1,
    accent: "var(--warn)",
  },
  {
    id: "hazard",
    label: "Hazard",
    href: "/hazard",
    icon: "▲",
    armed: false,
    liveCount: 0,
    totalCount: 3,
    accent: "var(--danger)",
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    href: "/infrastructure",
    icon: "◉",
    armed: false,
    liveCount: 0,
    totalCount: 2,
    accent: "#8b7cf6",
  },
];

function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC");
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function DashboardHubPage() {
  const clock = useClock();
  const armedDomains = domains.filter((d) => d.armed).length;
  const totalProviders = domains.reduce((s, d) => s + d.totalCount, 0);
  const liveProviders = domains.reduce((s, d) => s + d.liveCount, 0);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-7xl mx-auto w-full flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-2)]">
                M10 · Thematic Deck
              </div>
              <h1 className="font-display text-2xl font-semibold text-[var(--fg-0)] mt-1">
                Unified Intelligence Surface
              </h1>
            </div>
            <div className="font-mono text-xs text-[var(--fg-2)]">{clock}</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard label="Domains Armed" value={`${armedDomains}/${domains.length}`} />
            <KpiCard label="Providers Live" value={`${liveProviders}/${totalProviders}`} />
            <KpiCard label="Modules Online" value="4/20" />
            <KpiCard label="Cache Mode" value="IN-MEMORY" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((d) => (
              <Link
                key={d.id}
                href={d.href}
                className="group relative flex flex-col gap-3 p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-1)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-2)] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-sm)] font-mono text-sm font-bold"
                      style={{ background: d.accent + "15", color: d.accent }}
                    >
                      {d.icon}
                    </span>
                    <span className="font-display text-sm font-semibold text-[var(--fg-0)]">
                      {d.label}
                    </span>
                  </div>
                  <LedBadge
                    status={d.armed ? "ok" : "idle"}
                    label={d.armed ? "LIVE" : "STANDBY"}
                    pulse={d.armed}
                  />
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--fg-2)] uppercase tracking-widest">
                  <span style={{ color: d.accent }}>
                    {d.liveCount}/{d.totalCount}
                  </span>
                  <span>providers</span>
                </div>
                <div className="h-1 w-full bg-[var(--bg-3)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(d.liveCount / Math.max(d.totalCount, 1)) * 100}%`,
                      background: d.accent,
                    }}
                  />
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-[var(--accent)]">
                  OPEN →
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Panel title="Global Map" eyebrow="M05" className="lg:col-span-2">
              <div className="flex flex-col gap-3">
                <p className="text-sm text-[var(--fg-2)] font-mono">
                  Interactive multilayer globe with country dossiers, disputed territories, and
                  unrest markers.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Conflict",
                    "Shipping",
                    "Airspace",
                    "Markets",
                    "Disasters",
                    "Infrastructure",
                  ].map((layer) => (
                    <span
                      key={layer}
                      className="px-2 py-1 rounded-[var(--radius-sm)] border border-[var(--border)] font-mono text-[10px] text-[var(--fg-2)]"
                    >
                      {layer}
                    </span>
                  ))}
                </div>
                <Link
                  href="/map"
                  className="inline-flex items-center gap-2 self-start px-3 py-1.5 bg-[var(--accent)] text-white font-mono text-xs rounded-[var(--radius-sm)] hover:bg-[var(--accent-dim)] transition-colors"
                >
                  OPEN MAP →
                </Link>
              </div>
            </Panel>
            <Panel title="System Status" eyebrow="M01–M04">
              <div className="flex flex-col gap-2">
                {["Foundation", "UI Design System", "Data Layer", "Command Deck"].map((label) => (
                  <div key={label} className="flex items-center justify-between py-1">
                    <span className="font-mono text-xs text-[var(--fg-1)]">{label}</span>
                    <LedBadge status="ok" label="ONLINE" pulse={true} />
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
