export interface UnrestEvent {
  id: string;
  location: string;
  lat: number;
  lng: number;
  summary: string;
  intensity: "low" | "moderate" | "high";
  /** True until wired to live GDELT ingestion (M03/M06 extension) */
  isSample: true;
}

// PLACEHOLDER DATA — not live. These illustrate the layer's design
// while M03's live ingestion pipeline isn't yet connected to a real
// unrest/protest data source (GDELT protest events, per the project
// blueprint). Replace this file's contents with a live fetcher once
// that pipeline exists — do not treat these as real current events.
export const sampleUnrestEvents: UnrestEvent[] = [
  {
    id: "sample-1",
    location: "Sample Event — Illustrative Only",
    lat: 48.85,
    lng: 2.35,
    summary:
      "Placeholder: this layer will show real, dated protest/unrest events once live ingestion is connected.",
    intensity: "moderate",
    isSample: true,
  },
  {
    id: "sample-2",
    location: "Sample Event — Illustrative Only",
    lat: -23.55,
    lng: -46.63,
    summary: "Placeholder marker demonstrating layer styling and popup behavior.",
    intensity: "low",
    isSample: true,
  },
];
