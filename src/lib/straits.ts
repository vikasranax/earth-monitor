export interface Strait {
  id: string;
  name: string;
  // [[lat1,lon1],[lat2,lon2]] bounding box corners
  boundingBox: [[number, number], [number, number]];
}

export const straits: Strait[] = [
  {
    id: "hormuz",
    name: "Strait of Hormuz",
    boundingBox: [
      [24.5, 55.0],
      [27.0, 57.5],
    ],
  },
  {
    id: "malacca",
    name: "Strait of Malacca",
    boundingBox: [
      [1.0, 100.0],
      [6.5, 104.0],
    ],
  },
  {
    id: "suez",
    name: "Suez Canal",
    boundingBox: [
      [29.8, 32.2],
      [31.3, 32.6],
    ],
  },
  {
    id: "bab-el-mandeb",
    name: "Bab-el-Mandeb",
    boundingBox: [
      [12.3, 43.0],
      [13.9, 44.0],
    ],
  },
  {
    id: "bosphorus",
    name: "Bosphorus Strait",
    boundingBox: [
      [40.9, 28.9],
      [41.3, 29.2],
    ],
  },
  {
    id: "panama",
    name: "Panama Canal",
    boundingBox: [
      [8.8, -80.0],
      [9.4, -79.4],
    ],
  },
];
