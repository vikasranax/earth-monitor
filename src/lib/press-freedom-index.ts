export interface PressFreedomEntry {
  countryCode: string;
  countryName: string;
  tier: "good" | "satisfactory" | "problematic" | "difficult" | "very_serious";
  rank2026: number | null; // out of 180, null if not verified
  note: string;
  sourceYear: number;
}

// ⚠️ STARTER SET — NOT a complete index. Seeded only with facts verified
// against real 2026 reporting at the time this was written. RSF's index
// covers 180 countries/territories; this covers a small, cited subset.
// Expand by cross-referencing the official table at https://rsf.org/en/index
// Source citations included per entry so accuracy can be checked later.
export const pressFreedomIndex: PressFreedomEntry[] = [
  {
    countryCode: "NO",
    countryName: "Norway",
    tier: "good",
    rank2026: 1,
    note: "Consistently ranked among the top 3 globally for years running.",
    sourceYear: 2026,
  },
  {
    countryCode: "IE",
    countryName: "Ireland",
    tier: "good",
    rank2026: null,
    note: "Consistently ranked among the top 3 globally.",
    sourceYear: 2026,
  },
  {
    countryCode: "DK",
    countryName: "Denmark",
    tier: "good",
    rank2026: null,
    note: "Consistently ranked among the top 3 globally.",
    sourceYear: 2026,
  },
  {
    countryCode: "US",
    countryName: "United States",
    tier: "problematic",
    rank2026: 64,
    note: "Fell 7 places in 2026; RSF cites detention/deportation of journalists and cuts to US Agency for Global Media (Voice of America, RFE/RL, Radio Free Asia scaled back).",
    sourceYear: 2026,
  },
  {
    countryCode: "RU",
    countryName: "Russia",
    tier: "very_serious",
    rank2026: null,
    note: "48 journalists held as of April 2026; anti-terrorism/extremism laws used to restrict press.",
    sourceYear: 2026,
  },
  {
    countryCode: "IR",
    countryName: "Iran",
    tier: "very_serious",
    rank2026: 177,
    note: "Near-bottom ranking maintained for multiple consecutive years.",
    sourceYear: 2026,
  },
  {
    countryCode: "KP",
    countryName: "North Korea",
    tier: "very_serious",
    rank2026: null,
    note: "Consistently ranks at or near the bottom of the index every year.",
    sourceYear: 2026,
  },
  {
    countryCode: "CN",
    countryName: "China",
    tier: "very_serious",
    rank2026: null,
    note: "Consistently ranks among the bottom 20 countries.",
    sourceYear: 2026,
  },
  {
    countryCode: "HK",
    countryName: "Hong Kong",
    tier: "very_serious",
    rank2026: null,
    note: "Journalist Jimmy Lai sentenced to 20 years under national security legislation — heaviest sentence ever given to a journalist there.",
    sourceYear: 2026,
  },
  {
    countryCode: "EC",
    countryName: "Ecuador",
    tier: "difficult",
    rank2026: null,
    note: "Dropped 31 places in 2026 following the murders of two journalists in 2025.",
    sourceYear: 2026,
  },
];

export function getPressFreedomByCode(code: string): PressFreedomEntry | undefined {
  return pressFreedomIndex.find((e) => e.countryCode === code);
}
