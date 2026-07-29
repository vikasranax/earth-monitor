import type { Metadata } from "next";
import { readiness, serverEnv } from "@/lib/env";
import { BootSequence } from "@/components/boot/boot-sequence";
import { UtcClock } from "@/components/boot/utc-clock";

export const metadata: Metadata = {
  title: "System Boot",
};

const MODULES = [
  { id: "M01", name: "FOUNDATION & DEVEX", state: "online" },
  { id: "M02", name: "TERMINAL UI DESIGN SYSTEM", state: "standby" },
  { id: "M03", name: "DATA LAYER & INGESTION", state: "standby" },
  { id: "M04", name: "HOME COMMAND DECK", state: "standby" },
  { id: "M05", name: "GLOBAL MAP & COUNTRY INTEL", state: "standby" },
  { id: "M06", name: "NEWS ENGINE", state: "standby" },
  { id: "M07", name: "MARKETS SUITE", state: "standby" },
  { id: "M08", name: "SHIPPING & STRAITS", state: "standby" },
  { id: "M09", name: "AIRSPACE", state: "standby" },
  { id: "M10", name: "THEMATIC DASHBOARDS", state: "standby" },
  { id: "M11", name: "ALERTS · AUTH · PERSONALISATION", state: "standby" },
  { id: "M12", name: "AI COPILOT", state: "standby" },
  { id: "M13", name: "GLOBAL POLISH & SHIP", state: "standby" },
] as const;

export default function BootPage() {
  const r = readiness();
  const lines = [
    "[00.000] JAGAT-MANTHAN kernel v1.0.0 — init",
    "[00.142] design tokens loaded ............. OK",
    `[00.318] env contract validated ........... OK  (${r.armedCount}/${r.totalCount} providers armed)`,
    "[00.471] ci gate .......................... ARMED",
    "[00.512] module M01 · FOUNDATION .......... ONLINE",
    "[00.666] awaiting operator input",
  ];

  return (
    <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8">
      {/* ── masthead ── */}
      <header>
        <p className="font-mono text-[11px] tracking-[0.32em] text-accent">
          जगत्-मन्थन · Earth Monitor SYSTEM BOOT SEQUENCE · DOC GMAI-BP-001 REV-A
        </p>
        <h1 className="mt-3 font-display text-[clamp(56px,10vw,124px)] font-black uppercase leading-[0.9]">
          Jagat-<span className="text-accent">Manthan</span>
          <span className="boot-cursor ml-2" aria-hidden="true" />
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted">
          The churning of the world. Geopolitics, markets, shipping, airspace, disasters, cyber and
          space — ingested live, analysed by AI, delivered as one terminal. This screen is the
          system self-test; it is replaced by the Home Command Deck in M04.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        {/* ── boot log + clock ── */}
        <section className="panel">
          <h2 className="panel-title">BOOT LOG</h2>
          <BootSequence lines={lines} />
          <div className="mt-6 border-t border-line pt-4">
            <UtcClock />
          </div>
        </section>

        {/* ── module manifest ── */}
        <section className="panel">
          <h2 className="panel-title">MODULE MANIFEST · CAMPAIGN M01–M13</h2>
          <ul className="mt-4 space-y-2">
            {MODULES.map((m) => (
              <li key={m.id} className="flex items-center gap-3 font-mono text-[11.5px]">
                <span className={`led ${m.state === "online" ? "led--on" : "led--standby"}`} />
                <span className="w-9 shrink-0 text-dim">{m.id}</span>
                <span className={m.state === "online" ? "text-foreground" : "text-muted"}>
                  {m.name}
                </span>
                <span
                  className={`ml-auto shrink-0 ${m.state === "online" ? "text-success" : "text-dim"}`}
                >
                  {m.state.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ── provider readiness (rendered from the real env contract) ── */}
      <section className="panel">
        <h2 className="panel-title">
          PROVIDER READINESS · {r.armedCount}/{r.totalCount} ARMED
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {r.groups.map((g) => (
            <div key={g.id} className="border border-line bg-panel-2 p-3">
              <p className="font-mono text-[10px] tracking-[0.24em] text-dim">{g.label}</p>
              <ul className="mt-2 space-y-1">
                {g.items.map((it) => (
                  <li key={it.key} className="flex items-center gap-2 font-mono text-[11px]">
                    <span className={it.armed ? "text-success" : "text-dim"}>
                      {it.armed ? "▣" : "▢"}
                    </span>
                    <span className={it.armed ? "text-foreground" : "text-muted"}>{it.key}</span>
                    {it.optional ? <span className="ml-auto text-dim">optional</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-4 font-mono text-[10.5px] tracking-[0.14em] text-dim">
        <span>NODE_ENV={serverEnv.NODE_ENV}</span>
        <span>SITE_URL={serverEnv.SITE_URL}</span>
        <span>BLUEPRINT · docs/00-MASTER-BLUEPRINT.html</span>
        <span className="ml-auto">M01 · FOUNDATION &amp; DEVEX</span>
      </footer>
    </main>
  );
}
