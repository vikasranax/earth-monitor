"use client";

import { useEffect, useState } from "react";
import { useWatchlistStore } from "@/stores/watchlist";
import type { MarketsFetchResult } from "@/lib/providers/yahoo-finance";

interface TriggeredAlert {
  id: string;
  message: string;
}

export function AlertBanner() {
  const alertRules = useWatchlistStore((s) => s.alertRules);
  const [triggered, setTriggered] = useState<TriggeredAlert[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (alertRules.length === 0) return;

    async function check() {
      try {
        const res = await fetch("/api/markets/snapshot");
        const data: MarketsFetchResult = await res.json();
        if (!data.armed) return;

        const newlyTriggered: TriggeredAlert[] = [];
        for (const rule of alertRules) {
          const quote = data.quotes.find((q) => q.symbol === rule.symbol);
          if (!quote) continue;

          const hit =
            rule.direction === "above"
              ? quote.percentChange >= rule.thresholdPercent
              : quote.percentChange <= -rule.thresholdPercent;

          if (hit) {
            newlyTriggered.push({
              id: rule.id,
              message: `${rule.label} moved ${quote.percentChange >= 0 ? "+" : ""}${quote.percentChange.toFixed(2)}% — past your ${rule.thresholdPercent}% ${rule.direction} threshold`,
            });
          }
        }
        setTriggered(newlyTriggered);
      } catch {
        // silent — alerts are non-critical, don't disrupt the page on a failed poll
      }
    }

    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [alertRules]);

  const visible = triggered.filter((t) => !dismissed.has(t.id));
  if (visible.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 p-3 border-b border-[var(--warn)] bg-[rgba(245,197,66,0.08)]">
      {visible.map((t) => (
        <div key={t.id} className="flex items-center justify-between gap-3 font-mono text-xs">
          <span className="text-[var(--warn)]">⚠ {t.message}</span>
          <button
            onClick={() => setDismissed((prev) => new Set(prev).add(t.id))}
            className="text-[var(--fg-2)] hover:text-[var(--fg-0)] shrink-0"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
