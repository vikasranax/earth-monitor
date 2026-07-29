import { cn } from "@/lib/utils";

export interface TickerItem {
  label: string;
  value: string;
  delta?: number; // positive/negative %, drives color
}

interface TickerProps {
  items: TickerItem[];
  className?: string;
}

export function Ticker({ items, className }: TickerProps) {
  const loop = [...items, ...items]; // seamless scroll

  return (
    <div
      className={cn(
        "overflow-hidden border-y border-[var(--border)] bg-[var(--bg-1)] py-2",
        className,
      )}
    >
      <div className="ticker-track flex w-max gap-8 font-mono text-xs">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[var(--fg-2)]">{item.label}</span>
            <span className="text-[var(--fg-0)] font-semibold">{item.value}</span>
            {item.delta !== undefined && (
              <span
                className={cn(
                  item.delta >= 0 ? "text-[var(--ok)]" : "text-[var(--danger)]",
                )}
              >
                {item.delta >= 0 ? "▲" : "▼"} {Math.abs(item.delta).toFixed(2)}%
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}