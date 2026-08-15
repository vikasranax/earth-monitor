import { fetchUpcomingLaunches } from "@/lib/providers/space-launches";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel, LedBadge, DataTable } from "@/components/terminal";
import type { LaunchEvent } from "@/lib/providers/space-launches";

export default async function SpacePage() {
  const result = await fetchUpcomingLaunches();

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-5xl mx-auto w-full flex flex-col gap-4">
          <Panel
            title="Space & Orbital Tracker"
            eyebrow="LAUNCH LIBRARY 2"
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
              {result.launches.length} upcoming launches tracked · refreshed every 30 minutes.
            </p>
          </Panel>

          <Panel title="Upcoming Launches" eyebrow="NEXT 15">
            <DataTable<LaunchEvent>
              columns={[
                { key: "name", header: "Mission" },
                { key: "provider", header: "Provider" },
                { key: "locationName", header: "Site" },
                {
                  key: "net",
                  header: "Launch Window",
                  align: "right",
                  render: (l) => new Date(l.net).toLocaleString(),
                },
                { key: "status", header: "Status", align: "right" },
              ]}
              rows={result.launches}
              getRowKey={(l) => l.id}
              emptyLabel="No upcoming launches found"
            />
          </Panel>
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
