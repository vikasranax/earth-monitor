"use client";

import { useState, useEffect } from "react";
import { clockCities, formatCityTime, formatCityDate } from "@/lib/world-clock";
import { Panel } from "@/components/terminal/Panel";

export function WorldClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Panel title="World Clock" eyebrow="LIVE · LOCAL TIME">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {clockCities.map((c) => (
          <div key={c.timezone} className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-widest text-[var(--fg-2)] font-mono truncate">
              {c.label}
            </span>
            <span className="font-display text-lg font-bold text-[var(--fg-0)]">
              {formatCityTime(c.timezone, now)}
            </span>
            <span className="text-[10px] text-[var(--fg-muted)] font-mono">
              {formatCityDate(c.timezone, now)}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
