import Link from "next/link";
import { fetchAllNews } from "@/lib/providers/news";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel } from "@/components/terminal";

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

function detectTopics(article: NewsArticle): string[] {
  const text = ` ${article.title} ${article.summary} `.toLowerCase();
  const topics: string[] = [];

  const topicKeywords: Record<string, string[]> = {
    Technology: [" technology ", " software ", " digital ", " cyber", " internet ", " startup", " silicon ", " semiconductor", " chip ", " telecom", " 5g ", " blockchain"],
    AI: [" artificial intelligence", " machine learning", " deep learning", " generative ai", " chatgpt", " openai", " deepseek", " llm ", " neural network", " large language model", " gemini", " claude", " copilot"],
    Automobile: [" car ", " auto ", " vehicle", " electric vehicle", " ev ", " tesla", " toyota", " hyundai", " maruti", " mahindra", " tata motors", " ford", " bmw", " mercedes", " audi", " volkswagen", " honda", " volvo"],
    Sports: [" cricket", " football", " soccer", " ipl", " fifa", " olympic", " tennis", " basketball", " athlete", " match", " tournament", " championship", " world cup", " grand slam", " formula 1", " f1 "],
    Defence: [" defence", " defense", " military", " army", " navy", " air force", " missile", " drone", " war ", " conflict", " troop", " weapon", " tank", " fighter jet", " submarine", " border"],
    Markets: [" stock market", " sensex", " nifty", " nasdaq", " investor", " bull run", " bear market", " rally", " crash", " ipo", " dividend", " earnings", " quarterly result"],
    Health: [" health", " hospital", " vaccine", " covid", " disease", " virus", " medical", " doctor", " patient", " who ", " outbreak", " epidemic"],
    Climate: [" climate", " flood", " drought", " cyclone", " hurricane", " earthquake", " wildfire", " heatwave", " monsoon", " rainfall", " temperature", " pollution", " carbon"],
    Politics: [" election", " vote", " minister", " prime minister", " president", " parliament", " government", " policy", " cabinet", " opposition", " campaign", " poll"],
  };

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some((k) => text.includes(k))) topics.push(topic);
  }

  return topics;
}

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
    <div style={{ borderLeft: `3px solid ${color}` }}>
      <Panel title={title} eyebrow={`${articles.length} STORIES`}>
        <div className="flex flex-col divide-y divide-[var(--border)] -mx-4 -mb-4">
          {articles.slice(0, 5).map((article) => (
            <Link
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 hover:bg-[var(--bg-2)] transition-colors group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-medium text-[var(--fg-0)] leading-snug group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-[11px] text-[var(--fg-2)] mt-1 line-clamp-1">
                    {article.summary}
                  </p>
                </div>
                <span className="text-[10px] text-[var(--fg-muted)] font-mono whitespace-nowrap shrink-0 mt-0.5">
                  {article.source}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export default async function NewsPage() {
  const { articles, error } = await fetchAllNews();

  const byRegion: Record<string, NewsArticle[]> = {};
  const byTopic: Record<string, NewsArticle[]> = {
    Technology: [],
    AI: [],
    Automobile: [],
    Sports: [],
  };

  for (const article of articles) {
    const regionKey = article.region || "GL";
    if (!byRegion[regionKey]) byRegion[regionKey] = [];
    byRegion[regionKey].push(article);

    const topics = detectTopics(article);
    for (const topic of topics) {
      if (byTopic[topic]) byTopic[topic].push(article);
    }
  }

  const headlines = articles.slice(0, 6);

  const regionOrder = ["IN", "NK", "CN", "JP", "KR", "SG", "IL", "WA", "EU", "GB", "FR", "RU", "US", "AF"];
  const topicOrder = ["Technology", "AI", "Automobile", "Sports"];

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-6xl mx-auto w-full flex flex-col gap-6">
          <Panel title="News Wire" eyebrow="18 SOURCES">
            <p className="text-sm text-[var(--fg-2)] font-mono">
              Global intelligence — categorized by region and topic.
            </p>
          </Panel>

          {error && (
            <Panel title="Error" eyebrow="NEWS WIRE">
              <p className="text-sm text-[var(--danger)] font-mono">{error}</p>
            </Panel>
          )}

          {headlines.length > 0 && (
            <Panel title="Headlines" eyebrow="LATEST">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {headlines.map((article) => (
                  <Link
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-[var(--radius-sm)] border border-[var(--border)] hover:bg-[var(--bg-2)] hover:border-[var(--border-strong)] transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: regionColors[article.region] || "var(--fg-muted)" }}
                      />
                      <span className="text-[10px] uppercase tracking-wider text-[var(--accent)] font-mono">
                        {regionNames[article.region] || article.region}
                      </span>
                      <span className="text-[10px] text-[var(--fg-muted)] ml-auto font-mono">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-[var(--fg-0)] leading-snug group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </Panel>
          )}

          <div>
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--fg-2)] mb-3">
              By Region
            </div>
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
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--fg-2)] mb-3">
              By Topic
            </div>
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
          </div>

          {articles.length === 0 && !error && (
            <Panel title="No Data" eyebrow="NEWS WIRE">
              <p className="text-sm text-[var(--fg-2)] font-mono text-center py-8">
                No articles available right now.
              </p>
            </Panel>
          )}
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
