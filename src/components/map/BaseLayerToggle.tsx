"use client";

interface BaseLayerToggleProps {
  baseLayer: "dark" | "satellite";
  onChange: (layer: "dark" | "satellite") => void;
}

export function BaseLayerToggle({ baseLayer, onChange }: BaseLayerToggleProps) {
  const darkClass = baseLayer === "dark"
    ? "px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--accent)] text-[var(--accent)] bg-[rgba(255,122,26,0.1)]"
    : "px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--fg-2)]";
  const satClass = baseLayer === "satellite"
    ? "px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--accent)] text-[var(--accent)] bg-[rgba(255,122,26,0.1)]"
    : "px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--fg-2)]";

  return (
    <div className="flex gap-2 p-2 border-b border-[var(--border)] bg-[var(--bg-1)] font-mono text-xs">
      <button onClick={() => onChange("dark")} className={darkClass}>DARK</button>
      <button onClick={() => onChange("satellite")} className={satClass}>SATELLITE</button>
    </div>
  );
}
