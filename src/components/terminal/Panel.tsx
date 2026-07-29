import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PanelProps {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export function Panel({ title, eyebrow, children, className, actions }: PanelProps) {
  return (
    <section
      className={cn(
        "corner-ticks bg-[var(--bg-1)] rounded-[var(--radius-md)]",
        "shadow-[var(--shadow-panel)]",
        className,
      )}
    >
      {(title || eyebrow || actions) && (
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)]">
          <div>
            {eyebrow && (
              <div className="font-mono text-[10px] tracking-widest text-[var(--fg-2)] uppercase">
                {eyebrow}
              </div>
            )}
            {title && (
              <h3 className="font-display text-sm font-semibold text-[var(--fg-0)]">
                {title}
              </h3>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}