import { fetchEarthquakes } from "@/lib/providers/usgs";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel, KpiCard, LedBadge } from "@/components/terminal";

export default async function HazardPage() {
  const quakes = await fetchEarthquakes("week");
  const majorCount = quakes.events.filter((e) => e.magnitude >= 6).length;
  const moderateCount = quakes.events.filter((e) => e.magnitude >= 4 && e.magnitude < 6).length;

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-5xl mx-auto w-full flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-2)]">
                M09a · Hazard & Disaster
              </div>
              <h1 className="font-display text-2xl font-semibold text-[var(--fg-0)] mt-1">
                Hazard Monitor
              </h1>
            </div>
            <LedBadge
              status={quakes.error ? "warn" : "ok"}
              label={quakes.error ? "DEGRADED" : "LIVE"}
              pulse={!quakes.error}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard label="Events (7d)" value={String(quakes.count)} />
            <KpiCard label="Major (≥6.0)" value={String(majorCount)} />
            <KpiCard label="Moderate (4.0–5.9)" value={String(moderateCount)} />
          </div>

          <Panel title="Significant Earthquakes" eyebrow="USGS · PAST 7 DAYS">
            {quakes.error && (
              <p className="text-sm text-[var(--danger)] font-mono">{quakes.error}</p>
            )}
            {!quakes.error && quakes.events.length === 0 && (
              <p className="text-sm text-[var(--fg-2)] font-mono">
                No significant earthquakes in the past 7 days.
              </p>
            )}
            <div className="flex flex-col gap-2">
              {quakes.events.map((e) => (
                <a
                  key={e.id}
                  href={e.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-3 rounded-[var(--radius-sm)] border border-[var(--border)] hover:bg-[var(--bg-2)] transition-colors"
                >
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-[var(--radius-sm)] font-display text-lg font-bold shrink-0"
                    style={{
                      background:
                        e.magnitude >= 6
                          ? "rgba(255,77,79,0.15)"
                          : e.magnitude >= 5
                            ? "rgba(245,197,66,0.15)"
                            : "rgba(59,167,255,0.15)",
                      color:
                        e.magnitude >= 6
                          ? "var(--danger)"
                          : e.magnitude >= 5
                            ? "var(--warn)"
                            : "var(--info)",
                    }}
                  >
                    {e.magnitude.toFixed(1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm font-medium text-[var(--fg-0)] truncate">
                      {e.place}
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[10px] text-[var(--fg-2)] mt-1">
                      <span>{new Date(e.time).toLocaleString()}</span>
                      <span>·</span>
                      <span>{e.depth.toFixed(1)} km depth</span>
                      {e.alert && (
                        <span
                          className="px-1.5 py-0.5 rounded-[var(--radius-sm)] font-bold"
                          style={{
                            background:
                              e.alert === "red"
                                ? "rgba(255,77,79,0.2)"
                                : e.alert === "orange"
                                  ? "rgba(255,107,53,0.2)"
                                  : e.alert === "yellow"
                                    ? "rgba(245,197,66,0.2)"
                                    : "rgba(46,204,113,0.2)",
                            color:
                              e.alert === "red"
                                ? "var(--danger)"
                                : e.alert === "orange"
                                  ? "#ff6b35"
                                  : e.alert === "yellow"
                                    ? "var(--warn)"
                                    : "var(--ok)",
                          }}
                        >
                          {e.alert.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </Panel>
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
