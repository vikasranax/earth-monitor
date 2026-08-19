import { architectureSites } from "@/lib/architecture-wonders";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel, LedBadge, DataTable } from "@/components/terminal";
import type { ArchitectureSite } from "@/lib/architecture-wonders";

const categoryLabel: Record<string, string> = {
  modern: "Modern Marvel",
  wonder: "Wonder of the World",
  unesco: "UNESCO Heritage",
  "heritage-india": "ASI / India Heritage",
};

const categoryStatus: Record<string, "ok" | "info" | "warn" | "danger"> = {
  modern: "info",
  wonder: "ok",
  unesco: "warn",
  "heritage-india": "danger",
};

export default function ArchitecturePage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-5xl mx-auto w-full flex flex-col gap-4">
          <Panel title="Architecture & Wonders" eyebrow="LEARN THE EARTH">
            <p className="text-sm text-[var(--fg-2)] font-mono">
              {architectureSites.length} sites — modern architectural marvels, the New 7 Wonders
              of the World, ASI heritage sites in India, and other UNESCO landmarks.
            </p>
          </Panel>

          <Panel title="All Sites" eyebrow={architectureSites.length + " ENTRIES"}>
            <DataTable<ArchitectureSite>
              columns={[
                { key: "name", header: "Site" },
                { key: "location", header: "Location" },
                { key: "country", header: "Country" },
                {
                  key: "category",
                  header: "Category",
                  align: "right",
                  render: (s) => <LedBadge status={categoryStatus[s.category] ?? "info"} label={categoryLabel[s.category] ?? s.category} />,
                },
              ]}
              rows={architectureSites}
              getRowKey={(s) => s.name}
            />
          </Panel>
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
