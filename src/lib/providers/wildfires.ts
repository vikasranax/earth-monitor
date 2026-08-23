export interface WildfireMarker {
  id: string;
  lat: number;
  lng: number;
  brightness: number;
  confidence: string;
  satellite: string;
  acquiredDate: string;
}

export interface WildfireResult {
  markers: WildfireMarker[];
  cached: boolean;
  fetchedAt: string;
  armed: boolean;
  error?: string;
}

// Active fire hotspots — updated manually or via NASA FIRMS (requires free API key)
// Get your key at: https://firms.modaps.eosdis.nasa.gov/api/area/
const FALLBACK_FIRES: WildfireMarker[] = [
  {
    id: "ca-2024-1",
    lat: 38.5,
    lng: -120.5,
    brightness: 400,
    confidence: "high",
    satellite: "Terra",
    acquiredDate: "2026-08-22",
  },
  {
    id: "ca-2024-2",
    lat: 39.2,
    lng: -121.8,
    brightness: 380,
    confidence: "high",
    satellite: "Aqua",
    acquiredDate: "2026-08-22",
  },
  {
    id: "gr-2024-1",
    lat: 38.2,
    lng: 23.7,
    brightness: 360,
    confidence: "high",
    satellite: "Terra",
    acquiredDate: "2026-08-22",
  },
  {
    id: "au-2024-1",
    lat: -33.5,
    lng: 150.3,
    brightness: 420,
    confidence: "high",
    satellite: "Aqua",
    acquiredDate: "2026-08-22",
  },
  {
    id: "br-2024-1",
    lat: -8.5,
    lng: -55.2,
    brightness: 390,
    confidence: "high",
    satellite: "Terra",
    acquiredDate: "2026-08-22",
  },
  {
    id: "id-2024-1",
    lat: -0.5,
    lng: 102.3,
    brightness: 370,
    confidence: "high",
    satellite: "Aqua",
    acquiredDate: "2026-08-22",
  },
  {
    id: "mx-2024-1",
    lat: 19.4,
    lng: -100.1,
    brightness: 350,
    confidence: "normal",
    satellite: "Terra",
    acquiredDate: "2026-08-22",
  },
  {
    id: "pt-2024-1",
    lat: 39.5,
    lng: -8.0,
    brightness: 340,
    confidence: "normal",
    satellite: "Aqua",
    acquiredDate: "2026-08-22",
  },
  {
    id: "za-2024-1",
    lat: -25.7,
    lng: 28.2,
    brightness: 330,
    confidence: "normal",
    satellite: "Terra",
    acquiredDate: "2026-08-22",
  },
  {
    id: "ru-2024-1",
    lat: 55.8,
    lng: 37.6,
    brightness: 320,
    confidence: "normal",
    satellite: "Aqua",
    acquiredDate: "2026-08-22",
  },
  {
    id: "ca-north-1",
    lat: 60.7,
    lng: -114.4,
    brightness: 410,
    confidence: "high",
    satellite: "Terra",
    acquiredDate: "2026-08-22",
  },
  {
    id: "us-or-1",
    lat: 44.0,
    lng: -121.5,
    brightness: 395,
    confidence: "high",
    satellite: "Aqua",
    acquiredDate: "2026-08-22",
  },
  {
    id: "bo-2024-1",
    lat: -16.5,
    lng: -64.8,
    brightness: 385,
    confidence: "high",
    satellite: "Terra",
    acquiredDate: "2026-08-22",
  },
  {
    id: "cd-2024-1",
    lat: -4.3,
    lng: 15.3,
    brightness: 375,
    confidence: "high",
    satellite: "Aqua",
    acquiredDate: "2026-08-22",
  },
  {
    id: "mg-2024-1",
    lat: -18.9,
    lng: 47.5,
    brightness: 365,
    confidence: "normal",
    satellite: "Terra",
    acquiredDate: "2026-08-22",
  },
];

export async function fetchLiveWildfires(): Promise<WildfireResult> {
  // NASA FIRMS requires a free API key. Register at:
  // https://firms.modaps.eosdis.nasa.gov/api/area/
  // Then replace this fallback with real API calls.

  return {
    markers: FALLBACK_FIRES,
    cached: false,
    fetchedAt: new Date().toISOString(),
    armed: true,
    error: "Using sample data — register for NASA FIRMS API key for live data",
  };
}
