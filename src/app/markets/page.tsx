import { fetchMarketQuotes, fetchForexRates, convertPrice } from "@/lib/providers/yahoo-finance";
import { fetchMarketQuotes as fetchTwelveDataQuotes } from "@/lib/providers/twelvedata";
import { regions, asiaRegions, supportedCurrencies } from "@/lib/markets-watchlist";
import type { MarketQuote } from "@/lib/providers/yahoo-finance";
import CurrencySelector from "@/components/currency-selector";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ currency?: string }>;
}

export default async function MarketsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const targetCurrency = params.currency || "USD";
  const isValidCurrency = supportedCurrencies.includes(targetCurrency);

  // Try Yahoo Finance first, fall back to TwelveData
  let { quotes, armed, error } = await fetchMarketQuotes();
  let provider = "Yahoo Finance";

  if (!armed || quotes.length < 5) {
    const twelve = await fetchTwelveDataQuotes();
    if (twelve.armed && twelve.quotes.length > 0) {
      // TwelveData's shape doesn't include region/currency — backfill
      // sensible defaults instead of blind-casting, so region grouping
      // and currency conversion downstream don't silently break.
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

  // Fetch forex rates for conversion
  const forexRates = isValidCurrency && targetCurrency !== "USD" ? await fetchForexRates() : {};
  const displayCurrency = isValidCurrency ? targetCurrency : "USD";

  // Convert prices if needed
  if (isValidCurrency && targetCurrency !== "USD") {
    quotes = quotes.map((q) => ({
      ...q,
      price: convertPrice(q.price, q.currency, targetCurrency, forexRates),
      currency: targetCurrency,
    }));
  }

  // Group by region
  const byRegion: Record<string, MarketQuote[]> = {};
  for (const q of quotes) {
    const r = q.region;
    if (!byRegion[r]) byRegion[r] = [];
    byRegion[r].push(q);
  }

  // Build Asia-Pacific group (JP + KR + SG + AS)
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

  // Render order: India first, then Asia, then rest
  const regionOrder = [
    "IN",
    "CN",
    "ASIA",
    "ME",
    "IL",
    "EU",
    "GB",
    "FR",
    "RU",
    "US",
    "BR",
    "MX",
    "ZA",
    "AF",
    "GL",
  ];

  return (
    <main className="min-h-screen bg-[#05070a] text-[#e6ebf1] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[#ff7a1a] text-lg">📈</span>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">
                Markets Suite
              </h1>
            </div>
            <p className="text-[#6b7684] text-sm">
              {armed ? `${provider} · ${quotes.length} instruments live` : "Provider not armed"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <CurrencySelector current={displayCurrency} />

            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${armed ? "bg-[#2ecc71] animate-pulse" : "bg-[#ff4d4f]"}`}
              />
              <span className="text-[10px] uppercase tracking-wider text-[#6b7684] font-mono">
                {armed ? "LIVE" : "NOT ARMED"}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-[#ff4d4f]/30 bg-[#ff4d4f]/10 rounded text-[#ff4d4f] text-sm">
            {error}
          </div>
        )}

        {!armed && (
          <div className="mb-6 p-4 border border-[#f5c542]/30 bg-[#f5c542]/10 rounded text-[#f5c542] text-sm">
            Market data providers are not armed. Yahoo Finance should work without an API key. If
            this persists, the provider may be rate-limiting requests.
          </div>
        )}

        {/* Region Groups */}
        <div className="space-y-8">
          {regionOrder
            .filter((r) => (byRegion[r] ?? []).length > 0)
            .map((region) => {
              const regionInfo = regions.find((rg) => rg.code === region) || {
                code: region,
                name: region === "ASIA" ? "Asia-Pacific" : region,
                color: "#454e59",
              };
              const regionQuotes = byRegion[region] ?? [];

              return (
                <section key={region}>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: regionInfo.color }}
                    />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[#a8b3c1]">
                      {regionInfo.name}
                    </h2>
                    <span className="text-[10px] text-[#454e59] font-mono ml-auto">
                      {regionQuotes.length} symbols
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {regionQuotes.map((q) => (
                      <div
                        key={q.symbol}
                        className="p-4 rounded-lg border border-[#212832] bg-[#0a0d12] hover:bg-[#10151c] hover:border-[#2e3742] transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase tracking-wider text-[#6b7684] font-mono">
                            {q.label}
                          </span>
                          <span className="text-[10px] text-[#454e59] font-mono">{q.symbol}</span>
                        </div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-xl font-bold text-[#e6ebf1]">
                            {q.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          <span
                            className={`text-xs font-mono flex items-center gap-1 ${q.percentChange >= 0 ? "text-[#2ecc71]" : "text-[#ff4d4f]"}`}
                          >
                            {q.percentChange >= 0 ? "▲" : "▼"}
                            {Math.abs(q.percentChange).toFixed(2)}%
                          </span>
                        </div>
                        <div className="text-[10px] text-[#454e59] mt-1 font-mono">
                          {q.currency}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
        </div>

        {quotes.length === 0 && !error && (
          <p className="text-[#6b7684] text-sm text-center py-20">
            No market data available right now.
          </p>
        )}
      </div>
    </main>
  );
}
