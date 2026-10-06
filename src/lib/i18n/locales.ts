export interface LocaleInfo {
  code: string;
  name: string;
  nativeName: string;
  rtl: boolean;
}

// Sanskrit included deliberately — जगत्-मन्थन itself is a Sanskrit-rooted
// name, so it fits the project's identity even though it's unusual for
// live software UI (most Sanskrit content is classical/liturgical, not
// software-localized — there's no single "standard" modern UI register).
export const locales: LocaleInfo[] = [
  { code: "en", name: "English", nativeName: "English", rtl: false },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", rtl: false },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्", rtl: false },
  { code: "ar", name: "Arabic", nativeName: "العربية", rtl: true },
  { code: "fr", name: "French", nativeName: "Français", rtl: false },
  { code: "es", name: "Spanish", nativeName: "Español", rtl: false },
  { code: "ru", name: "Russian", nativeName: "Русский", rtl: false },
  { code: "zh", name: "Chinese", nativeName: "中文", rtl: false },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", rtl: false },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", rtl: false },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", rtl: false },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", rtl: false },
];

export const defaultLocale = "en";

export function getLocaleInfo(code: string): LocaleInfo {
  return locales.find((l) => l.code === code) ?? locales[0]!;
}
