"use client";

import { useLocaleStore } from "@/stores/locale";
import { translations, type TranslationKey } from "@/lib/i18n/translations";
import { defaultLocale } from "@/lib/i18n/locales";

export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale);

  function t(key: TranslationKey): string {
    return translations[locale]?.[key] ?? translations[defaultLocale]?.[key] ?? key;
  }

  return { t, locale };
}
