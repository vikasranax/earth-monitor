import type { NextRequest } from "next/server";
import { fetchAllNews } from "@/lib/providers/news";
import { fetchMarketQuotes, fetchQuote } from "@/lib/providers/yahoo-finance";
import { symbolMap } from "@/lib/markets-watchlist";

export const runtime = "edge";

const RAW_KEY = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || "";
const IS_GROQ = RAW_KEY.startsWith("gsk_");
const AI_API_KEY = RAW_KEY;
const AI_BASE_URL =
  process.env.AI_BASE_URL ||
  (IS_GROQ ? "https://api.groq.com/openai/v1" : "https://api.openai.com/v1");
const AI_MODEL = process.env.AI_MODEL || (IS_GROQ ? "llama-3.3-70b-versatile" : "gpt-4o-mini");

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

/* ── Build grounding context ──────────────────────────────── */
async function buildGrounding(intent: "news" | "markets" | "general", message: string) {
  /* ── News ─────────────────────────────────────────────── */
  if (intent === "news") {
    const query = message.replace(/news|headlines|happening|updates?/gi, "").trim();
    const { articles } = await fetchAllNews(query || undefined);
    if (articles.length === 0) return { context: "", citations: [] };

    const context = articles
      .slice(0, 8)
      .map((a, i) => `[${i + 1}] ${a.title} — ${a.source} (${a.publishedAt})\n${a.summary}`)
      .join("\n\n");

    const citations = articles.slice(0, 8).map((a) => ({
      title: a.title,
      source: a.source,
      url: a.url,
      time: a.publishedAt,
    }));

    return { context, citations };
  }

  /* ── Markets ──────────────────────────────────────────── */
  if (intent === "markets") {
    const msgUpper = message.toUpperCase();
    const matchedSymbols = new Set<string>();

    // Resolve via alias map
    for (const [alias, item] of symbolMap.entries()) {
      if (msgUpper.includes(alias)) matchedSymbols.add(item.symbol);
    }

    // Also check raw tokens
    const rawTokens = msgUpper.split(/\s+/);
    for (const t of rawTokens) {
      const clean = t.replace(/[^A-Z./]/g, "");
      if (clean && symbolMap.has(clean)) matchedSymbols.add(symbolMap.get(clean)!.symbol);
    }

    // Fetch specific matches
    const specificQuotes = [];
    for (const sym of Array.from(matchedSymbols).slice(0, 3)) {
      const q = await fetchQuote(sym);
      if (q) specificQuotes.push(q);
    }

    // Fetch broad watchlist
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

    // Always include USD/INR + GLD for commodity context
    const alwaysInclude = ["USD/INR", "GLD", "BTC/USD"];
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

    // Broad market snapshot
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

/* ── POST handler ────────────────────────────────────────── */
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
      return new Response(JSON.stringify({ error: "No AI API key configured. Check .env.local" }), {
        status: 503,
      });
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
      ...(body.history || []).slice(-6),
      { role: "user", content: message },
    ];

    console.warn("[COPILOT] Provider:", IS_GROQ ? "Groq" : "OpenAI");
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
