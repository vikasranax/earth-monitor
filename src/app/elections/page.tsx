import { getUpcomingElections } from "@/lib/elections-calendar";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel, LedBadge, DataTable } from "@/components/terminal";
import type { ElectionEvent } from "@/lib/elections-calendar";

export default function ElectionsPage() {
  const upcoming = getUpcomingElections();

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-5xl mx-auto w-full flex flex-col gap-4">
          <Panel title="Elections & Political Calendar" eyebrow="STARTER SET" actions={<LedBadge status="warn" label="VERIFY DATES" />}>
            <p className="text-sm text-[var(--fg-2)] font-mono">
              {upcoming.length} elections tracked — only fixed-cycle or high-confidence dates included.
              Verify against official electoral commission sources before relying on any date here.
            </p>
          </Panel>

          <Panel title="Upcoming" eyebrow={upcoming.length + " EVENTS"}>
            <DataTable<ElectionEvent>
              columns={[
                { key: "countryName", header: "Country" },
                { key: "electionType", header: "Type" },
                { key: "expectedDate", header: "Date", align: "right", render: (e) => new Date(e.expectedDate).toLocaleDateString() },
                {
                  key: "confidence",
                  header: "Confidence",
                  align: "right",
                  render: (e) => (
                    <LedBadge
                      status={e.confidence === "fixed_cycle" ? "ok" : "warn"}
                      label={e.confidence === "fixed_cycle" ? "FIXED" : "EXPECTED"}
                    />
                  ),
                },
              ]}
              rows={upcoming}
              getRowKey={(e) => e.countryCode + e.expectedDate}
            />
          </Panel>
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
