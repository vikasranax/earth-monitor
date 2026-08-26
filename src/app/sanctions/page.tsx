"use client";

import { useState } from "react";
import { StatusBar, CommandPalette, Panel, DataTable, LedBadge } from "@/components/terminal";
import { ThemeProvider } from "@/components/theme-provider";
import type { SanctionEntity } from "@/lib/providers/opensanctions";

export default function SanctionsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SanctionEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [usingSampleData, setUsingSampleData] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setUsingSampleData(false);
    setResults([]);
    try {
      const res = await fetch(`/api/sanctions?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        if (data.error.includes("sample")) {
          setUsingSampleData(true);
        }
      } else {
        setResults(data.entities || []);
        setTotal(data.total || 0);
        if (data.entities?.length > 0 && data.entities[0]?.datasets?.includes("sample")) {
          setUsingSampleData(true);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const getLedStatus = (type: string) => {
    switch (type) {
      case "Person": return "info";
      case "Organization": return "warn";
      case "Company": return "info";
      case "Vessel": return "ok";
      case "Aircraft": return "danger";
      default: return "warn";
    }
  };

  const formatArray = (arr: string[]) => (
    <span className="text-[10px] font-mono text-[var(--fg-2)]">
      {arr.slice(0, 3).join(", ")}
      {arr.length > 3 && ` (+${arr.length - 3})`}
    </span>
  );

  const testQueries = [
    { label: "Russia", query: "Russia" },
    { label: "Iran", query: "Iran" },
    { label: "North Korea", query: "North Korea" },
    { label: "Putin", query: "Putin" },
    { label: "Belarus", query: "Belarus" },
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[var(--fg-0)] font-['Space_Grotesk'] mb-2">
              Sanctions & Watchlists
            </h1>
            <p className="text-sm text-[var(--fg-2)] font-mono">
              Search international sanctions databases, PEPs, and watchlists (OpenSanctions)
            </p>
          </div>

          <Panel title="Entity Search">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter name, organization, vessel, or country..."
                className="flex-1 px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-2)] text-sm text-[var(--fg-0)] font-mono placeholder:text-[var(--fg-muted)] focus:outline-none focus:border-[var(--accent)]"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white font-mono text-sm hover:bg-[var(--accent-dim)] disabled:opacity-50 transition-colors"
              >
                {loading ? "Searching…" : "Search"}
              </button>
            </div>

            {usingSampleData && (
              <div className="mb-4 p-3 rounded-[var(--radius-sm)] border border-[var(--warn)] bg-[var(--warn)]/10">
                <div className="flex items-start gap-2">
                  <LedBadge status="warn" label="SAMPLE DATA" />
                  <div className="flex-1">
                    <p className="text-sm text-[var(--fg-1)] font-mono">
                      OpenSanctions API requires authentication. Showing sample data for demonstration.
                    </p>
                    <p className="text-xs text-[var(--fg-muted)] font-mono mt-1">
                      To use live data, add <code className="text-[var(--accent)]">OPENSANCTIONS_API_KEY</code> to your environment variables.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Test Queries */}
            <div className="mb-4">
              <p className="text-xs text-[var(--fg-2)] font-mono mb-2">Quick Test Queries:</p>
              <div className="flex flex-wrap gap-2">
                {testQueries.map((t) => (
                  <button
                    key={t.query}
                    onClick={() => {
                      setQuery(t.query);
                      setTimeout(() => handleSearch(), 100);
                    }}
                    className="px-2 py-1 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-2)] text-[10px] text-[var(--fg-1)] font-mono hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {error && !usingSampleData && (
              <div className="p-3 rounded-[var(--radius-sm)] border border-[var(--danger)] bg-[var(--danger)]/10">
                <p className="text-sm text-[var(--danger)] font-mono">{error}</p>
              </div>
            )}

            {!loading && results.length === 0 && query && !usingSampleData && (
              <div className="p-8 text-center border border-[var(--border)] rounded-[var(--radius-sm)] bg-[var(--bg-1)]">
                <p className="text-sm text-[var(--fg-2)] font-mono">
                  No entities found for &quot;{query}&quot;
                </p>
                <p className="text-xs text-[var(--fg-muted)] font-mono mt-2">
                  Try searching for sanctioned countries like Russia, Iran, North Korea, or Syria
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-[var(--fg-2)] font-mono">
                    Found {total} {total === 1 ? "entity" : "entities"}
                  </p>
                  <LedBadge status={usingSampleData ? "warn" : "ok"} label={usingSampleData ? "SAMPLE DATA" : "LIVE DATA"} />
                </div>
                <DataTable<SanctionEntity>
                  columns={[
                    { 
                      key: "name", 
                      header: "Name", 
                      render: (row) => (
                        <div>
                          <p className="text-sm font-semibold text-[var(--fg-0)]">{row.name}</p>
                          {row.remarks && (
                            <p className="text-[10px] text-[var(--fg-muted)] mt-0.5">{row.remarks}</p>
                          )}
                        </div>
                      )
                    },
                    { 
                      key: "type", 
                      header: "Type", 
                      render: (row) => <LedBadge status={getLedStatus(row.type)} label={row.type} />
                    },
                    { 
                      key: "countries", 
                      header: "Countries", 
                      render: (row) => formatArray(row.countries)
                    },
                    { 
                      key: "programs", 
                      header: "Programs", 
                      render: (row) => formatArray(row.programs)
                    },
                    { 
                      key: "datasets", 
                      header: "Sources", 
                      render: (row) => formatArray(row.datasets)
                    },
                  ]}
                  rows={results}
                  getRowKey={(row) => row.id}
                />
              </div>
            )}
          </Panel>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Panel title="Coverage">
              <div className="space-y-2 text-xs font-mono text-[var(--fg-1)]">
                <div className="flex justify-between">
                  <span className="text-[var(--fg-2)]">Datasets:</span>
                  <span className="text-[var(--accent)]">12+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--fg-2)]">Sources:</span>
                  <span className="text-[var(--accent)]">OFAC, UN, EU</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--fg-2)]">Types:</span>
                  <span className="text-[var(--accent)]">PEPs, Entities</span>
                </div>
              </div>
            </Panel>

            <Panel title="Data Sources">
              <div className="flex flex-wrap gap-1">
                {["OFAC", "UN", "EU", "UK", "INTERPOL"].map((source) => (
                  <LedBadge key={source} status="info" label={source} />
                ))}
              </div>
            </Panel>

            <Panel title="Use Cases">
              <ul className="text-xs text-[var(--fg-1)] space-y-1 font-mono">
                <li>• Compliance screening</li>
                <li>• Due diligence</li>
                <li>• Risk assessment</li>
                <li>• Investigative research</li>
              </ul>
            </Panel>
          </div>
        </div>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
