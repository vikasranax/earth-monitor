"use client";

interface LayerToggleProps {
  showDisputed: boolean;
  showUnrest: boolean;
  showAllCountries: boolean;
  onToggleDisputed: () => void;
  onToggleUnrest: () => void;
  onToggleAllCountries: () => void;
}

export function LayerToggle({
  showDisputed,
  showUnrest,
  showAllCountries,
  onToggleAllCountries,
  onToggleDisputed,
  onToggleUnrest,
}: LayerToggleProps) {
  return (
    <div className="flex gap-2 p-2 border-b border-[var(--border)] bg-[var(--bg-1)] font-mono text-xs">
      <button
        onClick={onToggleAllCountries}
        className={`px-3 py-1.5 rounded-[var(--radius-sm)] border transition-colors ${
          showAllCountries
            ? "border-[var(--info)] text-[var(--info)] bg-[rgba(59,167,255,0.1)]"
            : "border-[var(--border)] text-[var(--fg-2)]"
        }`}
      >
        ALL COUNTRIES (LIVE)
      </button>
      <button
        onClick={onToggleDisputed}
        className={`px-3 py-1.5 rounded-[var(--radius-sm)] border transition-colors ${
          showDisputed
            ? "border-[var(--warn)] text-[var(--warn)] bg-[rgba(245,197,66,0.1)]"
            : "border-[var(--border)] text-[var(--fg-2)]"
        }`}
      >
        DISPUTED TERRITORIES
      </button>
      <button
        onClick={onToggleUnrest}
        className={`px-3 py-1.5 rounded-[var(--radius-sm)] border transition-colors ${
          showUnrest
            ? "border-[var(--danger)] text-[var(--danger)] bg-[rgba(255,77,79,0.1)]"
            : "border-[var(--border)] text-[var(--fg-2)]"
        }`}
      >
        CIVIL UNREST (SAMPLE)
      </button>
    </div>
  );
}
