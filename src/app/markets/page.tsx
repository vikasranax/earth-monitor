import { fetchMarketQuotes } from "@/lib/providers/twelvedata";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel, KpiCard, LedBadge } from "@/components/terminal";

export default async function MarketsPage() {
  const result = await fetchMarketQuotes();

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-4xl mx-auto w-full flex flex-col gap-4">
          <Panel
            title="Markets Suite"
            eyebrow="TWELVEDATA"
            actions={
              <LedBadge
                status={result.armed ? (result.error ? "warn" : "ok") : "idle"}
                label={result.armed ? (result.cached ? "CACHED" : "LIVE") : "NOT ARMED"}
                pulse={result.armed && !result.error}
              />
            }
          >
            {!result.armed && (
              <p className="text-sm text-[var(--fg-2)] font-mono">
                TWELVEDATA_API_KEY isn&apos;t set. Get a free key at{" "}
                <a
                  href="https://twelvedata.com"
                  className="text-[var(--accent)] underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  twelvedata.com
                </a>{" "}
                (free tier: 800 requests/day) and add it to .env.local to arm this provider.
              </p>
            )}
            {result.armed && result.error && (
              <p className="text-sm text-[var(--danger)] font-mono">{result.error}</p>
            )}
            {result.armed && !result.error && result.quotes.length === 0 && (
              <p className="text-sm text-[var(--fg-2)] font-mono">No quotes returned.</p>
            )}
          </Panel>

          {result.quotes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {result.quotes.map((q) => (
                <KpiCard
                  key={q.symbol}
                  label={q.label}
                  value={q.price.toFixed(2)}
                  delta={q.percentChange}
                />
              ))}
            </div>
          )}
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
