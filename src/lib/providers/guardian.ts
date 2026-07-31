import { fetchWithCache } from "@/lib/fetch-with-cache";
import { checkRateLimit } from "@/lib/rate-limit";
import { serverEnv } from "@/lib/env";

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  section: string;
  publishedAt: string;
  trailText?: string;
}

export interface NewsFetchResult {
  armed: boolean;
  articles: NewsArticle[];
  cached: boolean;
  error?: string;
}

interface GuardianApiResult {
  id: string;
  webTitle: string;
  webUrl: string;
  sectionName: string;
  webPublicationDate: string;
  fields?: { trailText?: string };
}

interface GuardianApiResponse {
  response: { results: GuardianApiResult[] };
}

const PROVIDER_ID = "guardian";

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

export async function fetchGuardianNews(): Promise<NewsFetchResult> {
  if (!serverEnv.GUARDIAN_API_KEY) {
    return { armed: false, articles: [], cached: false };
  }

  const rate = await checkRateLimit(PROVIDER_ID, 12, 60);
  if (!rate.success) {
    return {
      armed: true,
      articles: [],
      cached: false,
      error: "Rate limit reached — try again shortly.",
    };
  }

  try {
    const { data, cached } = await fetchWithCache(
      "news:guardian:latest",
      async () => {
        const url = `https://content.guardianapis.com/search?api-key=${serverEnv.GUARDIAN_API_KEY}&order-by=newest&page-size=20&show-fields=trailText`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Guardian API responded ${res.status}`);
        const json = (await res.json()) as GuardianApiResponse;
        const results = json?.response?.results ?? [];
        return results.map((r): NewsArticle => ({
          id: r.id,
          title: r.webTitle,
          url: r.webUrl,
          section: r.sectionName,
          publishedAt: r.webPublicationDate,
          trailText: r.fields?.trailText ? stripHtml(r.fields.trailText) : undefined,
        }));
      },
      { ttlSeconds: 120 },
    );

    return { armed: true, articles: data, cached };
  } catch (err) {
    return {
      armed: true,
      articles: [],
      cached: false,
      error: err instanceof Error ? err.message : "Unknown error fetching news",
    };
  }
}
