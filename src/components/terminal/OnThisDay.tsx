import { getEventsForDate, formatDateDDMonth } from "@/lib/on-this-day";
import { Panel } from "@/components/terminal/Panel";

export function OnThisDay() {
  const events = getEventsForDate();
  const dateLabel = formatDateDDMonth();

  return (
    <Panel title={"On This Day — " + dateLabel} eyebrow="GEOPOLITICS ARCHIVE">
      {events.length === 0 ? (
        <p className="text-sm text-[var(--fg-2)] font-mono">
          No entries for this date yet in our starter set — check back as we expand it.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((e, i) => (
            <div key={i} className="flex gap-3 border-b border-[var(--border)] pb-2 last:border-0">
              <span className="font-display text-lg font-bold text-[var(--accent)] shrink-0 w-14">
                {e.year}
              </span>
              <div>
                <p className="text-sm text-[var(--fg-0)]">{e.event}</p>
                <span className="text-[10px] uppercase tracking-widest text-[var(--fg-muted)] font-mono">
                  {e.region}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
