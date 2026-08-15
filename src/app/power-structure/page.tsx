import { fetchPowerStructure } from "@/lib/providers/power-structure";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel, LedBadge } from "@/components/terminal";

export default async function PowerStructurePage() {
  const result = await fetchPowerStructure();

  const byCountry = new Map<string, typeof result.leaders>();
  for (const leader of result.leaders) {
    const existing = byCountry.get(leader.countryCode) ?? [];
    existing.push(leader);
    byCountry.set(leader.countryCode, existing);
  }
  const countryCodes = Array.from(byCountry.keys()).sort();

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-6xl mx-auto w-full flex flex-col gap-4">
          <Panel
            title="Power Structure"
            eyebrow="WIKIDATA · LIVE"
            actions={
              <LedBadge
                status={result.error ? "warn" : "ok"}
                label={result.error ? "ERROR" : result.cached ? "CACHED" : "LIVE"}
                pulse={!result.error}
              />
            }
          >
            {result.error && (
              <p className="text-sm text-[var(--danger)] font-mono">{result.error}</p>
            )}
            <p className="text-sm text-[var(--fg-2)] font-mono">
              {countryCodes.length} countries tracked · {result.leaders.length} officeholders
              found · refreshed every 6 hours from Wikidata.
            </p>
          </Panel>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {countryCodes.map((code) => {
              const leaders = byCountry.get(code) ?? [];
              const state = leaders.find((l) => l.role === "head_of_state");
              const gov = leaders.find((l) => l.role === "head_of_government");
              const name = leaders[0]?.countryName ?? code;

              return (
                <Panel key={code} title={name} eyebrow={code}>
                  <div className="flex flex-col gap-2 font-mono text-sm">
                    <div className="flex justify-between border-b border-[var(--border)] pb-2">
                      <span className="text-[var(--fg-2)]">Head of State</span>
                      <span className="text-[var(--fg-0)] text-right">
                        {state ? state.personName : "Unconfirmed"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--fg-2)]">Head of Government</span>
                      <span className="text-[var(--fg-0)] text-right">
                        {gov ? gov.personName : "Unconfirmed"}
                      </span>
                    </div>
                  </div>
                </Panel>
              );
            })}
          </div>
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
