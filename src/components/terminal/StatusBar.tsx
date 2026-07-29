"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settings";
import { Sun, Moon, Command } from "lucide-react";

export function StatusBar() {
  const { theme, toggleTheme, toggleCommandPalette } = useSettingsStore();
  const [utcTime, setUtcTime] = useState<string>("");

  useEffect(() => {
    function tick() {
      setUtcTime(new Date().toISOString().slice(11, 19) + " UTC");
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between h-9 px-4 border-b border-[var(--border)] bg-[var(--bg-1)] font-mono text-xs text-[var(--fg-1)]">
      <div className="flex items-center gap-4">
        <span className="text-[var(--accent)] font-semibold tracking-wide">
          जगत्-मन्थन
        </span>
        <span className="text-[var(--fg-2)]">EARTH MONITOR</span>
      </div>

      <div className="flex items-center gap-4">
        <span>{utcTime}</span>
        <button
          onClick={toggleCommandPalette}
          className="flex items-center gap-1 px-2 py-1 rounded-[var(--radius-sm)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors"
        >
          <Command size={12} />
          <span>K</span>
        </button>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors"
        >
          {theme === "dark" ? <Sun size={12} /> : <Moon size={12} />}
        </button>
      </div>
    </div>
  );
}