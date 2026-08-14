export interface AirRegion {
  id: string;
  name: string;
  boundingBox: [[number, number], [number, number]];
}

export const airRegions: AirRegion[] = [
  { id: "taiwan-strait", name: "Taiwan Strait", boundingBox: [[21.0, 117.0], [26.5, 122.5]] },
  { id: "eastern-europe", name: "Eastern Europe / Ukraine", boundingBox: [[44.0, 22.0], [52.5, 40.5]] },
  { id: "west-asia", name: "West Asia", boundingBox: [[12.0, 34.0], [37.5, 63.0]] },
  { id: "south-china-sea", name: "South China Sea", boundingBox: [[1.0, 105.0], [21.0, 121.0]] },
  { id: "korean-peninsula", name: "Korean Peninsula", boundingBox: [[33.0, 124.5], [43.0, 130.5]] },
  { id: "kashmir", name: "Kashmir / LoC", boundingBox: [[32.0, 73.0], [36.5, 78.0]] },
];
