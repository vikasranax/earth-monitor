"use client";

import { useEffect, useState } from "react";

export function UtcClock() {
  const [time, setTime] = useState("--:--:--");
  const [date, setDate] = useState("---- · -- · --");

  useEffect(() => {
    const tick = () => {
      const iso = new Date().toISOString();
      setTime(iso.slice(11, 19));
      setDate(iso.slice(0, 10));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3 font-mono">
      <span className="led led--on" aria-hidden="true" />
      <span className="text-lg tracking-[0.14em] text-info">{time} UTC</span>
      <span className="text-[11px] tracking-[0.2em] text-dim">{date} · TERMINAL IDLE</span>
    </div>
  );
}