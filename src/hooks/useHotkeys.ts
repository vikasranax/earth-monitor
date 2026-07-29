"use client";

import { useEffect, useRef } from "react";

type HotkeyHandler = (event: KeyboardEvent) => void;

interface HotkeyBinding {
  /** e.g. "mod+k", "shift+/", "escape" */
  combo: string;
  handler: HotkeyHandler;
  /** Prevent default browser behavior (e.g. Cmd+K opening browser search) */
  preventDefault?: boolean;
}

function normalizeCombo(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.metaKey || e.ctrlKey) parts.push("mod");
  if (e.shiftKey) parts.push("shift");
  if (e.altKey) parts.push("alt");
  const key = e.key.toLowerCase();
  if (!["control", "meta", "shift", "alt"].includes(key)) {
    parts.push(key === " " ? "space" : key);
  }
  return parts.join("+");
}

/**
 * Global hotkey registration. Combos use "mod" for Cmd (Mac) / Ctrl (Win/Linux).
 * Example: useHotkeys([{ combo: "mod+k", handler: () => open() }])
 */
export function useHotkeys(bindings: HotkeyBinding[]) {
  const bindingsRef = useRef(bindings);
  bindingsRef.current = bindings;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      const combo = normalizeCombo(e);

      for (const binding of bindingsRef.current) {
        if (binding.combo === combo) {
          // Allow mod+k (command palette) even while typing; block plain
          // single-key hotkeys while the user is in a text field.
          if (isTyping && !combo.startsWith("mod+") && combo !== "escape") continue;
          if (binding.preventDefault) e.preventDefault();
          binding.handler(e);
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}