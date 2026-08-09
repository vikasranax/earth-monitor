"use client";

import { useState, useRef, useEffect } from "react";

interface ChatMsg {
  role: "user" | "copilot";
  content: string;
  citations?: string;
}

interface ChatPanelProps {
  open?: boolean;
  onClose?: () => void;
}

export default function ChatPanel({ open: controlledOpen, onClose }: ChatPanelProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = (v: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(v);
    if (!v) onClose?.();
  };

  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    {
      role: "copilot",
      content:
        "जगत्-मन्थन copilot online. Ask me anything about live geopolitics, markets, shipping, airspace, earthquakes, or infrastructure. I cite every claim.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  async function send() {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMsg = { role: "user", content: text };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: msgs.slice(-6).map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMsgs((m) => [
          ...m,
          {
            role: "copilot",
            content: err.error || `Error ${res.status}`,
            citations: err.receivedKeys
              ? `Received keys: ${err.receivedKeys.join(", ")}`
              : undefined,
          },
        ]);
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      setMsgs((m) => [...m, { role: "copilot", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content || "";
              fullText += delta;
              setMsgs((m) => {
                const last = m[m.length - 1];
                if (!last || last.role !== "copilot") return m;
                const next = [...m];
                next[next.length - 1] = { ...last, content: fullText };
                return next;
              });
            } catch {
              // ignore malformed SSE lines
            }
          }
        }
      }

      setLoading(false);
    } catch {
      setMsgs((m) => [...m, { role: "copilot", content: "Network error. Check console." }]);
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 w-[420px] max-w-[92vw] h-[560px] flex flex-col rounded-lg border border-[#212832] bg-[#0a0d12] shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#212832]">
        <div className="flex items-center gap-2">
          <span className="text-[#ff7a1a]">◆</span>
          <span className="text-sm font-semibold text-[#e6ebf1]">Earth Copilot</span>
          <span className="w-2 h-2 rounded-full bg-[#2ecc71]" />
          <span className="text-[10px] text-[#2ecc71] uppercase tracking-wider">Live</span>
        </div>
        <button onClick={() => setOpen(false)} className="text-[#6b7684] hover:text-[#e6ebf1]">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div className="text-[10px] uppercase tracking-wider text-[#6b7684] mb-1">{m.role}</div>
            <div
              className={`inline-block max-w-[90%] px-3 py-2 rounded-md text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-[#212832] text-[#e6ebf1]"
                  : "bg-[#10151c] text-[#a8b3c1] border border-[#212832]"
              }`}
            >
              {m.content || (loading && i === msgs.length - 1 ? "…" : "")}
            </div>
            {m.citations && <div className="text-[10px] text-[#454e59] mt-1">{m.citations}</div>}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-[#212832] flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask in any language…"
          className="flex-1 bg-[#05070a] border border-[#212832] rounded px-3 py-2 text-sm text-[#e6ebf1] placeholder-[#454e59] focus:outline-none focus:border-[#ff7a1a]"
        />
        <button
          onClick={send}
          disabled={loading}
          className="px-4 py-2 rounded bg-[#ff7a1a] text-[#05070a] text-sm font-semibold hover:bg-[#b8560f] disabled:opacity-50"
        >
          →
        </button>
      </div>
      <div className="px-4 pb-2 text-[10px] text-[#454e59] text-center">
        Every answer cites the underlying data point
      </div>
    </div>
  );
}
