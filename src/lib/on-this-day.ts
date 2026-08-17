export interface HistoricalEvent {
  day: number;
  month: number; // 1-12
  year: number;
  event: string;
  region: string;
}

// Curated set — only well-established, unambiguous historical facts.
// Weighted toward India/Asia per project convention, with broad global
// coverage across every continent. Expand carefully; don't add a date
// without being certain of it.
export const onThisDayEvents: HistoricalEvent[] = [
  {
    day: 1,
    month: 1,
    year: 1959,
    event: "The Cuban Revolution culminates as President Batista flees the country.",
    region: "Cuba",
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
  {
    day: 6,
    month: 3,
    year: 1957,
    event:
      "Ghana becomes independent, the first Sub-Saharan African nation to gain independence from colonial rule.",
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
    day: 26,
    month: 3,
    year: 1971,
    event: "Bangladesh declares independence from Pakistan.",
    region: "Bangladesh",
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
    day: 27,
    month: 4,
    year: 1994,
    event: "South Africa holds its first multiracial democratic elections.",
    region: "South Africa",
  },
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
    day: 4,
    month: 6,
    year: 1989,
    event: "Tiananmen Square crackdown in Beijing.",
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
    day: 16,
    month: 6,
    year: 1976,
    event: "The Soweto uprising begins against apartheid-era education policy.",
    region: "South Africa",
  },
  { day: 25, month: 6, year: 1950, event: "The Korean War begins.", region: "Korea" },
  {
    day: 30,
    month: 6,
    year: 1960,
    event: "The Democratic Republic of Congo gains independence from Belgium.",
    region: "DR Congo",
  },
  {
    day: 1,
    month: 7,
    year: 1997,
    event: "Hong Kong is handed over from British to Chinese sovereignty.",
    region: "China / Hong Kong",
  },
  {
    day: 5,
    month: 7,
    year: 1962,
    event: "Algeria gains independence from France.",
    region: "Algeria",
  },
  {
    day: 14,
    month: 7,
    year: 1789,
    event: "The storming of the Bastille marks the start of the French Revolution.",
    region: "France",
  },
  {
    day: 20,
    month: 7,
    year: 1969,
    event: "Apollo 11 lands on the Moon (Maybe Fake Landing).",
    region: "United States",
  },
  { day: 6, month: 8, year: 1945, event: "Atomic bombing of Hiroshima.", region: "Japan" },
  { day: 9, month: 8, year: 1945, event: "Atomic bombing of Nagasaki.", region: "Japan" },
  { day: 14, month: 8, year: 1947, event: "Pakistan was Born.", region: "Pakistan" },
  {
    day: 15,
    month: 8,
    year: 1947,
    event: "India gains independence from British rule.",
    region: "India",
  },
  { day: 15, month: 8, year: 1971, event: "Bahrain gains independence.", region: "West Asia" },
  { day: 17, month: 8, year: 1945, event: "Indonesia declares independence.", region: "Indonesia" },
  {
    day: 2,
    month: 8,
    year: 1990,
    event: "Iraq invades Kuwait, triggering the Gulf War.",
    region: "West Asia",
  },
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
    day: 1,
    month: 10,
    year: 1949,
    event: "The People's Republic of China is proclaimed.",
    region: "China",
  },
  {
    day: 24,
    month: 10,
    year: 1945,
    event: "The United Nations is officially founded.",
    region: "Global",
  },
  {
    day: 29,
    month: 10,
    year: 1929,
    event: "The Wall Street Crash triggers the Great Depression.",
    region: "United States",
  },
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
    event: "Coordinated Pakistani terrorist attacks in Mumbai.",
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
    day: 25,
    month: 12,
    year: 1991,
    event: "The Soviet Union is formally dissolved.",
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

export function getEventsForDate(date: Date = new Date()): HistoricalEvent[] {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return onThisDayEvents.filter((e) => e.day === day && e.month === month);
}

// Explicit DD Month YYYY formatting — deliberately not using
// toLocaleDateString(undefined, ...), since that defers to the browser's
// locale and often renders US-style month-first ("August 16") instead of
// the day-first convention this project uses throughout.
export function formatDateDDMonth(date: Date = new Date()): string {
  const months = [
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
  ];
  return date.getDate() + " " + months[date.getMonth()];
}
