import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel, KpiCard, LedBadge } from "@/components/terminal";

const cables = [
  {
    id: "seame-we-3",
    name: "SEA-ME-WE 3",
    status: "operational",
    regions: "Asia-Europe",
    length: "39,000 km",
  },
  {
    id: "seame-we-4",
    name: "SEA-ME-WE 4",
    status: "operational",
    regions: "Asia-Europe",
    length: "20,000 km",
  },
  {
    id: "seame-we-5",
    name: "SEA-ME-WE 5",
    status: "operational",
    regions: "Asia-Europe",
    length: "20,000 km",
  },
  {
    id: "africa-coast",
    name: "Africa Coast to Europe",
    status: "operational",
    regions: "Africa-Europe",
    length: "17,000 km",
  },
  {
    id: "sat-3",
    name: "SAT-3/WASC",
    status: "operational",
    regions: "Africa-Europe",
    length: "14,350 km",
  },
  { id: "safe", name: "SAFE", status: "operational", regions: "Asia-Africa", length: "13,800 km" },
  {
    id: "flag",
    name: "FLAG Europe-Asia",
    status: "operational",
    regions: "Asia-Europe",
    length: "28,000 km",
  },
  {
    id: "tata-tgn",
    name: "Tata TGN-Pacific",
    status: "operational",
    regions: "Asia-Pacific",
    length: "23,000 km",
  },
];

const outages = [
  { region: "Red Sea Corridor", severity: "elevated" as const, reason: "Cable cuts reported" },
  {
    region: "Baltic Sea",
    severity: "monitored" as const,
    reason: "Suspicious anchor drag incidents",
  },
];

export default function InfrastructurePage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-5xl mx-auto w-full flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-2)]">
                M09b · Infrastructure & Outages
              </div>
              <h1 className="font-display text-2xl font-semibold text-[var(--fg-0)] mt-1">
                Infrastructure Monitor
              </h1>
            </div>
            <LedBadge status="ok" label="OPERATIONAL" pulse={false} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard label="Submarine Cables" value={String(cables.length)} />
            <KpiCard label="Operational" value="8" />
            <KpiCard label="Active Alerts" value={String(outages.length)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Panel title="Submarine Cable Health" eyebrow="TELEGEOGRAPHY · PUBLIC DATA">
              <div className="flex flex-col gap-2">
                {cables.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-2.5 rounded-[var(--radius-sm)] border border-[var(--border)] hover:bg-[var(--bg-2)] transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-display text-sm font-medium text-[var(--fg-0)] truncate">
                        {c.name}
                      </div>
                      <div className="font-mono text-[10px] text-[var(--fg-2)]">
                        {c.regions} · {c.length}
                      </div>
                    </div>
                    <LedBadge status="ok" label="UP" />
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Internet Outage Tracking" eyebrow="CLOUDFLARE RADAR · PLANNED">
              <div className="flex flex-col gap-2">
                {outages.map((o, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-[var(--radius-sm)] border border-[var(--border)]"
                  >
                    <div>
                      <div className="font-display text-sm font-medium text-[var(--fg-0)]">
                        {o.region}
                      </div>
                      <div className="font-mono text-[10px] text-[var(--fg-2)]">{o.reason}</div>
                    </div>
                    <LedBadge
                      status={o.severity === "elevated" ? "warn" : "info"}
                      label={o.severity.toUpperCase()}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-1)]">
                <p className="font-mono text-[10px] text-[var(--fg-2)] leading-relaxed">
                  Live outage detection requires Cloudflare Radar API integration. Add{" "}
                  <code className="text-[var(--accent)]">CLOUDFLARE_API_TOKEN</code> to .env.local
                  to enable.
                </p>
              </div>
            </Panel>
          </div>
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
