"use client";

import { useAisStream, type VesselPing } from "@/hooks/useAisStream";
import { straits } from "@/lib/straits";
import { ThemeProvider } from "@/components/theme-provider";
import {
  StatusBar,
  CommandPalette,
  Panel,
  KpiCard,
  LedBadge,
  DataTable,
} from "@/components/terminal";

export default function ShippingPage() {
  const { status, vessels } = useAisStream();

  const countsByStrait = straits.map((s) => ({
    ...s,
    count: vessels.filter((v) => v.straitId === s.id).length,
  }));

  const statusLabel =
    status === "live"
      ? "LIVE"
      : status === "connecting"
        ? "CONNECTING"
        : status === "not_armed"
          ? "NOT ARMED"
          : status === "error"
            ? "ERROR"
            : "IDLE";

  const ledStatus =
    status === "live"
      ? "ok"
      : status === "connecting"
        ? "info"
        : status === "error"
          ? "danger"
          : "idle";

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-5xl mx-auto w-full flex flex-col gap-4">
          <Panel
            title="Shipping & Straits"
            eyebrow="AISSTREAM"
            actions={<LedBadge status={ledStatus} label={statusLabel} pulse={status === "live"} />}
          >
            {status === "not_armed" && (
              <p className="text-sm text-[var(--fg-2)] font-mono">
                NEXT_PUBLIC_AISSTREAM_API_KEY isn&apos;t set. Get a free key at{" "}
                <a
                  href="https://aisstream.io"
                  className="text-[var(--accent)] underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  aisstream.io
                </a>{" "}
                and add it to .env.local to arm live vessel tracking.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-[var(--danger)] font-mono">
                Connection error — check your API key or network, then reload.
              </p>
            )}
            {status === "connecting" && (
              <p className="text-sm text-[var(--fg-2)] font-mono">Connecting to AIS stream…</p>
            )}
          </Panel>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {countsByStrait.map((s) => (
              <KpiCard key={s.id} label={s.name} value={String(s.count)} />
            ))}
          </div>

          <Panel title="Recent Vessel Pings" eyebrow="LAST 50">
            <DataTable<VesselPing>
              columns={[
                { key: "name", header: "Vessel" },
                { key: "straitId", header: "Chokepoint" },
                {
                  key: "speed",
                  header: "Speed (kn)",
                  align: "right",
                  render: (v) => v.speed.toFixed(1),
                },
                {
                  key: "receivedAt",
                  header: "Received",
                  align: "right",
                  render: (v) => new Date(v.receivedAt).toLocaleTimeString(),
                },
              ]}
              rows={vessels}
              getRowKey={(v) => v.mmsi}
              emptyLabel={status === "live" ? "Awaiting vessel pings…" : "NO DATA"}
            />
          </Panel>
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
