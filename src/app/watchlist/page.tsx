"use client";

import { useEffect, useState } from "react";
import { useWatchlistStore } from "@/stores/watchlist";
import { watchlist as allSymbols } from "@/lib/markets-watchlist";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel, KpiCard } from "@/components/terminal";
import type { MarketsFetchResult, MarketQuote } from "@/lib/providers/yahoo-finance";

export default function WatchlistPage() {
  const { savedSymbols, alertRules, addSymbol, removeSymbol, addAlertRule, removeAlertRule } =
    useWatchlistStore();
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [threshold, setThreshold] = useState(5);
  const [direction, setDirection] = useState<"above" | "below">("above");

  useEffect(() => {
    fetch("/api/markets/snapshot")
      .then((res) => res.json())
      .then((data: MarketsFetchResult) => setQuotes(data.quotes))
      .catch(() => setQuotes([]));
  }, []);

  const savedQuotes = quotes.filter((q) => savedSymbols.includes(q.symbol));

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-4xl mx-auto w-full flex flex-col gap-4">
          <Panel title="My Watchlist" eyebrow="DEVICE-LOCAL">
            <p className="text-sm text-[var(--fg-2)] font-mono">
              Saved to this browser only — no login required. {savedSymbols.length} symbols saved.
            </p>
          </Panel>

          <Panel title="Add Symbol" eyebrow="WATCHLIST">
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="bg-[var(--bg-2)] border border-[var(--border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm font-mono text-[var(--fg-0)]"
              >
                <option value="">Select a symbol…</option>
                {allSymbols.map((s) => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.label} ({s.symbol})
                  </option>
                ))}
              </select>
              <button
                onClick={() => selectedSymbol && addSymbol(selectedSymbol)}
                disabled={!selectedSymbol}
                className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--accent)] text-[var(--accent)] text-sm font-mono disabled:opacity-40"
              >
                + Add
              </button>
            </div>
          </Panel>

          {savedQuotes.length > 0 && (
            <Panel title="Saved Symbols" eyebrow="LIVE">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {savedQuotes.map((q) => (
                  <div key={q.symbol} className="relative">
                    <KpiCard label={q.label} value={q.price.toFixed(2)} delta={q.percentChange} />
                    <button
                      onClick={() => removeSymbol(q.symbol)}
                      className="absolute top-1 right-1 text-[10px] text-[var(--fg-muted)] hover:text-[var(--danger)]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <Panel title="Set an Alert" eyebrow="THRESHOLD">
            <div className="flex gap-2 flex-wrap items-center font-mono text-sm">
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="bg-[var(--bg-2)] border border-[var(--border)] rounded-[var(--radius-sm)] px-3 py-2 text-[var(--fg-0)]"
              >
                <option value="">Symbol…</option>
                {allSymbols.map((s) => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.label}
                  </option>
                ))}
              </select>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as "above" | "below")}
                className="bg-[var(--bg-2)] border border-[var(--border)] rounded-[var(--radius-sm)] px-3 py-2 text-[var(--fg-0)]"
              >
                <option value="above">moves up</option>
                <option value="below">moves down</option>
              </select>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-16 bg-[var(--bg-2)] border border-[var(--border)] rounded-[var(--radius-sm)] px-2 py-2 text-[var(--fg-0)]"
              />
              <span className="text-[var(--fg-2)]">%</span>
              <button
                onClick={() => {
                  const sym = allSymbols.find((s) => s.symbol === selectedSymbol);
                  if (sym) {
                    addAlertRule({
                      symbol: sym.symbol,
                      label: sym.label,
                      direction,
                      thresholdPercent: threshold,
                    });
                  }
                }}
                disabled={!selectedSymbol}
                className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--accent)] text-[var(--accent)] disabled:opacity-40"
              >
                Set Alert
              </button>
            </div>
          </Panel>

          {alertRules.length > 0 && (
            <Panel title="Active Alerts" eyebrow={`${alertRules.length} SET`}>
              <div className="flex flex-col gap-2">
                {alertRules.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between font-mono text-sm border-b border-[var(--border)] pb-2 last:border-0"
                  >
                    <span className="text-[var(--fg-0)]">
                      {r.label} {r.direction} {r.thresholdPercent}%
                    </span>
                    <button
                      onClick={() => removeAlertRule(r.id)}
                      className="text-[var(--fg-muted)] hover:text-[var(--danger)]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
