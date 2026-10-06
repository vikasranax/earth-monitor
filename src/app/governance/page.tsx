"use client";

import { useState } from "react";
import { StatusBar, CommandPalette, Panel, DataTable, LedBadge } from "@/components/terminal";
import { ThemeProvider } from "@/components/theme-provider";
import type { CountryGovernanceProfile } from "@/lib/providers/world-bank";

type IndicatorKey =
  "politicalStability" | "controlOfCorruption" | "ruleOfLaw" | "voiceAndAccountability";

export default function GovernancePage() {
  const [countryCode, setCountryCode] = useState("");
  const [profile, setProfile] = useState<CountryGovernanceProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentCountries, setRecentCountries] = useState<CountryGovernanceProfile[]>([]);

  const handleFetch = async () => {
    if (!countryCode.trim() || countryCode.length !== 2) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/governance?code=${countryCode.toUpperCase()}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setProfile(null);
      } else {
        setProfile(data);
        setRecentCountries((prev) => {
          const filtered = prev.filter((p) => p.countryCode !== data.countryCode);
          return [data, ...filtered].slice(0, 5);
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load governance data");
    } finally {
      setLoading(false);
    }
  };

  const getIndicatorStatus = (value: number | null) => {
    if (value === null) return { label: "N/A", status: "warn" as const };
    if (value > 0.5) return { label: "Strong", status: "ok" as const };
    if (value > 0) return { label: "Moderate", status: "info" as const };
    return { label: "Weak", status: "danger" as const };
  };

  const indicators: { key: IndicatorKey; label: string; desc: string }[] = [
    { key: "politicalStability", label: "Political Stability", desc: "PV.EST" },
    { key: "controlOfCorruption", label: "Control of Corruption", desc: "CC.EST" },
    { key: "ruleOfLaw", label: "Rule of Law", desc: "RL.EST" },
    { key: "voiceAndAccountability", label: "Voice & Accountability", desc: "VA.EST" },
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[var(--fg-0)] font-['Space_Grotesk'] mb-2">
              Governance & Instability Index
            </h1>
            <p className="text-sm text-[var(--fg-2)] font-mono">
              World Bank governance indicators — raw political stability, corruption, rule of law,
              and accountability data (M43). Feeds the future composite instability index (M37).
            </p>
          </div>

          <Panel title="Country Lookup">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleFetch()}
                placeholder="Enter ISO code (e.g., US, IN, CN)"
                maxLength={2}
                className="flex-1 px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-2)] text-sm text-[var(--fg-0)] font-mono placeholder:text-[var(--fg-muted)] focus:outline-none focus:border-[var(--accent)] uppercase"
              />
              <button
                onClick={handleFetch}
                disabled={loading}
                className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white font-mono text-sm hover:bg-[var(--accent-dim)] disabled:opacity-50 transition-colors"
              >
                {loading ? "Loading…" : "Fetch"}
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-[var(--radius-sm)] border border-[var(--danger)] bg-[var(--danger)]/10">
                <p className="text-sm text-[var(--danger)] font-mono">{error}</p>
              </div>
            )}

            {profile && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4 p-3 rounded-[var(--radius-sm)] bg-[var(--bg-2)] border border-[var(--border)]">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--fg-0)] font-['Space_Grotesk']">
                      {profile.countryName}
                    </h2>
                    <p className="text-xs text-[var(--fg-muted)] font-mono">
                      {profile.countryCode}
                    </p>
                  </div>
                  <LedBadge status="info" label="World Bank Data" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {indicators.map((ind) => {
                    const value = profile[ind.key] as number | null;
                    const status = getIndicatorStatus(value);
                    const barColor =
                      status.status === "ok"
                        ? "var(--ok)"
                        : status.status === "info"
                          ? "var(--info)"
                          : status.status === "warn"
                            ? "var(--warn)"
                            : "var(--danger)";

                    return (
                      <Panel key={ind.key} title={ind.label}>
                        <div className="space-y-2">
                          <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-[var(--fg-0)] font-['Space_Grotesk']">
                              {value !== null ? value.toFixed(2) : "N/A"}
                            </span>
                            <LedBadge status={status.status} label={status.label} />
                          </div>
                          <p className="text-[10px] text-[var(--fg-muted)] font-mono">{ind.desc}</p>
                          <div className="h-2 bg-[var(--bg-3)] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${value !== null ? Math.abs(value) * 50 + 50 : 0}%`,
                                backgroundColor: barColor,
                              }}
                            />
                          </div>
                          <p className="text-[10px] text-[var(--fg-2)]">
                            Range: -2.5 (weak) to +2.5 (strong)
                          </p>
                        </div>
                      </Panel>
                    );
                  })}
                </div>

                <Panel title="Instability Assessment" className="mt-4">
                  <div className="p-4 bg-[var(--bg-1)] rounded-[var(--radius-sm)] border border-[var(--border)]">
                    <p className="text-sm text-[var(--fg-1)] font-mono leading-relaxed">
                      Composite instability is calculated from governance indicators. Lower scores
                      across political stability, rule of law, and accountability suggest higher
                      instability risk. Use these metrics alongside freedom indices and sanctions
                      data for comprehensive risk assessment.
                    </p>
                  </div>
                </Panel>
              </div>
            )}
          </Panel>

          {recentCountries.length > 0 && (
            <Panel title="Recently Viewed" className="mt-6">
              <DataTable<CountryGovernanceProfile>
                columns={[
                  {
                    key: "country",
                    header: "Country",
                    render: (row) => (
                      <div>
                        <p className="text-sm font-semibold text-[var(--fg-0)]">
                          {row.countryName}
                        </p>
                        <p className="text-[10px] text-[var(--fg-muted)] font-mono">
                          {row.countryCode}
                        </p>
                      </div>
                    ),
                  },
                  {
                    key: "stability",
                    header: "Political Stability",
                    render: (row) => {
                      const status = getIndicatorStatus(row.politicalStability);
                      return <LedBadge status={status.status} label={status.label} />;
                    },
                  },
                  {
                    key: "corruption",
                    header: "Corruption Control",
                    render: (row) => {
                      const status = getIndicatorStatus(row.controlOfCorruption);
                      return <LedBadge status={status.status} label={status.label} />;
                    },
                  },
                ]}
                rows={recentCountries}
                getRowKey={(row) => row.countryCode}
              />
            </Panel>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Panel title="Indicators">
              <ul className="text-xs text-[var(--fg-1)] space-y-1 font-mono">
                <li>• Political Stability (PV.EST)</li>
                <li>• Control of Corruption (CC.EST)</li>
                <li>• Rule of Law (RL.EST)</li>
                <li>• Voice & Accountability (VA.EST)</li>
              </ul>
            </Panel>
            <Panel title="Scale">
              <p className="text-xs text-[var(--fg-1)] font-mono">
                All indicators range from approximately -2.5 to +2.5, with higher values indicating
                better governance outcomes.
              </p>
            </Panel>
            <Panel title="Source">
              <div className="space-y-1 text-xs font-mono text-[var(--fg-1)]">
                <p>World Bank Worldwide Governance Indicators (WGI)</p>
                <p className="text-[var(--accent)]">data.worldbank.org</p>
              </div>
            </Panel>
          </div>
        </div>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
