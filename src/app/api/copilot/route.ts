import type { NextRequest } from "next/server";
import { fetchAllNews } from "@/lib/providers/news";

export const runtime = "edge";

/* ── AI Gateway config ────────────────────────────────────── */
const RAW_KEY = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || "";

// Auto-detect provider from key prefix
const IS_GROQ = RAW_KEY.startsWith("gsk_");
const AI_API_KEY = RAW_KEY;
const AI_BASE_URL =
  process.env.AI_BASE_URL ||
  (IS_GROQ ? "https://api.groq.com/openai/v1" : "https://api.openai.com/v1");
const AI_MODEL = process.env.AI_MODEL || (IS_GROQ ? "llama-3.3-70b-versatile" : "gpt-4o-mini");

/* ── Intent detection ─────────────────────────────────────── */
function detectIntent(message: string): "news" | "markets" | "general" {
  const m = message.toLowerCase();
  if (/\b(news|headlines|happening|going on|report|article|updates?)\b/.test(m)) return "news";
  if (/\b(market|stock|price|crypto|bitcoin|oil|gold|fx|forex)\b/.test(m)) return "markets";
  return "general";
}

/* ── Fetch grounding context ──────────────────────────────── */
async function buildGrounding(intent: "news" | "markets" | "general", message: string) {
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

  if (intent === "markets") {
    return {
      context: "Live market data provider not yet wired (M07).",
      citations: [],
    };
  }

  return { context: "", citations: [] };
}

/* ── Route handler ────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message ?? body?.content ?? body?.text ?? body?.query ?? body?.prompt;

    if (!message || typeof message !== "string") {
      console.error("[COPILOT] Bad body keys:", Object.keys(body));
      return new Response(
        JSON.stringify({
          error: "Message required",
          receivedKeys: Object.keys(body),
        }),
        { status: 400 },
      );
    }

    if (!AI_API_KEY) {
      console.error("[COPILOT] No AI key found. Set GROQ_API_KEY or OPENAI_API_KEY in .env.local");
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

    console.log("[COPILOT] Provider:", IS_GROQ ? "Groq" : "OpenAI");
    console.log("[COPILOT] Endpoint:", AI_BASE_URL);
    console.log("[COPILOT] Model:", AI_MODEL);

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
      console.error("[COPILOT] AI HTTP", aiRes.status, errText);
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
    console.error("[COPILOT] Unhandled error:", err);
    return new Response(
      JSON.stringify({
        error: "Copilot error",
        detail: err instanceof Error ? err.message : String(err),
      }),
      { status: 500 },
    );
  }
}
