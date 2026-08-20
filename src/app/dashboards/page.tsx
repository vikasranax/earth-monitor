import Link from "next/link";
import { fetchAllNews } from "@/lib/providers/news";
import { fetchMarketQuotes } from "@/lib/providers/yahoo-finance";
import { fetchHazardSummary } from "@/lib/providers/hazard-summary";
import { fetchPowerStructure } from "@/lib/providers/power-structure";
import { fetchUpcomingLaunches } from "@/lib/providers/space-launches";
import { fetchAirspaceSnapshot } from "@/lib/providers/opensky";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel, LedBadge, Ticker } from "@/components/terminal";
import { ShippingStatusWidget } from "@/components/dashboards/ShippingStatusWidget";

export const dynamic = "force-dynamic";

// One entry per country — avoids showing the same person twice when they
// hold both roles (e.g. Nigeria's president holds both HoS and HoG).
const HIGHLIGHT_COUNTRY_CODES = ["IN", "RU", "CN", "US", "IR", "KP"];

const TENSION_REGION_IDS = [
  "taiwan-strait",
  "eastern-europe",
  "west-asia",
  "south-china-sea",
  "korean-peninsula",
  "kashmir",
];

export default async function ThematicDeckPage() {
  const [news, markets, hazard, power, launches, airspace] = await Promise.all([
    fetchAllNews(),
    fetchMarketQuotes(),
    fetchHazardSummary(),
    fetchPowerStructure(),
    fetchUpcomingLaunches(),
    fetchAirspaceSnapshot(),
  ]);

  const tickerItems = news.articles.slice(0, 10).map((a) => ({
    label: a.source,
    value: a.title.length > 60 ? a.title.slice(0, 57) + "…" : a.title,
  }));

  const heatmapQuotes = markets.quotes.slice(0, 24);

  const highlightedLeaders = HIGHLIGHT_COUNTRY_CODES.map((code) => {
    const countryLeaders = power.leaders.filter((l) => l.countryCode === code);
    return countryLeaders.find((l) => l.role === "head_of_state") ?? countryLeaders[0];
  }).filter((l): l is NonNullable<typeof l> => Boolean(l));

  const nextLaunch = launches.launches[0];
  const tensionCounts = airspace.regionCounts.filter((r) =>
    TENSION_REGION_IDS.includes(r.regionId),
  );

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        {tickerItems.length > 0 && <Ticker items={tickerItems} />}

        <main className="flex-1 p-4 max-w-7xl mx-auto w-full flex flex-col gap-4">
          <Panel title="Thematic Deck" eyebrow="UNIFIED VIEW">
            <p className="text-sm text-[var(--fg-2)] font-mono">
              Live news, markets, hazards, shipping, power structure, airspace, and orbital activity
              — one screen.
            </p>
          </Panel>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Panel
              title="Market Heatmap"
              eyebrow="YAHOO FINANCE"
              actions={
                <LedBadge
                  status={markets.armed ? "ok" : "idle"}
                  label={markets.armed ? "LIVE" : "NOT ARMED"}
                  pulse={markets.armed}
                />
              }
              className="lg:col-span-2"
            >
              {!markets.armed && (
                <p className="text-sm text-[var(--fg-2)] font-mono">Market data unavailable.</p>
              )}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {heatmapQuotes.map((q) => {
                  const up = q.percentChange >= 0;
                  const intensity = Math.min(Math.abs(q.percentChange) / 3, 1);
                  const bg = up
                    ? `rgba(46, 204, 113, ${0.15 + intensity * 0.35})`
                    : `rgba(255, 77, 79, ${0.15 + intensity * 0.35})`;
                  return (
                    <div
                      key={q.symbol}
                      className="rounded-[var(--radius-sm)] border border-[var(--border)] p-2 flex flex-col gap-1"
                      style={{ background: bg }}
                    >
                      <span className="font-mono text-[9px] text-[var(--fg-1)] truncate">
                        {q.label}
                      </span>
                      <span
                        className={`font-mono text-xs font-semibold ${up ? "text-[var(--ok)]" : "text-[var(--danger)]"}`}
                      >
                        {up ? "▲" : "▼"} {Math.abs(q.percentChange).toFixed(2)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </Panel>

            <Panel
              title="Hazard Alerts"
              eyebrow="USGS · M4.5+"
              actions={
                <LedBadge
                  status={hazard.error ? "warn" : "ok"}
                  label={hazard.error ? "ERROR" : "LIVE"}
                  pulse={!hazard.error}
                />
              }
            >
              {hazard.error && (
                <p className="text-sm text-[var(--danger)] font-mono">{hazard.error}</p>
              )}
              {!hazard.error && hazard.events.length === 0 && (
                <p className="text-sm text-[var(--fg-2)] font-mono">
                  No significant events in the last 24h.
                </p>
              )}
              <div className="flex flex-col gap-2">
                {hazard.events.map((e) => (
                  <div
                    key={e.id}
                    className="flex justify-between border-b border-[var(--border)] pb-1.5 last:border-0 font-mono text-xs"
                  >
                    <span className="text-[var(--fg-1)] truncate pr-2">{e.place}</span>
                    <span className="text-[var(--warn)] shrink-0">M{e.magnitude.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ShippingStatusWidget />

            <Panel title="Power Structure" eyebrow="WIKIDATA · LIVE" className="lg:col-span-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {highlightedLeaders.map((l) => (
                  <div key={l.countryCode} className="font-mono text-xs">
                    <div className="text-[var(--fg-2)] uppercase tracking-widest text-[10px]">
                      {l.countryCode} · {l.countryName}
                    </div>
                    <div className="text-[var(--fg-0)]">{l.personName}</div>
                  </div>
                ))}
              </div>
              <Link
                href="/power-structure"
                className="block mt-3 text-xs text-[var(--accent)] underline font-mono"
              >
                View all {power.leaders.length} officeholders →
              </Link>
            </Panel>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Panel
              title="Next Launch"
              eyebrow="LAUNCH LIBRARY 2"
              actions={
                <LedBadge
                  status={launches.error ? "warn" : "ok"}
                  label={launches.error ? "ERROR" : "LIVE"}
                  pulse={!launches.error}
                />
              }
            >
              {launches.error && (
                <p className="text-sm text-[var(--danger)] font-mono">{launches.error}</p>
              )}
              {!launches.error && !nextLaunch && (
                <p className="text-sm text-[var(--fg-2)] font-mono">No upcoming launches found.</p>
              )}
              {nextLaunch && (
                <div className="font-mono text-xs flex flex-col gap-1">
                  <div className="text-[var(--fg-0)] text-sm font-semibold">{nextLaunch.name}</div>
                  <div className="text-[var(--fg-2)]">
                    {nextLaunch.provider} · {nextLaunch.rocket}
                  </div>
                  <div className="text-[var(--fg-1)]">
                    {new Date(nextLaunch.net).toLocaleString()}
                  </div>
                  <div className="text-[var(--fg-muted)]">{nextLaunch.locationName}</div>
                </div>
              )}
              <Link
                href="/space"
                className="block mt-3 text-xs text-[var(--accent)] underline font-mono"
              >
                View all {launches.launches.length} upcoming →
              </Link>
            </Panel>

            <Panel
              title="Airspace Tension Zones"
              eyebrow="OPENSKY"
              className="lg:col-span-2"
              actions={
                <LedBadge
                  status={airspace.error ? "warn" : "ok"}
                  label={airspace.error ? "ERROR" : "LIVE"}
                  pulse={!airspace.error}
                />
              }
            >
              {airspace.error && (
                <p className="text-sm text-[var(--danger)] font-mono">{airspace.error}</p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {tensionCounts.map((r) => (
                  <div
                    key={r.regionId}
                    className="flex justify-between border-b border-[var(--border)] py-1.5 font-mono text-xs"
                  >
                    <span className="text-[var(--fg-1)]">{r.regionId}</span>
                    <span className="text-[var(--fg-0)]">{r.count}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/dashboards/conflict-watch"
                className="block mt-3 text-xs text-[var(--accent)] underline font-mono"
              >
                Full Conflict Watch dashboard →
              </Link>
            </Panel>
          </div>

          {/* Visa Matrix Panel */}
          <Panel title="Visa & Immigration Matrix" eyebrow="TRAVEL" className="lg:col-span-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm text-[var(--fg-2)] font-mono mb-1">
                  Interactive passport checker and directory of official government portals for 65+
                  countries.
                </p>
                <p className="text-xs text-[var(--fg-muted)] font-mono">
                  Supports 10 major passport types (US, UK, EU, CA, AU, IN, CN, RU, BR, JP).
                </p>
              </div>
              <Link
                href="/visas"
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 border border-[var(--accent)] text-[var(--accent)] font-mono text-xs uppercase tracking-wider rounded-[var(--radius-sm)] hover:bg-[var(--accent)]/10 transition-colors"
              >
                Launch Matrix
                <span>↗</span>
              </Link>
            </div>
          </Panel>

          <Panel title="Latest Headlines" eyebrow="NEWS WIRE">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {news.articles.slice(0, 6).map((a) => (
                <Link
                  key={a.id}
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block border-b border-[var(--border)] pb-2 last:border-0 hover:text-[var(--accent)] transition-colors font-mono text-xs text-[var(--fg-1)]"
                >
                  {a.title}
                </Link>
              ))}
            </div>
          </Panel>
        </main>

        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
