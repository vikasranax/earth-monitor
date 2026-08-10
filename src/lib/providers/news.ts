const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY || "";
const GUARDIAN_BASE = "https://content.guardianapis.com";

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  region: string;
  publishedAt: string;
  url: string;
}

export interface NewsResult {
  articles: NewsArticle[];
  cached: boolean;
  error?: string;
}

/* ── Date normalizer ──────────────────────────────────────── */
function normalizeDate(raw: string): string {
  if (!raw) return new Date().toISOString();
  const cleaned = raw
    .replace(/\bIST\b/g, "+0530")
    .replace(/\bGMT\b/g, "+0000")
    .replace(/\bUTC\b/g, "+0000")
    .replace(/\bPST\b/g, "-0800")
    .replace(/\bEST\b/g, "-0500")
    .trim();
  const d = new Date(cleaned);
  if (!isNaN(d.getTime())) return d.toISOString();
  const noTz = cleaned.replace(/[+-]\d{4}$/, "").trim();
  const d2 = new Date(noTz);
  if (!isNaN(d2.getTime())) return d2.toISOString();
  return new Date().toISOString();
}

/* ── RSS Feeds ────────────────────────────────────────────── */
const RSS_FEEDS = [
  // South Asia
  { name: "The Hindu", url: "https://www.thehindu.com/news/national/?service=rss", region: "IN" },
  { name: "Indian Express", url: "https://indianexpress.com/feed/", region: "IN" },
  { name: "NDTV", url: "https://feeds.feedburner.com/ndtvnews-top-stories", region: "IN" },

  // East Asia
  { name: "Japan Times", url: "https://www.japantimes.co.jp/feed/", region: "JP" },
  { name: "SCMP", url: "https://www.scmp.com/rss/91/feed", region: "CN" },
  {
    name: "Korea Herald",
    url: "http://www.koreaherald.com/common/rss_xml.php?ct=102",
    region: "KR",
  },
  { name: "Pyongyang Times", url: "https://www.pyongyangtimes.com.kp/feeds/home", region: "NK" },

  // South-East Asia
  {
    name: "Bangkok Post",
    url: "https://www.bangkokpost.com/rss/data/topstories.xml",
    region: "TH",
  },
  { name: "Straits Times", url: "https://www.straitstimes.com/news/asia/rss.xml", region: "SG" },

  // Middle East
  { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml", region: "QA" },
  { name: "Middle East Eye", url: "https://www.middleeasteye.net/rss", region: "ME" },

  // Europe & Russia
  { name: "The Guardian", url: "https://www.theguardian.com/world/rss", region: "GB" },
  { name: "BBC World", url: "http://feeds.bbci.co.uk/news/world/rss.xml", region: "GB" },
  { name: "BBC Africa", url: "http://feeds.bbci.co.uk/news/world/africa/rss.xml", region: "AF" },
  { name: "France24", url: "https://www.france24.com/en/rss", region: "FR" },
  { name: "Deutsche Welle", url: "https://rss.dw.com/rdf/rss-en-all", region: "DE" },
  { name: "Moscow Times", url: "https://www.themoscowtimes.com/rss/news", region: "RU" },

  // Americas
  {
    name: "NYT World",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    region: "US",
  },
  { name: "Washington Post", url: "https://feeds.washingtonpost.com/rss/world", region: "US" },
];

/* ── RSS parser ───────────────────────────────────────────── */
function parseRSSXml(xml: string, sourceName: string, region: string): NewsArticle[] {
  const items: NewsArticle[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < 8) {
    const itemXml = match[1];
    if (!itemXml) continue;

    const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
    const descMatch = itemXml.match(
      /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/,
    );
    const dateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

    const title = titleMatch?.[1]?.trim() || "Untitled";
    const url = linkMatch?.[1]?.trim() || "#";
    const description = descMatch?.[1]?.trim() || "";
    const pubDateRaw = dateMatch?.[1]?.trim() || "";
    const cleanDesc = description.replace(/<[^>]+>/g, "").slice(0, 200);

    items.push({
      id: `${sourceName}-${items.length}`,
      title,
      summary: cleanDesc,
      source: sourceName,
      region,
      publishedAt: normalizeDate(pubDateRaw),
      url,
    });
  }

  return items;
}

/* ── Indian / Regional RSS fetch ──────────────────────────── */
async function fetchRegionalNews(): Promise<{ articles: NewsArticle[]; error?: string }> {
  try {
    const results = await Promise.allSettled(
      RSS_FEEDS.map(async (feed) => {
        const res = await fetch(feed.url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; EarthMonitor/1.0)" },
          next: { revalidate: 600 },
        });
        if (!res.ok) {
          console.error(`[NEWS] ${feed.name} failed: ${res.status}`);
          return [];
        }
        const xml = await res.text();
        return parseRSSXml(xml, feed.name, feed.region);
      }),
    );

    const all = results
      .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === "fulfilled")
      .flatMap((r) => r.value);

    return {
      articles: all,
      error: all.length === 0 ? "All RSS feeds returned empty." : undefined,
    };
  } catch (err) {
    return {
      articles: [],
      error: err instanceof Error ? err.message : "RSS fetch failed",
    };
  }
}

/* ── Guardian types ───────────────────────────────────────── */
interface GuardianResult {
  id: string;
  webTitle: string;
  webPublicationDate: string;
  webUrl: string;
  fields?: { trailText?: string };
}

interface GuardianResponse {
  response?: { results?: GuardianResult[] };
}

/* ── Guardian fetch ───────────────────────────────────────── */
async function fetchGuardian(query?: string): Promise<NewsArticle[]> {
  if (!GUARDIAN_API_KEY) {
    console.warn("[NEWS] GUARDIAN_API_KEY missing — skipping Guardian");
    return [];
  }

  const section = query ? `&q=${encodeURIComponent(query)}` : "&section=world";
  const url = `${GUARDIAN_BASE}/search?api-key=${GUARDIAN_API_KEY}${section}&show-fields=trailText&page-size=20&order-by=newest`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    console.error(`[NEWS] Guardian error: ${res.status}`);
    return [];
  }

  const json = (await res.json()) as GuardianResponse;
  const results = json?.response?.results || [];

  return results.map((r) => ({
    id: `guardian-${r.id}`,
    title: r.webTitle || "Untitled",
    summary: r.fields?.trailText?.replace(/<[^>]+>/g, "") || "",
    source: "The Guardian",
    region: "GB",
    publishedAt: r.webPublicationDate
      ? new Date(r.webPublicationDate).toISOString()
      : new Date().toISOString(),
    url: r.webUrl || "#",
  }));
}

/* ── Unified export ───────────────────────────────────────── */
export async function fetchAllNews(query?: string): Promise<NewsResult> {
  const [guardianRes, regionalRes] = await Promise.allSettled([
    fetchGuardian(query),
    fetchRegionalNews(),
  ]);

  const guardian = guardianRes.status === "fulfilled" ? guardianRes.value : [];
  const regional = regionalRes.status === "fulfilled" ? regionalRes.value.articles : [];

  if (guardianRes.status === "rejected")
    console.error("[NEWS] Guardian rejected:", guardianRes.reason);
  if (regionalRes.status === "rejected")
    console.error("[NEWS] Regional rejected:", regionalRes.reason);

  const merged = [...guardian, ...regional].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return {
    articles: merged.slice(0, 30),
    cached: false,
    error: merged.length === 0 ? "All news sources returned empty." : undefined,
  };
}
