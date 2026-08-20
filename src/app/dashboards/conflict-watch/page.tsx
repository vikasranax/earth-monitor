import { fetchGuardianNews } from "@/lib/providers/guardian";
import { fetchAirspaceSnapshot } from "@/lib/providers/opensky";
import { fetchLiveUnrestGuardian } from "@/lib/providers/unrest-guardian";
import { disputedTerritories } from "@/lib/disputed-territories";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel, KpiCard, LedBadge } from "@/components/terminal";

const TENSION_REGION_IDS = [
  "taiwan-strait",
  "eastern-europe",
  "west-asia",
  "south-china-sea",
  "korean-peninsula",
  "kashmir",
];

export default async function ConflictWatchPage() {
  const [news, airspace, unrest] = await Promise.all([
    fetchGuardianNews("conflict OR war OR military OR unrest"),
    fetchAirspaceSnapshot(),
    fetchLiveUnrestGuardian(),
  ]);

  const tensionCounts = airspace.regionCounts.filter((r: { regionId: string; count: number }) =>
    TENSION_REGION_IDS.includes(r.regionId),
  );
  const totalTensionAircraft = tensionCounts.reduce(
    (sum: number, r: { count: number }) => sum + r.count,
    0,
  );

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-5xl mx-auto w-full flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard label="Aircraft in Tension Zones" value={String(totalTensionAircraft)} />
            <KpiCard
              label="Disputed Territories Tracked"
              value={String(disputedTerritories.length)}
            />
            <KpiCard label="Unrest Countries (Live)" value={String(unrest.markers.length)} />
          </div>

          <Panel
            title="Conflict & Security News"
            eyebrow="GUARDIAN API"
            actions={
              <LedBadge
                status={news.armed ? "ok" : "idle"}
                label={news.armed ? "LIVE" : "NOT ARMED"}
                pulse={news.armed}
              />
            }
          >
            {!news.armed && (
              <p className="text-sm text-[var(--fg-2)] font-mono">
                Add GUARDIAN_API_KEY to .env.local to see live conflict/security headlines here.
              </p>
            )}
            <div className="flex flex-col gap-3 mt-2">
              {news.articles
                .slice(0, 8)
                .map((a: { id: string; url: string; section: string; title: string }) => (
                  <a
                    key={a.id}
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block border-b border-[var(--border)] pb-3 last:border-0 hover:bg-[var(--bg-2)] transition-colors -mx-2 px-2 rounded-[var(--radius-sm)]"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
                      {a.section}
                    </span>
                    <h3 className="font-display text-base font-semibold text-[var(--fg-0)] mt-1">
                      {a.title}
                    </h3>
                  </a>
                ))}
            </div>
          </Panel>

          <Panel title="Airspace Tension Zones" eyebrow="OPENSKY">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {tensionCounts.map((r: { regionId: string; count: number }) => (
                <div
                  key={r.regionId}
                  className="flex justify-between border-b border-[var(--border)] py-2 font-mono text-sm"
                >
                  <span className="text-[var(--fg-1)]">{r.regionId}</span>
                  <span className="text-[var(--fg-0)]">{r.count}</span>
                </div>
              ))}
            </div>
          </Panel>
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
