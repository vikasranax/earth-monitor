import { fetchAirspaceSnapshot } from "@/lib/providers/opensky";
import { airRegions } from "@/lib/air-regions";
import { serverEnv } from "@/lib/env";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel, KpiCard, LedBadge } from "@/components/terminal";

export default async function AirspacePage() {
  const result = await fetchAirspaceSnapshot();
  // Distinguish "no credentials configured" from "configured but token failed" —
  // the provider itself falls back to anonymous in both cases, so without this
  // the page couldn't tell the user their creds are broken.
  const credsConfigured = Boolean(serverEnv.OPENSKY_CLIENT_ID && serverEnv.OPENSKY_CLIENT_SECRET);
  const authFailed = credsConfigured && !result.authenticated && !result.error;

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
                status={result.error || authFailed ? "warn" : "ok"}
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
            {authFailed && (
              <p className="text-sm text-[var(--warn)] font-mono">
                OPENSKY_CLIENT_ID / OPENSKY_CLIENT_SECRET are set, but the OpenSky token
                request failed (invalid_client). Check that both values are copied exactly
                from your OpenSky account dashboard — falling back to anonymous access
                (lower rate limit) until fixed.
              </p>
            )}
            {!result.error && !authFailed && !result.authenticated && (
              <p className="text-sm text-[var(--fg-2)] font-mono">
                Running on OpenSky&apos;s free anonymous access (lower rate limit). Add{" "}
                <code className="text-[var(--accent)]">OPENSKY_CLIENT_ID</code> /{" "}
                <code className="text-[var(--accent)]">OPENSKY_CLIENT_SECRET</code> (free
                OAuth2 client credentials at{" "}
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
