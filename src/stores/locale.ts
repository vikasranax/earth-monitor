"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultLocale, getLocaleInfo } from "@/lib/i18n/locales";

interface LocaleState {
  locale: string;
  setLocale: (locale: string) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      setLocale: (locale) => {
        set({ locale });
        if (typeof document !== "undefined") {
          const info = getLocaleInfo(locale);
          document.documentElement.setAttribute("lang", locale);
          document.documentElement.setAttribute("dir", info.rtl ? "rtl" : "ltr");
        }
      },
    }),
    { name: "jagat-manthan-locale" },
  ),
);
