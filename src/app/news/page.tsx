import { fetchGuardianNews } from "@/lib/providers/guardian";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel, LedBadge } from "@/components/terminal";

export default async function NewsPage() {
  const result = await fetchGuardianNews();

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-4xl mx-auto w-full flex flex-col gap-4">
          <Panel
            title="News Wire"
            eyebrow="GUARDIAN API"
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
                GUARDIAN_API_KEY isn&apos;t set. Get a free key at{" "}
                <a
                  href="https://open-platform.theguardian.com"
                  className="text-[var(--accent)] underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  open-platform.theguardian.com
                </a>{" "}
                and add it to .env.local to arm this provider.
              </p>
            )}
            {result.armed && result.error && (
              <p className="text-sm text-[var(--danger)] font-mono">{result.error}</p>
            )}
            {result.armed && !result.error && result.articles.length === 0 && (
              <p className="text-sm text-[var(--fg-2)] font-mono">No articles returned.</p>
            )}
            <div className="flex flex-col gap-3 mt-2">
              {result.articles.map((a) => (
                <a
                  key={a.id}
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block border-b border-[var(--border)] pb-3 last:border-0 hover:bg-[var(--bg-2)] transition-colors -mx-2 px-2 rounded-[var(--radius-sm)]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
                      {a.section}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--fg-muted)]">
                      {new Date(a.publishedAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-semibold text-[var(--fg-0)]">
                    {a.title}
                  </h3>
                  {a.trailText && <p className="text-sm text-[var(--fg-1)] mt-1">{a.trailText}</p>}
                </a>
              ))}
            </div>
          </Panel>
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
