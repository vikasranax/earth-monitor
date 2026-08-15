import { pressFreedomIndex } from "@/lib/press-freedom-index";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel, LedBadge, DataTable } from "@/components/terminal";
import type { PressFreedomEntry } from "@/lib/press-freedom-index";

const tierStatus: Record<PressFreedomEntry["tier"], "ok" | "info" | "warn" | "danger"> = {
  good: "ok",
  satisfactory: "info",
  problematic: "warn",
  difficult: "danger",
  very_serious: "danger",
};

const tierLabel: Record<PressFreedomEntry["tier"], string> = {
  good: "Good",
  satisfactory: "Satisfactory",
  problematic: "Problematic",
  difficult: "Difficult",
  very_serious: "Very Serious",
};

export default function SignalFreedomPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-5xl mx-auto w-full flex flex-col gap-4">
          <Panel
            title="Signal & Freedom Indices"
            eyebrow="PRESS FREEDOM · RSF"
            actions={<LedBadge status="warn" label="STARTER SET" />}
          >
            <p className="text-sm text-[var(--fg-2)] font-mono">
              {pressFreedomIndex.length} countries covered — this is a curated starter set, not the
              complete 180-country RSF index. Each entry is individually sourced and dated. Full
              index:{" "}
              <a
                href="https://rsf.org/en/index"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--accent)] underline"
              >
                rsf.org/en/index
              </a>
            </p>
          </Panel>

          <Panel title="Press Freedom" eyebrow={`${pressFreedomIndex.length} COUNTRIES`}>
            <DataTable<PressFreedomEntry>
              columns={[
                { key: "countryName", header: "Country" },
                {
                  key: "tier",
                  header: "Status",
                  render: (e) => <LedBadge status={tierStatus[e.tier]} label={tierLabel[e.tier]} />,
                },
                {
                  key: "rank2026",
                  header: "2026 Rank",
                  align: "right",
                  render: (e) => (e.rank2026 ? `#${e.rank2026}` : "—"),
                },
                { key: "note", header: "Note" },
              ]}
              rows={pressFreedomIndex}
              getRowKey={(e) => e.countryCode}
            />
          </Panel>
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
