import { cn } from "@/lib/utils";

export type LedStatus = "ok" | "warn" | "danger" | "info" | "idle";

interface LedBadgeProps {
  status: LedStatus;
  label: string;
  pulse?: boolean;
  className?: string;
}

const statusColor: Record<LedStatus, string> = {
  ok: "var(--ok)",
  warn: "var(--warn)",
  danger: "var(--danger)",
  info: "var(--info)",
  idle: "var(--fg-muted)",
};

export function LedBadge({ status, label, pulse = false, className }: LedBadgeProps) {
  const color = statusColor[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-[var(--fg-1)]",
        className,
      )}
    >
      <span
        data-testid="led-dot"
        className={cn("w-1.5 h-1.5 rounded-full", pulse && "animate-pulse")}
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
      />
      {label}
    </span>
  );
}
