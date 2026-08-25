import { fetchUpcomingLaunches } from "@/lib/providers/space-launches";
import { fetchNasaSnapshot } from "@/lib/providers/nasa";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel, LedBadge, DataTable } from "@/components/terminal";
import type { LaunchEvent } from "@/lib/providers/space-launches";

export default async function SpacePage() {
  const [launches, nasa] = await Promise.all([
    fetchUpcomingLaunches(),
    fetchNasaSnapshot(),
  ]);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-5xl mx-auto w-full flex flex-col gap-4">
          <Panel
            title="Space & Orbital Tracker"
            eyebrow="LAUNCH LIBRARY 2 + NASA"
            actions={
              <LedBadge
                status={launches.error ? "warn" : "ok"}
                label={launches.error ? "ERROR" : "LIVE"}
                pulse={!launches.error}
              />
            }
          >
            {launches.error && (
              <p className="text-sm text-[var(--danger)] font-mono">{launches.error}</p>
            )}
            <p className="text-sm text-[var(--fg-2)] font-mono">
              {launches.launches.length} upcoming launches tracked · refreshed every 30 minutes.
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
              rows={launches.launches}
              getRowKey={(l) => l.id}
              emptyLabel="No upcoming launches found"
            />
          </Panel>

          <Panel
            title="NASA Astronomy Picture of the Day"
            eyebrow="APOD"
            actions={
              <LedBadge
                status={nasa.error ? "warn" : nasa.apod ? "ok" : "idle"}
                label={nasa.error ? "ERROR" : nasa.cached ? "CACHED" : "LIVE"}
                pulse={nasa.apod != null && !nasa.error}
              />
            }
          >
            {nasa.error && (
              <p className="text-sm text-[var(--danger)] font-mono mb-2">{nasa.error}</p>
            )}
            {nasa.apod ? (
              <div className="flex flex-col gap-3">
                {nasa.apod.media_type === "image" ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={nasa.apod.url}
                      alt={nasa.apod.title}
                      className="w-full max-h-96 object-contain rounded-[var(--radius-sm)] border border-[var(--border)]"
                      loading="lazy"
                    />
                  </>
                ) : (
                  <div className="aspect-video bg-[var(--bg-2)] rounded-[var(--radius-sm)] border border-[var(--border)] flex items-center justify-center">
                    <p className="text-sm text-[var(--fg-2)] font-mono">Video: {nasa.apod.url}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-base font-semibold text-[var(--fg-0)]">{nasa.apod.title}</h3>
                  {nasa.apod.copyright && (
                    <p className="text-xs text-[var(--fg-muted)] font-mono">
                      &copy; {nasa.apod.copyright}
                    </p>
                  )}
                  <p className="text-sm text-[var(--fg-1)] mt-1 leading-relaxed">
                    {nasa.apod.explanation}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--fg-2)] font-mono text-center py-4">
                No APOD data available.
              </p>
            )}
          </Panel>

          <Panel
            title="Near-Earth Objects"
            eyebrow="NEO"
            actions={
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[var(--fg-2)]">
                  {nasa.neo.count} today
                </span>
                {nasa.neo.hazardous > 0 && (
                  <LedBadge status="warn" label={`${nasa.neo.hazardous} HAZARDOUS`} pulse />
                )}
              </div>
            }
          >
            {nasa.neo.objects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {nasa.neo.objects.map((obj) => (
                  <div
                    key={obj.id}
                    className="p-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-1)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[var(--fg-0)]">{obj.name}</span>
                      {obj.is_potentially_hazardous_asteroid && (
                        <span className="text-[10px] font-mono text-[var(--danger)] bg-[var(--danger)]/10 px-1.5 py-0.5 rounded">
                          HAZARDOUS
                        </span>
                      )}
                    </div>
                    {obj.close_approach_data && obj.close_approach_data[0] && (
                      <p className="text-xs text-[var(--fg-2)] font-mono mt-1">
                        Miss: {Number(obj.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km
                        {" · "}
                        {obj.close_approach_data[0].miss_distance.lunar} lunar distances
                      </p>
                    )}
                    {obj.estimated_diameter?.kilometers && (
                      <p className="text-xs text-[var(--fg-muted)] font-mono mt-0.5">
                        Est. diameter: {obj.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)}–
                        {obj.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--fg-2)] font-mono text-center py-4">
                No near-earth objects tracked for today.
              </p>
            )}
          </Panel>
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
