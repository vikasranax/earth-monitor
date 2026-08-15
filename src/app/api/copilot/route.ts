import type { NextRequest } from "next/server";
import { fetchAllNews } from "@/lib/providers/news";
import { fetchMarketQuotes, fetchQuote } from "@/lib/providers/yahoo-finance";
import { symbolMap } from "@/lib/markets-watchlist";
import { serverEnv } from "@/lib/env";

export const runtime = "edge";

// Resolves against the project's real AI Gateway env contract
// (GROQ_API_KEY / OPENROUTER_API_KEY, both OpenAI-compatible chat APIs),
// with OPENAI_API_KEY supported as a direct override if explicitly set.
// NOTE: GEMINI_API_KEY exists in the env schema but is NOT wired here —
// Gemini's native API isn't OpenAI-chat-completions-compatible without
// a separate adapter. Flagged as a known gap, not silently pretended to work.
const OPENAI_KEY = process.env.OPENAI_API_KEY || "";
const GROQ_KEY = serverEnv.GROQ_API_KEY || "";
const OPENROUTER_KEY = serverEnv.OPENROUTER_API_KEY || "";

const AI_API_KEY = OPENAI_KEY || GROQ_KEY || OPENROUTER_KEY;
const PROVIDER = OPENAI_KEY ? "openai" : GROQ_KEY ? "groq" : OPENROUTER_KEY ? "openrouter" : "none";

const AI_BASE_URL =
  process.env.AI_BASE_URL ||
  (PROVIDER === "groq"
    ? "https://api.groq.com/openai/v1"
    : PROVIDER === "openrouter"
      ? "https://openrouter.ai/api/v1"
      : "https://api.openai.com/v1");

const AI_MODEL =
  process.env.AI_MODEL ||
  (PROVIDER === "groq"
    ? "llama-3.3-70b-versatile"
    : PROVIDER === "openrouter"
      ? "openai/gpt-4o-mini"
      : "gpt-4o-mini");

function detectIntent(message: string): "news" | "markets" | "general" {
  const m = message.toLowerCase();
  if (/\b(news|headlines|happening|going on|report|article|updates?)\b/.test(m)) return "news";
  if (
    /\b(market|stock|price|crypto|bitcoin|oil|gold|fx|forex|trading|index|nasdaq|sp500|s&p|equity|share|rupee|rupees|nifty|sensex|dollar|yen|won|yuan|renminbi|ether|inr|riyal|dirham|shekel|real|peso|loonie|ruble|rouble|rand|naira|pound|sterling|euro|bovespa|merval|nikkei|kospi|dax|cac|ftse|ibex|mib|jse|sti|klci|psei|jci|set|ipc)\b/.test(
      m,
    )
  )
    return "markets";
  return "general";
}

async function buildGrounding(intent: "news" | "markets" | "general", message: string) {
  if (intent === "news") {
    const query = message.replace(/news|headlines|happening|updates?/gi, "").trim();
    const { articles } = await fetchAllNews(query || undefined);
    if (articles.length === 0) return { context: "", citations: [] };

    // fetchAllNews() only filters Guardian by query — the RSS aggregator
    // returns everything unfiltered, so without this extra pass, whichever
    // feed posted most recently dominates the citation list regardless of
    // topic relevance. Filter to articles actually mentioning the query terms.
    let relevant = articles;
    if (query) {
      const terms = query
        .toLowerCase()
        .split(/\s+/)
        .filter((t) => t.length > 2);
      const matched = articles.filter((a) => {
        const text = (a.title + " " + a.summary).toLowerCase();
        return terms.some((t) => text.includes(t));
      });
      if (matched.length > 0) relevant = matched;
    }

    const top = relevant.slice(0, 8);
    const context = top
      .map((a, i) => `[${i + 1}] ${a.title} — ${a.source} (${a.publishedAt})\n${a.summary}`)
      .join("\n\n");

    const citations = top.map((a) => ({
      title: a.title,
      source: a.source,
      url: a.url,
      time: a.publishedAt,
    }));

    return { context, citations };
  }

  if (intent === "markets") {
    const msgUpper = message.toUpperCase();
    const matchedSymbols = new Set<string>();

    for (const [alias, item] of symbolMap.entries()) {
      if (msgUpper.includes(alias)) matchedSymbols.add(item.symbol);
    }

    const rawTokens = msgUpper.split(/\s+/);
    for (const t of rawTokens) {
      const clean = t.replace(/[^A-Z./]/g, "");
      const entry = clean ? symbolMap.get(clean) : undefined;
      if (entry) matchedSymbols.add(entry.symbol);
    }

    const specificQuotes = [];
    for (const sym of Array.from(matchedSymbols).slice(0, 3)) {
      const q = await fetchQuote(sym);
      if (q) specificQuotes.push(q);
    }

    const { quotes: allQuotes } = await fetchMarketQuotes();

    const lines: string[] = [];

    if (specificQuotes.length > 0) {
      lines.push("--- SPECIFIC ASSETS ---");
      for (const q of specificQuotes) {
        const arrow = q.percentChange >= 0 ? "▲" : "▼";
        lines.push(
          `${q.label} (${q.symbol}): ${q.price.toFixed(2)} ${q.currency} ${arrow} ${q.percentChange.toFixed(2)}%`,
        );
      }
    }

    const alwaysInclude = ["USD/INR", "GLD", "BTC-USD"];
    const extras = allQuotes.filter(
      (q) => alwaysInclude.includes(q.symbol) && !matchedSymbols.has(q.symbol),
    );
    if (extras.length > 0) {
      lines.push("--- REFERENCE RATES ---");
      for (const q of extras) {
        const arrow = q.percentChange >= 0 ? "▲" : "▼";
        lines.push(
          `${q.label} (${q.symbol}): ${q.price.toFixed(2)} ${q.currency} ${arrow} ${q.percentChange.toFixed(2)}%`,
        );
      }
    }

    const broad = allQuotes
      .filter((q) => !matchedSymbols.has(q.symbol) && !alwaysInclude.includes(q.symbol))
      .slice(0, 12);
    if (broad.length > 0) {
      lines.push("--- BROAD MARKET ---");
      for (const q of broad) {
        const arrow = q.percentChange >= 0 ? "▲" : "▼";
        lines.push(
          `${q.label} (${q.symbol}): ${q.price.toFixed(2)} ${q.currency} ${arrow} ${q.percentChange.toFixed(2)}%`,
        );
      }
    }

    if (lines.length === 0) {
      return { context: "Market data temporarily unavailable.", citations: [] };
    }

    return { context: lines.join("\n"), citations: [] };
  }

  return { context: "", citations: [] };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message ?? body?.content ?? body?.text ?? body?.query ?? body?.prompt;

    if (!message || typeof message !== "string") {
      console.warn("[COPILOT] Bad body keys:", Object.keys(body));
      return new Response(
        JSON.stringify({
          error: "Message required",
          receivedKeys: Object.keys(body),
        }),
        { status: 400 },
      );
    }

    if (!AI_API_KEY) {
      return new Response(
        JSON.stringify({
          error:
            "No AI API key configured. Set GROQ_API_KEY or OPENROUTER_API_KEY in .env.local (GEMINI_API_KEY is not yet wired to this route).",
        }),
        { status: 503 },
      );
    }

    const intent = detectIntent(message);
    const { context, citations } = await buildGrounding(intent, message);

    const systemPrompt = `You are Earth Copilot (जगत्-मन्थन), a real-time global intelligence assistant.
You answer questions about geopolitics, markets, shipping, airspace, disasters, and infrastructure.
Rules:
- Every factual claim must cite a source using [1], [2], etc.
- If live data is provided below, ground your answer in it. If no live data is provided, answer from your training knowledge but do NOT claim it is live.
- Respond in the same language the user writes in.
- Be concise. No fluff.

${context ? `--- LIVE DATA ---\n${context}\n--- END LIVE DATA ---` : ""}`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(Array.isArray(body.history) ? body.history.slice(-6) : []),
      { role: "user", content: message },
    ];

    console.warn("[COPILOT] Provider:", PROVIDER);
    console.warn("[COPILOT] Model:", AI_MODEL);

    const aiRes = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages,
        stream: true,
        temperature: 0.4,
        max_tokens: 800,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.warn("[COPILOT] AI HTTP", aiRes.status, errText);
      return new Response(
        JSON.stringify({
          error: `AI service error ${aiRes.status}`,
          detail: errText,
        }),
        { status: 502 },
      );
    }

    const headers = new Headers(aiRes.headers);
    headers.set("Content-Type", "text/event-stream");
    if (citations.length > 0) {
      headers.set("X-Citations", encodeURIComponent(JSON.stringify(citations)));
    }

    return new Response(aiRes.body, { headers });
  } catch (err) {
    console.warn("[COPILOT] Unhandled error:", err);
    return new Response(
      JSON.stringify({
        error: "Copilot error",
        detail: err instanceof Error ? err.message : String(err),
      }),
      { status: 500 },
    );
  }
}
