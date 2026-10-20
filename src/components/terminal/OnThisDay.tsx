"use client";

import { useEffect, useState } from "react";
import {
  getEventsForDate,
  getUpcomingEvents,
  formatDateDDMonth,
  formatDayMonth,
} from "@/lib/on-this-day";
import { Panel } from "@/components/terminal/Panel";

interface OnThisDayProps {
  /** Override "today" (used by tests). Defaults to the viewer's local date. */
  date?: Date;
}

export function OnThisDay({ date }: OnThisDayProps = {}) {
  // "Today" is the viewer's local date, resolved after mount. Computing it on
  // the server would use UTC and show the wrong day for ~5.5h/day in India.
  const [now, setNow] = useState<Date | null>(date ?? null);

  useEffect(() => {
    if (!date) setNow(new Date());
  }, [date]);

  if (!now) {
    return (
      <Panel title="On This Day" eyebrow="GEOPOLITICS ARCHIVE">
        <p className="text-sm text-[var(--fg-2)] font-mono">Loading today…</p>
      </Panel>
    );
  }

  const events = getEventsForDate(now);
  const dateLabel = formatDateDDMonth(now);
  const upcoming = events.length === 0 ? getUpcomingEvents(now) : [];

  return (
    <Panel title={"On This Day — " + dateLabel} eyebrow="GEOPOLITICS ARCHIVE">
      {events.length > 0 ? (
        <div className="flex flex-col gap-3">
          {events.map((e) => (
            <div
              key={`${e.year}-${e.event}`}
              className="flex gap-3 border-b border-[var(--border)] pb-2 last:border-0"
            >
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
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-[var(--fg-2)] font-mono">
            {"No entry for " + dateLabel + " in our curated set."}
          </p>
          {upcoming.length > 0 && (
            <>
              <span className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-mono">
                Coming up
              </span>
              {upcoming.map((e) => (
                <div
                  key={`${e.nextMonth}-${e.nextDay}-${e.year}-${e.event}`}
                  className="flex gap-3 border-b border-[var(--border)] pb-2 last:border-0"
                >
                  <span className="font-display text-lg font-bold text-[var(--fg-1)] shrink-0 w-14">
                    {e.year}
                  </span>
                  <div>
                    <p className="text-sm text-[var(--fg-0)]">{e.event}</p>
                    <span className="text-[10px] uppercase tracking-widest text-[var(--fg-muted)] font-mono">
                      {formatDayMonth(e.nextDay, e.nextMonth)} ·{" "}
                      {e.daysAhead === 1 ? "tomorrow" : `in ${e.daysAhead} days`} · {e.region}
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </Panel>
  );
}
