export interface CableLanding {
  id: string;
  name: string;
  lat: number;
  lng: number;
  cables: string[];
}

export const cableLandings: CableLanding[] = [
  {
    id: "mumbai",
    name: "Mumbai, India",
    lat: 19.076,
    lng: 72.877,
    cables: ["SEA-ME-WE 3", "SEA-ME-WE 4", "FLAG", "Tata TGN"],
  },
  {
    id: "singapore",
    name: "Singapore",
    lat: 1.352,
    lng: 103.819,
    cables: ["SEA-ME-WE 3", "SEA-ME-WE 4", "SEA-ME-WE 5", "Tata TGN"],
  },
  {
    id: "alexandria",
    name: "Alexandria, Egypt",
    lat: 31.2,
    lng: 29.91,
    cables: ["SEA-ME-WE 3", "SEA-ME-WE 4", "FLAG"],
  },
  {
    id: "marseille",
    name: "Marseille, France",
    lat: 43.296,
    lng: 5.369,
    cables: ["SEA-ME-WE 3", "SEA-ME-WE 4", "SEA-ME-WE 5", "Africa Coast"],
  },
  {
    id: "fortaleza",
    name: "Fortaleza, Brazil",
    lat: -3.731,
    lng: -38.526,
    cables: ["SEA-ME-WE 3", "Africa Coast"],
  },
  {
    id: "capetown",
    name: "Cape Town, SA",
    lat: -33.924,
    lng: 18.424,
    cables: ["SAT-3", "SAFE", "Africa Coast"],
  },
  {
    id: "djibouti",
    name: "Djibouti",
    lat: 11.572,
    lng: 43.152,
    cables: ["SEA-ME-WE 3", "SEA-ME-WE 5", "Africa Coast"],
  },
  {
    id: "jeddah",
    name: "Jeddah, Saudi Arabia",
    lat: 21.485,
    lng: 39.192,
    cables: ["SEA-ME-WE 3", "SEA-ME-WE 4", "SEA-ME-WE 5", "FLAG"],
  },
  {
    id: "karachi",
    name: "Karachi, Pakistan",
    lat: 24.86,
    lng: 67.001,
    cables: ["SEA-ME-WE 3", "SEA-ME-WE 4", "SEA-ME-WE 5"],
  },
  { id: "tokyo", name: "Tokyo, Japan", lat: 35.676, lng: 139.65, cables: ["Tata TGN", "FLAG"] },
  {
    id: "sydney",
    name: "Sydney, Australia",
    lat: -33.868,
    lng: 151.209,
    cables: ["Tata TGN", "SEA-ME-WE 3"],
  },
  {
    id: "lagos",
    name: "Lagos, Nigeria",
    lat: 6.524,
    lng: 3.379,
    cables: ["SAT-3", "Africa Coast"],
  },
  {
    id: "mombasa",
    name: "Mombasa, Kenya",
    lat: -4.043,
    lng: 39.668,
    cables: ["SEA-ME-WE 5", "Africa Coast"],
  },
  {
    id: "colombo",
    name: "Colombo, Sri Lanka",
    lat: 6.927,
    lng: 79.861,
    cables: ["SEA-ME-WE 3", "SEA-ME-WE 4", "SEA-ME-WE 5", "FLAG"],
  },
  {
    id: "penang",
    name: "Penang, Malaysia",
    lat: 5.414,
    lng: 100.328,
    cables: ["SEA-ME-WE 3", "SEA-ME-WE 4", "SEA-ME-WE 5", "FLAG"],
  },
];
