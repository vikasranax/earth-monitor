"use client";

import { useAisStream } from "@/hooks/useAisStream";
import { straits } from "@/lib/straits";
import { Panel, LedBadge } from "@/components/terminal";

export function ShippingStatusWidget() {
  const { status, vessels } = useAisStream();
  const total = vessels.length;
  const topStrait = straits
    .map((s) => ({ ...s, count: vessels.filter((v) => v.straitId === s.id).length }))
    .sort((a, b) => b.count - a.count)[0];

  return (
    <Panel
      title="Shipping Status"
      eyebrow="AISSTREAM"
      actions={
        <LedBadge
          status={status === "live" ? "ok" : "idle"}
          label={status.toUpperCase()}
          pulse={status === "live"}
        />
      }
    >
      <div className="flex flex-col gap-2 font-mono text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--fg-2)]">Vessels tracked</span>
          <span className="text-[var(--fg-0)]">{total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--fg-2)]">Busiest chokepoint</span>
          <span className="text-[var(--fg-0)]">
            {topStrait && topStrait.count > 0 ? topStrait.name : "—"}
          </span>
        </div>
      </div>
    </Panel>
  );
}
