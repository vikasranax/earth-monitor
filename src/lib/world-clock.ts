export interface ClockCity {
  label: string;
  timezone: string; // IANA timezone identifier
}

// India first, then broad Asia coverage, then major global hubs.
// Uses the browser's built-in IANA timezone database via Intl —
// no API, always accurate, handles daylight saving automatically.
export const clockCities: ClockCity[] = [
  { label: "New Delhi", timezone: "Asia/Kolkata" },
  { label: "Beijing", timezone: "Asia/Shanghai" },
  { label: "Tokyo", timezone: "Asia/Tokyo" },
  { label: "Singapore", timezone: "Asia/Singapore" },
  { label: "Dubai", timezone: "Asia/Dubai" },
  { label: "Moscow", timezone: "Europe/Moscow" },
  { label: "London", timezone: "Europe/London" },
  { label: "New York", timezone: "America/New_York" },
  { label: "São Paulo", timezone: "America/Sao_Paulo" },
  { label: "Sydney", timezone: "Australia/Sydney" },
];

export function formatCityTime(timezone: string, date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatCityDate(timezone: string, date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    day: "2-digit",
    month: "short",
  }).format(date);
}
