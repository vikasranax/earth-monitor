import { fetchMarketQuotes, fetchForexRates, convertPrice } from "@/lib/providers/yahoo-finance";
import { fetchMarketQuotes as fetchTwelveDataQuotes } from "@/lib/providers/twelvedata";
import { regions, asiaRegions, supportedCurrencies } from "@/lib/markets-watchlist";
import type { MarketQuote } from "@/lib/providers/yahoo-finance";
import CurrencySelector from "@/components/currency-selector";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel, KpiCard, LedBadge } from "@/components/terminal";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ currency?: string }>;
}

export default async function MarketsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const targetCurrency = params.currency || "USD";
  const isValidCurrency = supportedCurrencies.includes(targetCurrency);

  let { quotes, armed, error } = await fetchMarketQuotes();
  let provider = "Yahoo Finance";

  if (!armed || quotes.length < 5) {
    const twelve = await fetchTwelveDataQuotes();
    if (twelve.armed && twelve.quotes.length > 0) {
      quotes = twelve.quotes.map((q): MarketQuote => ({
        symbol: q.symbol,
        label: q.label,
        price: q.price,
        percentChange: q.percentChange,
        region: "US",
        regionName: "United States",
        currency: "USD",
        category: "equity",
      }));
      armed = true;
      provider = "TwelveData";
      error = undefined;
    }
  }

  const forexRates = isValidCurrency && targetCurrency !== "USD" ? await fetchForexRates() : {};
  const displayCurrency = isValidCurrency ? targetCurrency : "USD";

  if (isValidCurrency && targetCurrency !== "USD") {
    quotes = quotes.map((q) => ({
      ...q,
      price: convertPrice(q.price, q.currency, targetCurrency, forexRates),
      currency: targetCurrency,
    }));
  }

  const byRegion: Record<string, MarketQuote[]> = {};
  for (const q of quotes) {
    const r = q.region;
    if (!byRegion[r]) byRegion[r] = [];
    byRegion[r].push(q);
  }

  const asiaQuotes: MarketQuote[] = [];
  for (const r of asiaRegions) {
    if (byRegion[r]) {
      asiaQuotes.push(...byRegion[r]);
      delete byRegion[r];
    }
  }
  if (asiaQuotes.length > 0) {
    byRegion["ASIA"] = asiaQuotes;
  }

  const regionOrder = [
    "IN", "CN", "ASIA", "WA", "IL", "EU", "GB", "FR", "RU", "US", "BR", "MX", "ZA", "AF", "GL",
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-6xl mx-auto w-full flex flex-col gap-4">
          <Panel
            title="Markets Suite"
            eyebrow={provider.toUpperCase()}
            actions={
              <div className="flex items-center gap-3">
                <CurrencySelector current={displayCurrency} />
                <LedBadge
                  status={armed ? "ok" : "idle"}
                  label={armed ? "LIVE" : "NOT ARMED"}
                  pulse={armed}
                />
              </div>
            }
          >
            {error && <p className="text-sm text-[var(--danger)] font-mono">{error}</p>}
            {!armed && (
              <p className="text-sm text-[var(--fg-2)] font-mono">
                Market data providers are not armed. Yahoo Finance should work without an API
                key. If this persists, the provider may be rate-limiting requests.
              </p>
            )}
            {armed && (
              <p className="text-sm text-[var(--fg-2)] font-mono">
                {quotes.length} instruments live
              </p>
            )}
          </Panel>

          {regionOrder
            .filter((r) => (byRegion[r] ?? []).length > 0)
            .map((region) => {
              const regionInfo = regions.find((rg) => rg.code === region) || {
                code: region,
                name: region === "ASIA" ? "Asia-Pacific" : region,
                color: "var(--fg-muted)",
              };
              const regionQuotes = byRegion[region] ?? [];

              return (
                <Panel key={region} title={regionInfo.name} eyebrow={`${regionQuotes.length} SYMBOLS`}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {regionQuotes.map((q) => (
                      <KpiCard
                        key={q.symbol}
                        label={q.label}
                        value={q.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        delta={q.percentChange}
                      />
                    ))}
                  </div>
                </Panel>
              );
            })}

          {quotes.length === 0 && !error && (
            <Panel title="No Data" eyebrow="MARKETS">
              <p className="text-sm text-[var(--fg-2)] font-mono text-center py-8">
                No market data available right now.
              </p>
            </Panel>
          )}
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
