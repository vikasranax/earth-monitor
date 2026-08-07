"use client";

import { useEffect, useState } from "react";
import { useAisStream } from "@/hooks/useAisStream";
import { straits } from "@/lib/straits";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel, KpiCard, LedBadge } from "@/components/terminal";
import type { MarketsFetchResult } from "@/lib/providers/twelvedata";

export default function TradeFlowsPage() {
  const { status, vessels } = useAisStream();
  const [markets, setMarkets] = useState<MarketsFetchResult | null>(null);

  useEffect(() => {
    fetch("/api/markets/snapshot")
      .then((res) => res.json())
      .then((data: MarketsFetchResult) => setMarkets(data))
      .catch(() => setMarkets(null));
  }, []);

  const countsByStrait = straits.map((s) => ({
    ...s,
    count: vessels.filter((v) => v.straitId === s.id).length,
  }));

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-5xl mx-auto w-full flex flex-col gap-4">
          <Panel
            title="Markets"
            eyebrow="TWELVEDATA"
            actions={
              markets ? (
                <LedBadge
                  status={markets.armed ? "ok" : "idle"}
                  label={markets.armed ? "LIVE" : "NOT ARMED"}
                  pulse={markets.armed}
                />
              ) : (
                <LedBadge status="info" label="LOADING" pulse />
              )
            }
          >
            {markets && !markets.armed && (
              <p className="text-sm text-[var(--fg-2)] font-mono">
                Add TWELVEDATA_API_KEY to see live market data.
              </p>
            )}
            {markets && markets.armed && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                {markets.quotes.map((q) => (
                  <KpiCard
                    key={q.symbol}
                    label={q.label}
                    value={q.price.toFixed(2)}
                    delta={q.percentChange}
                  />
                ))}
              </div>
            )}
          </Panel>

          <Panel
            title="Shipping Chokepoints"
            eyebrow="AISSTREAM"
            actions={
              <LedBadge
                status={status === "live" ? "ok" : "idle"}
                label={status.toUpperCase()}
                pulse={status === "live"}
              />
            }
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {countsByStrait.map((s) => (
                <div
                  key={s.id}
                  className="flex justify-between border-b border-[var(--border)] py-2 font-mono text-sm"
                >
                  <span className="text-[var(--fg-1)]">{s.name}</span>
                  <span className="text-[var(--fg-0)]">{s.count}</span>
                </div>
              ))}
            </div>
          </Panel>
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
