import { fetchAllNews } from "@/lib/providers/news";

export const dynamic = "force-dynamic";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  region: string;
  publishedAt: string;
  url: string;
}

/* ── Topic detection by keyword ───────────────────────────── */
function detectTopics(article: NewsArticle): string[] {
  const text = ` ${article.title} ${article.summary} `.toLowerCase();
  const topics: string[] = [];

  const topicKeywords: Record<string, string[]> = {
    Technology: [
      " technology ",
      " software ",
      " digital ",
      " cyber",
      " internet ",
      " startup",
      " silicon ",
      " semiconductor",
      " chip ",
      " telecom",
      " 5g ",
      " blockchain",
    ],
    AI: [
      " artificial intelligence",
      " machine learning",
      " deep learning",
      " generative ai",
      " chatgpt",
      " openai",
      " deepseek",
      " llm ",
      " neural network",
      " large language model",
      " gemini",
      " claude",
      " copilot",
    ],
    Automobile: [
      " car ",
      " auto ",
      " vehicle",
      " electric vehicle",
      " ev ",
      " tesla",
      " toyota",
      " hyundai",
      " maruti",
      " mahindra",
      " tata motors",
      " ford",
      " bmw",
      " mercedes",
      " audi",
      " volkswagen",
      " honda",
      " volvo",
    ],
    Sports: [
      " cricket",
      " football",
      " soccer",
      " ipl",
      " fifa",
      " olympic",
      " tennis",
      " basketball",
      " athlete",
      " match",
      " tournament",
      " championship",
      " world cup",
      " grand slam",
      " formula 1",
      " f1 ",
    ],
    Defence: [
      " defence",
      " defense",
      " military",
      " army",
      " navy",
      " air force",
      " missile",
      " drone",
      " war ",
      " conflict",
      " troop",
      " weapon",
      " tank",
      " fighter jet",
      " submarine",
      " border",
    ],
    Markets: [
      " stock market",
      " sensex",
      " nifty",
      " nasdaq",
      " investor",
      " bull run",
      " bear market",
      " rally",
      " crash",
      " ipo",
      " dividend",
      " earnings",
      " quarterly result",
    ],
    Health: [
      " health",
      " hospital",
      " vaccine",
      " covid",
      " disease",
      " virus",
      " medical",
      " doctor",
      " patient",
      " who ",
      " outbreak",
      " epidemic",
    ],
    Climate: [
      " climate",
      " flood",
      " drought",
      " cyclone",
      " hurricane",
      " earthquake",
      " wildfire",
      " heatwave",
      " monsoon",
      " rainfall",
      " temperature",
      " pollution",
      " carbon",
    ],
    Politics: [
      " election",
      " vote",
      " minister",
      " prime minister",
      " president",
      " parliament",
      " government",
      " policy",
      " cabinet",
      " opposition",
      " campaign",
      " poll",
    ],
  };

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some((k) => text.includes(k))) topics.push(topic);
  }

  return topics;
}

/* ── Region display names ─────────────────────────────────── */
const regionNames: Record<string, string> = {
  IN: "India & South Asia",
  NK: "North Korea",
  CN: "China",
  JP: "Japan",
  KR: "South Korea",
  SG: "South-East Asia",
  QA: "Qatar & Gulf",
  IL: "Israel",
  WA: "West Asia",
  GB: "United Kingdom",
  EU: "European Union",
  FR: "France",
  RU: "Russia",
  US: "United States",
  AF: "Africa",
  GL: "Global",
};

const regionColors: Record<string, string> = {
  IN: "#ff7a1a",
  NK: "#ff4d4f",
  CN: "#ff4d4f",
  JP: "#f5c542",
  KR: "#3ba7ff",
  SG: "#2ecc71",
  QA: "#8b7cf6",
  IL: "#2ecc71",
  WA: "#8b7cf6",
  GB: "#a8b3c1",
  EU: "#3ba7ff",
  FR: "#3ba7ff",
  RU: "#ff4d4f",
  US: "#3ba7ff",
  AF: "#2ecc71",
  GL: "#e6ebf1",
};

/* ── Section card component ───────────────────────────────── */
function NewsSection({
  title,
  color,
  articles,
}: {
  title: string;
  color: string;
  articles: NewsArticle[];
}) {
  if (articles.length === 0) return null;

  return (
    <div
      style={{ borderLeft: `3px solid ${color}` }}
      className="rounded-lg border border-[#212832] bg-[#0a0d12] overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-[#212832] flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#e6ebf1] tracking-wide uppercase">{title}</h2>
        <span className="text-[10px] text-[#454e59] font-mono">{articles.length} stories</span>
      </div>
      <div className="divide-y divide-[#171d26]">
        {articles.slice(0, 5).map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 hover:bg-[#10151c] transition-colors group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-medium text-[#e6ebf1] leading-snug group-hover:text-[#ff7a1a] transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-[11px] text-[#6b7684] mt-1 line-clamp-1">{article.summary}</p>
              </div>
              <span className="text-[10px] text-[#454e59] font-mono whitespace-nowrap shrink-0 mt-0.5">
                {article.source}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default async function NewsPage() {
  const { articles, error } = await fetchAllNews();

  // Categorize
  const byRegion: Record<string, NewsArticle[]> = {};
  const byTopic: Record<string, NewsArticle[]> = {
    Technology: [],
    AI: [],
    Automobile: [],
    Sports: [],
  };

  for (const article of articles) {
    // Region grouping
    const regionKey = article.region || "GL";
    if (!byRegion[regionKey]) byRegion[regionKey] = [];
    byRegion[regionKey].push(article);

    // Topic grouping
    const topics = detectTopics(article);
    for (const topic of topics) {
      if (byTopic[topic]) byTopic[topic].push(article);
    }
  }

  const headlines = articles.slice(0, 6);

  // Define section order
  const regionOrder = [
    "IN",
    "NK",
    "CN",
    "JP",
    "KR",
    "SG",
    "IL",
    "WA",
    "EU",
    "GB",
    "FR",
    "RU",
    "US",
    "AF",
  ];
  const topicOrder = ["Technology", "AI", "Automobile", "Sports"];

  return (
    <main className="min-h-screen bg-[#05070a] text-[#e6ebf1] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[#ff7a1a] text-lg">⚡</span>
            <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">News Wire</h1>
          </div>
          <p className="text-[#6b7684] text-sm">
            Global intelligence from 18 sources — categorized by region and topic.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-[#ff4d4f]/30 bg-[#ff4d4f]/10 rounded text-[#ff4d4f] text-sm">
            {error}
          </div>
        )}

        {/* Headlines */}
        {headlines.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ff7a1a] animate-pulse" />
              <h2 className="text-xs font-mono uppercase tracking-[0.15em] text-[#ff7a1a]">
                Headlines
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {headlines.map((article) => (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg border border-[#212832] bg-[#0a0d12] hover:bg-[#10151c] hover:border-[#2e3742] transition-all group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: regionColors[article.region] || "#454e59" }}
                    />
                    <span className="text-[10px] uppercase tracking-wider text-[#ff7a1a] font-mono">
                      {regionNames[article.region] || article.region}
                    </span>
                    <span className="text-[10px] text-[#454e59] ml-auto font-mono">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-[#e6ebf1] leading-snug group-hover:text-[#ff7a1a] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Region Grid */}
        <section className="mb-8">
          <h2 className="text-xs font-mono uppercase tracking-[0.15em] text-[#6b7684] mb-4">
            By Region
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regionOrder
              .filter((r) => (byRegion[r] ?? []).length > 0)
              .map((region) => (
                <NewsSection
                  key={region}
                  title={regionNames[region] || region}
                  color={regionColors[region] || "#454e59"}
                  articles={byRegion[region] ?? []}
                />
              ))}
          </div>
        </section>

        {/* Topic Grid */}
        <section className="mb-8">
          <h2 className="text-xs font-mono uppercase tracking-[0.15em] text-[#6b7684] mb-4">
            By Topic
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topicOrder
              .filter((t) => (byTopic[t] ?? []).length > 0)
              .map((topic) => (
                <NewsSection
                  key={topic}
                  title={topic}
                  color="#3ba7ff"
                  articles={byTopic[topic] ?? []}
                />
              ))}
          </div>
        </section>

        {/* Raw feed fallback */}
        {articles.length === 0 && !error && (
          <p className="text-[#6b7684] text-sm text-center py-20">
            No articles available right now.
          </p>
        )}
      </div>
    </main>
  );
}
