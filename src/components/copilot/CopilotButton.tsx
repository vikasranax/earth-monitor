"use client";

import { useState, useEffect } from "react";
import ChatPanel from "./ChatPanel";

export function CopilotButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-copilot", handler);
    return () => window.removeEventListener("open-copilot", handler);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full font-mono text-xs font-semibold shadow-lg transition-all ${
          open
            ? "bg-[var(--bg-2)] text-[var(--fg-1)] border border-[var(--border-strong)]"
            : "bg-[var(--accent)] text-white hover:bg-[var(--accent-dim)]"
        }`}
      >
        <span className="text-sm">◈</span>
        <span>{open ? "Close Copilot" : "Ask Copilot"}</span>
      </button>
      <ChatPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
