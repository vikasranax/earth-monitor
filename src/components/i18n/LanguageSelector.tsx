"use client";

import { useState, useEffect } from "react";
import { useLocaleStore } from "@/stores/locale";
import { locales, getLocaleInfo } from "@/lib/i18n/locales";

export function LanguageSelector() {
  const { locale, setLocale } = useLocaleStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const info = getLocaleInfo(locale);
    document.documentElement.setAttribute("lang", locale);
    document.documentElement.setAttribute("dir", info.rtl ? "rtl" : "ltr");
  }, [locale]);

  const current = getLocaleInfo(locale);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-2)] text-[var(--fg-1)] font-mono text-[11px] hover:border-[var(--border-strong)] transition-colors"
      >
        <span>{current.nativeName}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-44 max-h-72 overflow-y-auto rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--bg-1)] shadow-2xl z-50">
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
              className={
                "w-full text-left px-3 py-2 text-xs font-mono transition-colors " +
                (l.code === locale
                  ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "text-[var(--fg-1)] hover:bg-[var(--bg-2)]")
              }
            >
              {l.nativeName} <span className="text-[var(--fg-muted)]">({l.name})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
