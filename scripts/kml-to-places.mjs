/* eslint-disable no-console */
// Converts a Google My Maps KML export into src/lib/places-to-visit.ts's format.
// Usage: node scripts/kml-to-places.mjs path/to/export.kml > src/lib/places-to-visit.ts

import { readFileSync } from "fs";

const path = process.argv[2];
if (!path) {
  console.error("Usage: node scripts/kml-to-places.mjs path/to/export.kml");
  process.exit(1);
}

const xml = readFileSync(path, "utf-8");
const placemarkRegex = /<Placemark>([\s\S]*?)<\/Placemark>/g;
const places = [];

let match;
while ((match = placemarkRegex.exec(xml)) !== null) {
  const block = match[1];
  const nameMatch = block.match(/<name>([\s\S]*?)<\/name>/);
  const descMatch = block.match(/<description>([\s\S]*?)<\/description>/);
  const coordMatch = block.match(/<coordinates>([\s\S]*?)<\/coordinates>/);

  if (!nameMatch || !coordMatch) continue;

  const coordParts = coordMatch[1].trim().split(",");
  const lng = parseFloat(coordParts[0]);
  const lat = parseFloat(coordParts[1]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) continue;

  const name = nameMatch[1]
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .trim();
  const description = descMatch
    ? descMatch[1]
        .replace(/<!\[CDATA\[/g, "")
        .replace(/\]\]>/g, "")
        .replace(/<[^>]+>/g, "")
        .trim()
    : undefined;

  places.push({ name, lat, lng, description });
}

console.log("export interface PlaceToVisit {");
console.log("  name: string;");
console.log("  lat: number;");
console.log("  lng: number;");
console.log("  description?: string;");
console.log("}");
console.log("");
console.log("// Generated from a Google My Maps KML export via scripts/kml-to-places.mjs.");
console.log("export const placesToVisit: PlaceToVisit[] = [");
for (const p of places) {
  const desc = p.description ? `, description: ${JSON.stringify(p.description)}` : "";
  console.log(`  { name: ${JSON.stringify(p.name)}, lat: ${p.lat}, lng: ${p.lng}${desc} },`);
}
console.log("];");

console.error(`\nParsed ${places.length} places from ${path}`);
