"use client";

import { useState, useEffect } from "react";
import { pressFreedomIndex } from "@/lib/press-freedom-index";
import { fetchVoidlyScores, type VoidlyCountryScore } from "@/lib/providers/voidly";
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
  const [voidlyScores, setVoidlyScores] = useState<VoidlyCountryScore[]>([]);
  const [voidlyLoading, setVoidlyLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadVoidly = async () => {
      setVoidlyLoading(true);
      const snapshot = await fetchVoidlyScores();
      if (isMounted && !snapshot.error) {
        setVoidlyScores(snapshot.scores);
      }
      if (isMounted) {
        setVoidlyLoading(false);
      }
    };
    loadVoidly();
    return () => {
      isMounted = false;
    };
  }, []);

  const getVoidlyData = (countryCode: string) => {
    return voidlyScores.find((v) => v.countryCode.toUpperCase() === countryCode.toUpperCase());
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-6xl mx-auto w-full flex flex-col gap-4">
          <Panel
            title="Signal & Freedom Indices"
            eyebrow="PRESS FREEDOM · RSF + VOIDLY"
            actions={<LedBadge status="warn" label="STARTER SET" />}
          >
            <p className="text-sm text-[var(--fg-2)] font-mono">
              {pressFreedomIndex.length} countries covered with RSF press freedom data. Digital
              freedom/censorship scores (Voidly) are cross-referenced by country code where
              available. This is a curated starter set, not the complete 180-country index.
            </p>
          </Panel>

          <Panel title="Press & Digital Freedom" eyebrow={`${pressFreedomIndex.length} COUNTRIES`}>
            <DataTable<PressFreedomEntry>
              columns={[
                { key: "countryName", header: "Country" },
                {
                  key: "tier",
                  header: "Press Status",
                  render: (e) => <LedBadge status={tierStatus[e.tier]} label={tierLabel[e.tier]} />,
                },
                {
                  key: "rank2026",
                  header: "RSF Rank",
                  align: "right",
                  render: (e) => (e.rank2026 ? `#${e.rank2026}` : "—"),
                },
                {
                  key: "voidly",
                  header: "Digital Freedom (Voidly)",
                  render: (e) => {
                    const v = getVoidlyData(e.countryCode);
                    if (!v) {
                      return (
                        <span className="text-[10px] text-[var(--fg-muted)] font-mono">
                          {voidlyLoading ? "Loading…" : "N/A"}
                        </span>
                      );
                    }

                    const statusColor =
                      v.freedomStatus === "Free"
                        ? "ok"
                        : v.freedomStatus === "Partly Free"
                          ? "warn"
                          : "danger";

                    const barColor =
                      v.freedomStatus === "Free"
                        ? "var(--ok)"
                        : v.freedomStatus === "Partly Free"
                          ? "var(--warn)"
                          : "var(--danger)";

                    return (
                      <div className="flex flex-col gap-1.5">
                        <LedBadge
                          status={statusColor as "ok" | "warn" | "danger"}
                          label={v.freedomStatus}
                        />
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-[var(--bg-3)] rounded-full overflow-hidden max-w-[60px]">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${Math.min(v.censorshipScore, 100)}%`,
                                backgroundColor: barColor,
                              }}
                            />
                          </div>
                          <span className="text-[10px] text-[var(--fg-2)] font-mono">
                            {v.censorshipScore}/100
                          </span>
                        </div>
                      </div>
                    );
                  },
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
