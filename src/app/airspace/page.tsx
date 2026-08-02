import { fetchAirspaceSnapshot } from "@/lib/providers/opensky";
import { airRegions } from "@/lib/air-regions";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel, KpiCard, LedBadge } from "@/components/terminal";

export default async function AirspacePage() {
  const result = await fetchAirspaceSnapshot();

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-5xl mx-auto w-full flex flex-col gap-4">
          <Panel
            title="Airspace"
            eyebrow="OPENSKY NETWORK"
            actions={
              <LedBadge
                status={result.error ? "warn" : "ok"}
                label={
                  result.error ? "ERROR" : result.authenticated ? "AUTHENTICATED" : "ANONYMOUS"
                }
                pulse={!result.error}
              />
            }
          >
            {result.error && (
              <p className="text-sm text-[var(--danger)] font-mono">{result.error}</p>
            )}
            {!result.error && !result.authenticated && (
              <p className="text-sm text-[var(--fg-2)] font-mono">
                Running on OpenSky&apos;s free anonymous access (lower rate limit). Add{" "}
                <code className="text-[var(--accent)]">OPENSKY_USER</code> /{" "}
                <code className="text-[var(--accent)]">OPENSKY_PASS</code> (free account at{" "}
                <a
                  href="https://opensky-network.org"
                  className="text-[var(--accent)] underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  opensky-network.org
                </a>
                ) to raise the limit — fully optional.
              </p>
            )}
          </Panel>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <KpiCard
              label="Aircraft Tracked (Global)"
              value={result.totalAircraft.toLocaleString()}
            />
            {airRegions.map((r) => {
              const c = result.regionCounts.find((rc) => rc.regionId === r.id);
              return <KpiCard key={r.id} label={r.name} value={String(c?.count ?? 0)} />;
            })}
          </div>
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
