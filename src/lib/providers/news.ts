const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY || "";
const GUARDIAN_BASE = "https://content.guardianapis.com";

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
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

/* ── Indian RSS parser ────────────────────────────────────── */
function parseRSSXml(xml: string, sourceName: string): NewsArticle[] {
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
      publishedAt: normalizeDate(pubDateRaw),
      url,
    });
  }

  return items;
}

const RSS_FEEDS = [
  { name: "The Hindu", url: "https://www.thehindu.com/news/national/?service=rss" },
  { name: "Indian Express", url: "https://indianexpress.com/feed/" },
  { name: "NDTV", url: "https://feeds.feedburner.com/ndtvnews-top-stories" },
];

async function fetchIndianNews(): Promise<{ articles: NewsArticle[]; error?: string }> {
  try {
    const results = await Promise.allSettled(
      RSS_FEEDS.map(async (feed) => {
        const res = await fetch(feed.url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; EarthMonitor/1.0)" },
          next: { revalidate: 600 },
        });
        if (!res.ok) {
          console.error(`[INDIAN NEWS] ${feed.name} failed: ${res.status}`);
          return [];
        }
        const xml = await res.text();
        return parseRSSXml(xml, feed.name);
      }),
    );

    const all = results
      .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === "fulfilled")
      .flatMap((r) => r.value);

    return {
      articles: all,
      error: all.length === 0 ? "All Indian RSS feeds returned empty." : undefined,
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

/* ── Guardian ─────────────────────────────────────────────── */
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
    publishedAt: r.webPublicationDate
      ? new Date(r.webPublicationDate).toISOString()
      : new Date().toISOString(),
    url: r.webUrl || "#",
  }));
}

/* ── Unified export ───────────────────────────────────────── */
export async function fetchAllNews(query?: string): Promise<NewsResult> {
  const [guardianRes, indianRes] = await Promise.allSettled([
    fetchGuardian(query),
    fetchIndianNews(),
  ]);

  const guardian = guardianRes.status === "fulfilled" ? guardianRes.value : [];
  const indian = indianRes.status === "fulfilled" ? indianRes.value.articles : [];

  if (guardianRes.status === "rejected")
    console.error("[NEWS] Guardian rejected:", guardianRes.reason);
  if (indianRes.status === "rejected") console.error("[NEWS] Indian rejected:", indianRes.reason);

  const merged = [...guardian, ...indian].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return {
    articles: merged.slice(0, 25),
    cached: false,
    error: merged.length === 0 ? "All news sources returned empty." : undefined,
  };
}
