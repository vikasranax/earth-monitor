/**
 * Map layer identity colours — the single source for both the markers
 * (WorldMap) and the sidebar legend swatches (map page).
 *
 * Rules (see README, "Design conventions"): use a theme token wherever one
 * exists. Layers with no token get a --layer-* variable with a fallback, so a
 * theme can override it later in global.css without touching components.
 */
export const LAYER_COLORS = {
  country: "var(--accent)",
  disputed: "var(--warn)",
  unrest: "var(--danger)",
  quake: "var(--warn)",
  quakeMajor: "var(--danger)",
  cable: "var(--layer-cable, #8b7cf6)",
  place: "var(--ok)",
  architecture: "var(--warn)",
  webcam: "var(--layer-webcam, #00ffcc)",
  wildfire: "var(--layer-wildfire, #ff6600)",
  military: "var(--info)",
} as const;

export type LayerColorKey = keyof typeof LAYER_COLORS;
