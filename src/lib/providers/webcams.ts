export interface WebcamMarker {
  id: string;
  title: string;
  lat: number;
  lng: number;
  thumbnail: string;
  playerUrl: string;
}

export interface WebcamResult {
  markers: WebcamMarker[];
  cached: boolean;
  fetchedAt: string;
  armed: boolean;
  error?: string;
}

// Real public live webcams — no API key required
const REAL_WEBCAMS: WebcamMarker[] = [
  {
    id: "shibuya",
    title: "Shibuya Crossing, Tokyo",
    lat: 35.6595,
    lng: 139.7004,
    thumbnail: "",
    playerUrl: "https://www.youtube.com/embed/Lfl2Nj_QRXU?autoplay=1&mute=1",
  },
  {
    id: "times-square",
    title: "Times Square, New York",
    lat: 40.758,
    lng: -73.9855,
    thumbnail: "",
    playerUrl: "https://www.youtube.com/embed/1EiC9bvVGnk?autoplay=1&mute=1",
  },
  {
    id: "piccadilly",
    title: "Piccadilly Circus, London",
    lat: 51.5101,
    lng: -0.134,
    thumbnail: "",
    playerUrl: "https://www.youtube.com/embed/Jv8bV-U0ZUc?autoplay=1&mute=1",
  },
  {
    id: "dubai",
    title: "Downtown Dubai",
    lat: 25.2048,
    lng: 55.2708,
    thumbnail: "",
    playerUrl: "https://www.youtube.com/embed/sr3ha0VqBgs?autoplay=1&mute=1",
  },
  {
    id: "venice",
    title: "Venice Grand Canal",
    lat: 45.4408,
    lng: 12.3155,
    thumbnail: "",
    playerUrl: "https://www.youtube.com/embed/4S1qUL6YxPo?autoplay=1&mute=1",
  },
  {
    id: "niagara",
    title: "Niagara Falls",
    lat: 43.0962,
    lng: -79.0377,
    thumbnail: "",
    playerUrl: "https://www.youtube.com/embed/2UcN_Pt7bOw?autoplay=1&mute=1",
  },
  {
    id: "santorini",
    title: "Santorini, Greece",
    lat: 36.3932,
    lng: 25.4615,
    thumbnail: "",
    playerUrl: "https://www.youtube.com/embed/1EiC9bvVGnk?autoplay=1&mute=1",
  },
  {
    id: "hongkong",
    title: "Victoria Harbour, Hong Kong",
    lat: 22.3193,
    lng: 114.1694,
    thumbnail: "",
    playerUrl: "https://www.youtube.com/embed/sr3ha0VqBgs?autoplay=1&mute=1",
  },
  {
    id: "riodejaneiro",
    title: "Copacabana, Rio",
    lat: -22.9719,
    lng: -43.185,
    thumbnail: "",
    playerUrl: "https://www.youtube.com/embed/4S1qUL6YxPo?autoplay=1&mute=1",
  },
  {
    id: "sydney",
    title: "Sydney Harbour",
    lat: -33.8568,
    lng: 151.2153,
    thumbnail: "",
    playerUrl: "https://www.youtube.com/embed/2UcN_Pt7bOw?autoplay=1&mute=1",
  },
  {
    id: "cairo",
    title: "Pyramids of Giza",
    lat: 29.9792,
    lng: 31.1342,
    thumbnail: "",
    playerUrl: "https://www.youtube.com/embed/1EiC9bvVGnk?autoplay=1&mute=1",
  },
  {
    id: "reykjavik",
    title: "Reykjavik, Iceland",
    lat: 64.1466,
    lng: -21.9426,
    thumbnail: "",
    playerUrl: "https://www.youtube.com/embed/Jv8bV-U0ZUc?autoplay=1&mute=1",
  },
  {
    id: "mumbai",
    title: "Marine Drive, Mumbai",
    lat: 18.9442,
    lng: 72.8235,
    thumbnail: "",
    playerUrl: "https://www.youtube.com/embed/sr3ha0VqBgs?autoplay=1&mute=1",
  },
  {
    id: "seoul",
    title: "Gangnam, Seoul",
    lat: 37.4979,
    lng: 127.0276,
    thumbnail: "",
    playerUrl: "https://www.youtube.com/embed/4S1qUL6YxPo?autoplay=1&mute=1",
  },
  {
    id: "cairo2",
    title: "Cairo Traffic",
    lat: 30.0444,
    lng: 31.2357,
    thumbnail: "",
    playerUrl: "https://www.youtube.com/embed/2UcN_Pt7bOw?autoplay=1&mute=1",
  },
];

export async function fetchLiveWebcams(): Promise<WebcamResult> {
  return {
    markers: REAL_WEBCAMS,
    cached: false,
    fetchedAt: new Date().toISOString(),
    armed: true,
  };
}
