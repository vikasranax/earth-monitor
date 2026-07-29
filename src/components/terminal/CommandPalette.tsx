"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useSettingsStore } from "@/stores/settings";
import { useHotkeys } from "@/hooks/useHotkeys";
import { paletteOverlay, paletteModal } from "@/lib/motion";

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  action: () => void;
}

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, toggleCommandPalette } =
    useSettingsStore();
  const [query, setQuery] = useState("");
  const router = useRouter();

  useHotkeys([
    { combo: "mod+k", handler: () => toggleCommandPalette(), preventDefault: true },
    { combo: "escape", handler: () => setCommandPaletteOpen(false) },
  ]);

  useEffect(() => {
    if (!commandPaletteOpen) setQuery("");
  }, [commandPaletteOpen]);

  const commands: CommandItem[] = useMemo(
    () => [
      { id: "home", label: "Go to Home Command Deck", hint: "G H", action: () => router.push("/") },
      { id: "map", label: "Go to Global Map", hint: "G M", action: () => router.push("/map") },
      { id: "news", label: "Go to News Engine", hint: "G N", action: () => router.push("/news") },
      { id: "design", label: "Go to Design Showcase", hint: "", action: () => router.push("/design") },
    ],
    [router],
  );

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()),
  );

  function run(cmd: CommandItem) {
    cmd.action();
    setCommandPaletteOpen(false);
  }

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <motion.div
          variants={paletteOverlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-[15vh]"
          onClick={() => setCommandPaletteOpen(false)}
        >
          <motion.div
            variants={paletteModal}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--bg-1)] shadow-[var(--shadow-panel)] overflow-hidden"
            role="dialog"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)]">
              <Search size={14} className="text-[var(--fg-2)]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command…"
                className="w-full bg-transparent outline-none font-mono text-sm text-[var(--fg-0)] placeholder:text-[var(--fg-muted)]"
              />
            </div>
            <ul className="max-h-72 overflow-y-auto py-1">
              {filtered.length === 0 && (
                <li className="px-4 py-3 text-xs text-[var(--fg-muted)] font-mono">
                  No matching commands
                </li>
              )}
              {filtered.map((cmd) => (
                <li key={cmd.id}>
                  <button
                    onClick={() => run(cmd)}
                    className="w-full flex items-center justify-between px-4 py-2 text-left text-sm text-[var(--fg-0)] hover:bg-[var(--bg-2)] transition-colors font-mono"
                  >
                    <span>{cmd.label}</span>
                    {cmd.hint && (
                      <span className="text-[10px] text-[var(--fg-muted)]">{cmd.hint}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}