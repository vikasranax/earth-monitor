import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: number;
  icon?: ReactNode;
  className?: string;
}

export function KpiCard({ label, value, delta, icon, className }: KpiCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 p-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-1)]",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-2)]">
          {label}
        </span>
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-xl font-bold text-[var(--fg-0)]">{value}</span>
        {delta !== undefined && (
          <span
            className={cn(
              "font-mono text-xs",
              delta >= 0 ? "text-[var(--ok)]" : "text-[var(--danger)]",
            )}
          >
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(2)}%
          </span>
        )}
      </div>
    </div>
  );
}