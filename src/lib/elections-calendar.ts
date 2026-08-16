export interface ElectionEvent {
  countryCode: string;
  countryName: string;
  electionType: string;
  expectedDate: string; // ISO date, "expected" since some are not yet officially called
  cycleNote: string;
  confidence: "fixed_cycle" | "expected_window";
}

// STARTER SET — not exhaustive. Only includes elections with well-established,
// constitutionally fixed cycles (verifiable independent of any single news
// source). Dates for elections without a fixed constitutional schedule are
// deliberately omitted rather than guessed. Verify against official
// electoral commission sources before relying on any date here.
export const electionsCalendar: ElectionEvent[] = [
  {
    countryCode: "US",
    countryName: "United States",
    electionType: "Congressional midterm elections",
    expectedDate: "2026-11-03",
    cycleNote: "Fixed by the U.S. Constitution — first Tuesday after the first Monday in November, every even year.",
    confidence: "fixed_cycle",
  },
  {
    countryCode: "BR",
    countryName: "Brazil",
    electionType: "General election (President, Congress)",
    expectedDate: "2026-10-04",
    cycleNote: "Brazilian general elections occur every 4 years on a fixed October date; runoff typically late October if needed.",
    confidence: "fixed_cycle",
  },
  {
    countryCode: "HU",
    countryName: "Hungary",
    electionType: "Parliamentary election",
    expectedDate: "2026-04-01",
    cycleNote: "Hungary holds parliamentary elections on a fixed 4-year cycle, typically in April.",
    confidence: "fixed_cycle",
  },
  {
    countryCode: "PH",
    countryName: "Philippines",
    electionType: "Midterm legislative elections",
    expectedDate: "2026-05-11",
    cycleNote: "Philippine midterm elections follow a fixed constitutional cycle, held in May of even years.",
    confidence: "fixed_cycle",
  },
  {
    countryCode: "CO",
    countryName: "Colombia",
    electionType: "Presidential and congressional elections",
    expectedDate: "2026-05-31",
    cycleNote: "Colombia holds presidential elections on a fixed 4-year cycle.",
    confidence: "fixed_cycle",
  },
  {
    countryCode: "FR",
    countryName: "France",
    electionType: "Presidential election",
    expectedDate: "2027-04-01",
    cycleNote: "French presidential term is fixed at 5 years; exact date confirmed closer to the election by the Constitutional Council.",
    confidence: "expected_window",
  },
];

export function getUpcomingElections(fromDate: Date = new Date()): ElectionEvent[] {
  return electionsCalendar
    .filter((e) => new Date(e.expectedDate) >= fromDate)
    .sort((a, b) => new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime());
}
