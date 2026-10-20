export interface HistoricalEvent {
  day: number;
  month: number; // 1-12
  year: number;
  event: string;
  region: string;
}

export interface UpcomingEvent extends HistoricalEvent {
  /** Whole days from the reference date to the next occurrence (>= 1). */
  daysAhead: number;
  /** Day-of-month / month of the next occurrence (same as day/month). */
  nextDay: number;
  nextMonth: number;
}

// Curated set — only well-established, unambiguous historical facts, worded
// neutrally (contested events state who disputes what, never pick a side).
// Weighted toward India/Asia per project convention, with broad global
// coverage. Use "West Asia", never "Middle East". Expand carefully; don't add
// a date without being certain of it.
export const onThisDayEvents: HistoricalEvent[] = [
  // ── January ──
  {
    day: 1,
    month: 1,
    year: 1959,
    event: "The Cuban Revolution culminates as President Batista flees the country.",
    region: "Cuba",
  },
  {
    day: 4,
    month: 1,
    year: 1948,
    event: "Burma (Myanmar) gains independence from Britain.",
    region: "Myanmar",
  },
  {
    day: 17,
    month: 1,
    year: 1991,
    event: "A US-led coalition begins the air campaign of the Gulf War against Iraq.",
    region: "West Asia",
  },
  {
    day: 26,
    month: 1,
    year: 1950,
    event: "India becomes a republic; the Constitution of India comes into force.",
    region: "India",
  },
  {
    day: 30,
    month: 1,
    year: 1948,
    event: "Mahatma Gandhi is assassinated in New Delhi.",
    region: "India",
  },

  // ── February ──
  {
    day: 1,
    month: 2,
    year: 1979,
    event: "Ayatollah Khomeini returns to Tehran from exile after the Shah leaves Iran.",
    region: "Iran",
  },
  {
    day: 4,
    month: 2,
    year: 1948,
    event: "Ceylon (Sri Lanka) gains independence from Britain.",
    region: "Sri Lanka",
  },
  {
    day: 11,
    month: 2,
    year: 1979,
    event: "The Iranian Revolution triumphs and the monarchy is overthrown.",
    region: "Iran",
  },
  {
    day: 11,
    month: 2,
    year: 1990,
    event: "Nelson Mandela is released from prison after 27 years.",
    region: "South Africa",
  },
  {
    day: 15,
    month: 2,
    year: 1989,
    event: "The Soviet Union completes its troop withdrawal from Afghanistan.",
    region: "Afghanistan",
  },
  {
    day: 24,
    month: 2,
    year: 2022,
    event: "Russia launches a full-scale invasion of Ukraine.",
    region: "Europe",
  },

  // ── March ──
  {
    day: 5,
    month: 3,
    year: 1953,
    event: "Soviet leader Joseph Stalin dies.",
    region: "Soviet Union",
  },
  {
    day: 6,
    month: 3,
    year: 1957,
    event:
      "Ghana becomes independent, the first Sub-Saharan African country to gain independence from European colonial rule.",
    region: "Ghana",
  },
  {
    day: 11,
    month: 3,
    year: 2011,
    event: "The Great East Japan earthquake and tsunami trigger the Fukushima nuclear disaster.",
    region: "Japan",
  },
  {
    day: 12,
    month: 3,
    year: 1930,
    event: "Mahatma Gandhi begins the Salt March against British colonial rule.",
    region: "India",
  },
  {
    day: 23,
    month: 3,
    year: 1931,
    event: "Bhagat Singh, Sukhdev and Rajguru are executed by British authorities in Lahore.",
    region: "India",
  },
  {
    day: 26,
    month: 3,
    year: 1971,
    event: "Bangladesh declares independence from Pakistan.",
    region: "Bangladesh",
  },
  {
    day: 31,
    month: 3,
    year: 1959,
    event: "The 14th Dalai Lama reaches India after fleeing Lhasa.",
    region: "Tibet / India",
  },

  // ── April ──
  {
    day: 12,
    month: 4,
    year: 1961,
    event: "Yuri Gagarin becomes the first human in space.",
    region: "Soviet Union",
  },
  {
    day: 13,
    month: 4,
    year: 1919,
    event: "The Jallianwala Bagh massacre occurs in Amritsar.",
    region: "India",
  },
  {
    day: 18,
    month: 4,
    year: 1955,
    event: "The Bandung Conference of Asian and African states begins.",
    region: "Asia & Africa",
  },
  {
    day: 24,
    month: 4,
    year: 2013,
    event: "The Rana Plaza garment factory collapses near Dhaka, killing over 1,100 workers.",
    region: "Bangladesh",
  },
  {
    day: 26,
    month: 4,
    year: 1986,
    event: "The Chernobyl nuclear disaster occurs in the Soviet Union (now Ukraine).",
    region: "Ukraine",
  },
  {
    day: 27,
    month: 4,
    year: 1994,
    event: "South Africa holds its first multiracial democratic elections.",
    region: "South Africa",
  },
  {
    day: 30,
    month: 4,
    year: 1975,
    event: "Saigon falls, ending the Vietnam War.",
    region: "Vietnam",
  },

  // ── May ──
  {
    day: 8,
    month: 5,
    year: 1945,
    event: "V-E Day marks the end of World War II in Europe.",
    region: "Europe",
  },
  {
    day: 11,
    month: 5,
    year: 1998,
    event: "India conducts its Pokhran-II series of nuclear tests.",
    region: "India",
  },
  { day: 14, month: 5, year: 1948, event: "Israel declares independence.", region: "West Asia" },
  {
    day: 18,
    month: 5,
    year: 1974,
    event: "India conducts its first nuclear test at Pokhran (Pokhran-I).",
    region: "India",
  },
  {
    day: 28,
    month: 5,
    year: 1998,
    event: "Pakistan conducts its first nuclear tests in the Chagai Hills.",
    region: "Pakistan",
  },

  // ── June ──
  {
    day: 2,
    month: 6,
    year: 2014,
    event: "Telangana is formed as India's 29th state.",
    region: "India",
  },
  {
    day: 4,
    month: 6,
    year: 1989,
    event:
      "Chinese troops clear protesters from Tiananmen Square in Beijing; the death toll remains disputed.",
    region: "China",
  },
  {
    day: 6,
    month: 6,
    year: 1944,
    event: "D-Day — Allied forces land in Normandy.",
    region: "Europe",
  },
  {
    day: 15,
    month: 6,
    year: 2020,
    event:
      "Indian and Chinese troops clash in Ladakh's Galwan Valley, the deadliest border clash in decades.",
    region: "India / China",
  },
  {
    day: 16,
    month: 6,
    year: 1976,
    event: "The Soweto uprising begins against apartheid-era education policy.",
    region: "South Africa",
  },
  { day: 25, month: 6, year: 1950, event: "The Korean War begins.", region: "Korea" },
  {
    day: 25,
    month: 6,
    year: 1975,
    event: "India's government declares a national Emergency (1975–77), suspending civil liberties.",
    region: "India",
  },
  {
    day: 28,
    month: 6,
    year: 1914,
    event: "Archduke Franz Ferdinand is assassinated in Sarajevo, setting off World War I.",
    region: "Europe",
  },
  {
    day: 30,
    month: 6,
    year: 1960,
    event: "The Democratic Republic of Congo gains independence from Belgium.",
    region: "DR Congo",
  },

  // ── July ──
  {
    day: 1,
    month: 7,
    year: 1997,
    event: "Hong Kong is handed over from British to Chinese sovereignty.",
    region: "China / Hong Kong",
  },
  {
    day: 4,
    month: 7,
    year: 1776,
    event: "The United States Declaration of Independence is adopted.",
    region: "United States",
  },
  {
    day: 5,
    month: 7,
    year: 1962,
    event: "Algeria gains independence from France.",
    region: "Algeria",
  },
  {
    day: 9,
    month: 7,
    year: 2011,
    event: "South Sudan becomes an independent country.",
    region: "South Sudan",
  },
  {
    day: 14,
    month: 7,
    year: 1789,
    event: "The storming of the Bastille marks the start of the French Revolution.",
    region: "France",
  },
  {
    day: 15,
    month: 7,
    year: 2016,
    event: "A coup attempt against the government fails in Turkey.",
    region: "Turkey",
  },
  {
    day: 20,
    month: 7,
    year: 1969,
    event: "Apollo 11 lands the first humans on the Moon.",
    region: "United States",
  },
  {
    day: 26,
    month: 7,
    year: 1956,
    event: "Egypt's President Nasser nationalises the Suez Canal.",
    region: "West Asia",
  },
  {
    day: 26,
    month: 7,
    year: 1999,
    event: "India announces the end of Operation Vijay, concluding the Kargil conflict with Pakistan.",
    region: "India / Pakistan",
  },

  // ── August ──
  {
    day: 2,
    month: 8,
    year: 1990,
    event: "Iraq invades Kuwait, triggering the Gulf War.",
    region: "West Asia",
  },
  {
    day: 5,
    month: 8,
    year: 2019,
    event:
      "India revokes the special status of Jammu & Kashmir under Article 370 and reorganises it into two union territories; Pakistan rejects the move.",
    region: "India / Kashmir",
  },
  { day: 6, month: 8, year: 1945, event: "Atomic bombing of Hiroshima.", region: "Japan" },
  {
    day: 8,
    month: 8,
    year: 1942,
    event: "The Indian National Congress passes the Quit India resolution in Bombay.",
    region: "India",
  },
  { day: 9, month: 8, year: 1945, event: "Atomic bombing of Nagasaki.", region: "Japan" },
  {
    day: 13,
    month: 8,
    year: 1961,
    event: "East Germany begins building the Berlin Wall.",
    region: "Europe",
  },
  {
    day: 14,
    month: 8,
    year: 1947,
    event: "Pakistan becomes an independent state with the Partition of British India.",
    region: "Pakistan",
  },
  {
    day: 15,
    month: 8,
    year: 1947,
    event: "India gains independence from British rule.",
    region: "India",
  },
  { day: 15, month: 8, year: 1971, event: "Bahrain gains independence.", region: "West Asia" },
  {
    day: 15,
    month: 8,
    year: 2021,
    event: "The Taliban enter Kabul as the Afghan government collapses.",
    region: "Afghanistan",
  },
  { day: 17, month: 8, year: 1945, event: "Indonesia declares independence.", region: "Indonesia" },
  {
    day: 24,
    month: 8,
    year: 1991,
    event: "Ukraine declares independence from the Soviet Union.",
    region: "Ukraine",
  },
  {
    day: 31,
    month: 8,
    year: 1957,
    event: "Malaya (later Malaysia) gains independence from British rule.",
    region: "Malaysia",
  },

  // ── September ──
  {
    day: 1,
    month: 9,
    year: 1939,
    event: "Germany invades Poland, beginning World War II in Europe.",
    region: "Europe",
  },
  {
    day: 2,
    month: 9,
    year: 1945,
    event: "Japan formally surrenders, ending World War II.",
    region: "Japan",
  },
  {
    day: 11,
    month: 9,
    year: 1973,
    event: "A military coup in Chile brings General Pinochet to power.",
    region: "Chile",
  },
  {
    day: 11,
    month: 9,
    year: 2001,
    event: "Coordinated terrorist attacks on the United States (9/11).",
    region: "United States",
  },
  {
    day: 15,
    month: 9,
    year: 2008,
    event: "Lehman Brothers collapses, deepening the global financial crisis.",
    region: "United States",
  },

  // ── October ──
  {
    day: 1,
    month: 10,
    year: 1949,
    event: "The People's Republic of China is proclaimed.",
    region: "China",
  },
  {
    day: 1,
    month: 10,
    year: 1960,
    event: "Nigeria gains independence from Britain.",
    region: "Nigeria",
  },
  {
    day: 2,
    month: 10,
    year: 1869,
    event: "Mohandas Karamchand Gandhi is born in Porbandar.",
    region: "India",
  },
  {
    day: 3,
    month: 10,
    year: 1990,
    event: "East and West Germany are reunified.",
    region: "Europe",
  },
  {
    day: 4,
    month: 10,
    year: 1957,
    event: "The Soviet Union launches Sputnik 1, the first artificial satellite.",
    region: "Soviet Union",
  },
  {
    day: 6,
    month: 10,
    year: 1973,
    event: "Egypt and Syria attack Israeli positions, starting the Yom Kippur War.",
    region: "West Asia",
  },
  {
    day: 7,
    month: 10,
    year: 2023,
    event: "Hamas-led militants attack southern Israel; Israel's war in Gaza follows.",
    region: "West Asia",
  },
  {
    day: 14,
    month: 10,
    year: 1956,
    event: "B. R. Ambedkar converts to Buddhism with hundreds of thousands of followers in Nagpur.",
    region: "India",
  },
  {
    day: 16,
    month: 10,
    year: 1964,
    event: "China conducts its first nuclear weapon test at Lop Nur.",
    region: "China",
  },
  {
    day: 18,
    month: 10,
    year: 2019,
    event: "Mass protests begin in Chile, sparked by a metro fare increase.",
    region: "Chile",
  },
  {
    day: 19,
    month: 10,
    year: 1987,
    event: "Black Monday: global stock markets suffer their steepest one-day falls in decades.",
    region: "Global",
  },
  {
    day: 20,
    month: 10,
    year: 1962,
    event: "The Sino-Indian War begins with Chinese offensives in Ladakh and the northeast.",
    region: "India / China",
  },
  {
    day: 22,
    month: 10,
    year: 1962,
    event: "US President Kennedy announces a naval quarantine of Cuba in the missile crisis.",
    region: "Cuba / United States",
  },
  {
    day: 23,
    month: 10,
    year: 1956,
    event: "The Hungarian Revolution against Soviet-backed rule begins.",
    region: "Hungary",
  },
  {
    day: 24,
    month: 10,
    year: 1945,
    event: "The United Nations is officially founded.",
    region: "Global",
  },
  {
    day: 25,
    month: 10,
    year: 1971,
    event:
      "UN General Assembly Resolution 2758 seats the People's Republic of China as China's representative at the UN.",
    region: "China / Global",
  },
  {
    day: 29,
    month: 10,
    year: 1929,
    event:
      "The Wall Street Crash ('Black Tuesday') deepens the stock market collapse that precedes the Great Depression.",
    region: "United States",
  },
  {
    day: 31,
    month: 10,
    year: 1984,
    event: "Prime Minister Indira Gandhi is assassinated in New Delhi.",
    region: "India",
  },

  // ── November ──
  {
    day: 4,
    month: 11,
    year: 1979,
    event: "The Iran hostage crisis begins at the US Embassy in Tehran.",
    region: "Iran",
  },
  {
    day: 4,
    month: 11,
    year: 1995,
    event: "Israeli Prime Minister Yitzhak Rabin is assassinated.",
    region: "West Asia",
  },
  {
    day: 7,
    month: 11,
    year: 1917,
    event: "The Bolsheviks seize power in Petrograd (the October Revolution).",
    region: "Russia",
  },
  { day: 9, month: 11, year: 1989, event: "Fall of the Berlin Wall.", region: "Europe" },
  {
    day: 11,
    month: 11,
    year: 1918,
    event: "The Armistice ends fighting in World War I.",
    region: "Global",
  },
  {
    day: 26,
    month: 11,
    year: 2008,
    event:
      "Coordinated terrorist attacks begin across Mumbai, killing 166 people over four days; the gunmen were from the Pakistan-based group Lashkar-e-Taiba.",
    region: "India",
  },

  // ── December ──
  {
    day: 3,
    month: 12,
    year: 1984,
    event:
      "A gas leak at the Union Carbide plant in Bhopal, one of the world's worst industrial disasters (night of 2–3 December).",
    region: "India",
  },
  { day: 7, month: 12, year: 1941, event: "Attack on Pearl Harbor.", region: "United States" },
  {
    day: 16,
    month: 12,
    year: 1971,
    event: "Bangladesh's Victory Day — independence from Pakistan.",
    region: "Bangladesh",
  },
  {
    day: 19,
    month: 12,
    year: 1961,
    event: "Indian forces take Goa, ending roughly four and a half centuries of Portuguese rule.",
    region: "India",
  },
  {
    day: 25,
    month: 12,
    year: 1991,
    event:
      "Mikhail Gorbachev resigns and the Soviet Union ceases to exist; it is formally dissolved the next day.",
    region: "Russia / Global",
  },
  {
    day: 26,
    month: 12,
    year: 2004,
    event: "The Indian Ocean earthquake and tsunami devastate coastal regions across Asia.",
    region: "Asia",
  },
];

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** Events that happened on this calendar day, oldest first. */
export function getEventsForDate(date: Date = new Date()): HistoricalEvent[] {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return onThisDayEvents.filter((e) => e.day === day && e.month === month).sort((a, b) => a.year - b.year);
}

/**
 * The next few events after `date` (never today), wrapping into next year.
 * Used when today has no entry, so the panel never looks broken.
 * Uses UTC day arithmetic on the local calendar date, so DST can't skew it.
 */
export function getUpcomingEvents(
  date: Date = new Date(),
  limit = 3,
  windowDays = 45,
): UpcomingEvent[] {
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const year = date.getFullYear();
  const upcoming: UpcomingEvent[] = [];

  for (const e of onThisDayEvents) {
    let next = Date.UTC(year, e.month - 1, e.day);
    if (next <= today) next = Date.UTC(year + 1, e.month - 1, e.day);
    const daysAhead = Math.round((next - today) / 86_400_000);
    if (daysAhead <= windowDays) {
      upcoming.push({ ...e, daysAhead, nextDay: e.day, nextMonth: e.month });
    }
  }

  return upcoming.sort((a, b) => a.daysAhead - b.daysAhead || a.year - b.year).slice(0, limit);
}

// Explicit "D Month" formatting — deliberately not using
// toLocaleDateString(undefined, ...), since that defers to the browser's
// locale and often renders US-style month-first ("August 16") instead of
// the day-first convention this project uses throughout.
export function formatDayMonth(day: number, month: number): string {
  return day + " " + (MONTH_NAMES[month - 1] ?? "");
}

export function formatDateDDMonth(date: Date = new Date()): string {
  return formatDayMonth(date.getDate(), date.getMonth() + 1);
}
