export interface PlaceToVisit {
  name: string;
  lat: number;
  lng: number;
  description?: string;
}

// Generated from a Google My Maps KML export via scripts/kml-to-places.mjs.
// To regenerate: export your map (My Maps menu → Export to KML), then run:
//   node scripts/kml-to-places.mjs path/to/your-export.kml > src/lib/places-to-visit.ts
export const placesToVisit: PlaceToVisit[] = [
  { name: "Example Place", lat: 48.8584, lng: 2.2945, description: "Replace with your real exported places" },
];
