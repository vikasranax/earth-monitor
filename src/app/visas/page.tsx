"use client";

import { useState, useMemo } from "react";
import { StatusBar, CommandPalette } from "@/components/terminal";
import { ThemeProvider } from "@/components/theme-provider";
import { passportList, destinations, getVisaStatus, type VisaStatus } from "@/lib/visas";

const statusConfig: Record<VisaStatus, { label: string; color: string }> = {
  "visa-free": { label: "VISA FREE", color: "var(--ok)" },
  "e-visa": { label: "E-VISA AVAILABLE", color: "var(--accent)" },
  eta: { label: "ETA REQUIRED", color: "var(--accent)" },
  "visa-on-arrival": { label: "VISA ON ARRIVAL", color: "var(--warn)" },
  "visa-required": { label: "VISA REQUIRED", color: "var(--danger)" },
};

export default function VisasPage() {
  const [passport, setPassport] = useState("");
  const [destinationCode, setDestinationCode] = useState("");

  const destination = useMemo(
    () => destinations.find((d) => d.code === destinationCode),
    [destinationCode],
  );

  const status = destination && passport ? getVisaStatus(passport, destination) : null;
  const config = status ? statusConfig[status] : null;

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
          <div className="mb-8 border-b border-[var(--border)] pb-4">
            <h1 className="text-2xl md:text-3xl font-mono text-[var(--accent)] uppercase tracking-widest">
              Visa & Immigration Matrix
            </h1>
            <p className="text-[var(--fg-2)] mt-2 font-mono text-sm">
              Check visa requirements and official application portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--fg-2)] mb-2">
                1. Your Passport
              </label>
              <select
                value={passport}
                onChange={(e) => setPassport(e.target.value)}
                className="w-full bg-[var(--bg-1)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-3 font-mono text-sm text-[var(--fg-1)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              >
                <option value="">Select Passport...</option>
                {passportList.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--fg-2)] mb-2">
                2. Destination Country
              </label>
              <select
                value={destinationCode}
                onChange={(e) => setDestinationCode(e.target.value)}
                className="w-full bg-[var(--bg-1)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-3 font-mono text-sm text-[var(--fg-1)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              >
                <option value="">Select Destination...</option>
                {destinations.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {config && destination ? (
            <div className="border border-[var(--border)] rounded-[var(--radius-sm)] bg-[var(--bg-1)] p-6 md:p-8 text-center transition-all">
              <p className="font-mono text-xs text-[var(--fg-2)] uppercase tracking-widest mb-4">
                Requirement for {passportList.find((p) => p.code === passport)?.name} →{" "}
                {destination.name}
              </p>
              <h2
                className="text-3xl md:text-5xl font-mono font-bold uppercase tracking-widest mb-6"
                style={{ color: config.color, textShadow: `0 0 20px ${config.color}40` }}
              >
                {config.label}
              </h2>

              <a
                href={destination.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 border border-[var(--accent)] text-[var(--accent)] font-mono text-sm uppercase tracking-wider rounded-[var(--radius-sm)] hover:bg-[var(--accent)]/10 transition-colors"
              >
                Visit Official Portal
                <span>↗</span>
              </a>
            </div>
          ) : (
            <div className="border border-dashed border-[var(--border)] rounded-[var(--radius-sm)] p-12 text-center">
              <p className="font-mono text-sm text-[var(--fg-muted)]">
                Select both a passport and a destination to view visa requirements.
              </p>
            </div>
          )}
        </div>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
