"use client";

import { useState, useRef, useEffect } from "react";

interface Citation {
  title: string;
  source: string;
  url: string;
  time: string;
}

interface ChatMsg {
  role: "user" | "copilot";
  content: string;
  citations?: Citation[];
  errorDetail?: string;
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
    { role: "copilot", content: "Earth Copilot online. Ask about live geopolitics, markets, shipping, airspace, earthquakes, or infrastructure. I cite every claim." },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  async function send() {
    const text = input.trim();
    if (!text) return;

    setMsgs((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: msgs.slice(-6).map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const detail = err.receivedKeys ? "Received keys: " + err.receivedKeys.join(", ") : err.detail;
        setMsgs((m) => [...m, { role: "copilot", content: err.error || "Error " + res.status, errorDetail: detail }]);
        setLoading(false);
        return;
      }

      let citations: Citation[] | undefined;
      const citationsHeader = res.headers.get("X-Citations");
      if (citationsHeader) {
        try {
          citations = JSON.parse(decodeURIComponent(citationsHeader));
        } catch {
          citations = undefined;
        }
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

      if (citations && citations.length > 0) {
        setMsgs((m) => {
          const last = m[m.length - 1];
          if (!last || last.role !== "copilot") return m;
          const next = [...m];
          next[next.length - 1] = { ...last, citations };
          return next;
        });
      }

      setLoading(false);
    } catch {
      setMsgs((m) => [...m, { role: "copilot", content: "Network error. Check console." }]);
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 w-[420px] max-w-[92vw] h-[560px] flex flex-col rounded-lg border border-[var(--border)] bg-[var(--bg-1)] shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--fg-0)]">Earth Copilot</span>
          <span className="w-2 h-2 rounded-full bg-[var(--ok)]" />
          <span className="text-[10px] text-[var(--ok)] uppercase tracking-wider">Live</span>
        </div>
        <button onClick={() => setOpen(false)} className="text-[var(--fg-2)] hover:text-[var(--fg-0)]">Close</button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div className="text-[10px] uppercase tracking-wider text-[var(--fg-2)] mb-1">{m.role}</div>
            <div className={m.role === "user" ? "inline-block max-w-[90%] px-3 py-2 rounded-md text-sm leading-relaxed bg-[var(--bg-3)] text-[var(--fg-0)]" : "inline-block max-w-[90%] px-3 py-2 rounded-md text-sm leading-relaxed bg-[var(--bg-2)] text-[var(--fg-1)] border border-[var(--border)]"}>
              {m.content || (loading && i === msgs.length - 1 ? "..." : "")}
            </div>
            {m.errorDetail && <div className="text-[10px] text-[var(--fg-muted)] mt-1">{m.errorDetail}</div>}
            {m.citations && m.citations.length > 0 && (<div className="mt-1.5 flex flex-col gap-0.5">{m.citations.map((c, ci) => (<a key={ci} href={c.url} target="_blank" rel="noreferrer" className="text-[10px] text-[var(--accent)] hover:underline truncate block">{"[" + (ci + 1) + "] " + c.source + " - " + c.title}</a>))}</div>)}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-[var(--border)] flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask in any language..." className="flex-1 bg-[var(--bg-0)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--fg-0)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-[var(--accent)]" />
        <button onClick={send} disabled={loading} className="px-4 py-2 rounded bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-dim)] disabled:opacity-50">Send</button>
      </div>
      <div className="px-4 pb-2 text-[10px] text-[var(--fg-muted)] text-center">Every answer cites the underlying data point</div>
    </div>
  );
}
