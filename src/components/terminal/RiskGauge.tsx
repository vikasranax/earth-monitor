import { cn } from "@/lib/utils";

interface RiskGaugeProps {
  /** 0–100 */
  score: number;
  label?: string;
  className?: string;
}

function riskColor(score: number): string {
  if (score < 34) return "var(--ok)";
  if (score < 67) return "var(--warn)";
  return "var(--danger)";
}

export function RiskGauge({ score, label = "GLOBAL RISK", className }: RiskGaugeProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const angle = (clamped / 100) * 180; // semicircle
  const color = riskColor(clamped);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <svg viewBox="0 0 200 110" className="w-full max-w-[220px]">
        <path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke="var(--border)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(angle / 180) * 283} 283`}
        />
        <text
          x="100"
          y="85"
          textAnchor="middle"
          className="font-display"
          fontSize="28"
          fontWeight="700"
          fill="var(--fg-0)"
        >
          {clamped}
        </text>
      </svg>
      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-2)]">
        {label}
      </span>
    </div>
  );
}