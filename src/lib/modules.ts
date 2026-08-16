export interface ModuleInfo {
  id: string;
  name: string;
  status: "online" | "standby";
}

export const modules: ModuleInfo[] = [
  { id: "M01", name: "Foundation & Dev", status: "online" },
  { id: "M02", name: "Terminal UI Design System", status: "online" },
  { id: "M03", name: "Data Layer & Ingestion", status: "online" },
  { id: "M04", name: "Home Command Deck", status: "online" },
  { id: "M05", name: "Global Map & Country Intel", status: "online" },
  { id: "M05a", name: "Multilayer Map Engine", status: "online" },
  { id: "M06", name: "News Engine", status: "online" },
  { id: "M07", name: "Markets Suite", status: "online" },
  { id: "M08", name: "Shipping & Straits", status: "online" },
  { id: "M09", name: "Airspace", status: "online" },
  { id: "M09a", name: "Hazard & Disaster Layer", status: "online" },
  { id: "M09b", name: "Infrastructure & Outages", status: "online" },
  { id: "M10", name: "Thematic Dashboards", status: "online" },
  { id: "M10a", name: "Political & Economic Groups", status: "online" },
  { id: "M11", name: "Alerts · Auth · Personalisation", status: "online" },
  { id: "M12", name: "AI Copilot", status: "online" },
  { id: "M13", name: "Global Polish & Ship", status: "online" },
  { id: "M14", name: "Power Structure & Leadership Intel", status: "online" },
  { id: "M15", name: "Space & Orbital Tracker", status: "online" },
  { id: "M16", name: "Signal & Freedom Indices", status: "online" },
  { id: "M17", name: "Multilingual Core", status: "standby" },

  // ── Future roadmap — see docs/FUTURE-LAYERS-AND-FEATURES.md ──
  { id: "M18", name: "Country Boundary Polygons", status: "standby" },
  { id: "M19", name: "Submarine Cable Routes", status: "standby" },
  { id: "M20", name: "Refugee & Displacement Flows", status: "standby" },
  { id: "M21", name: "Wildfire Hotspots", status: "standby" },
  { id: "M22", name: "Volcanic Activity", status: "standby" },
  { id: "M23", name: "Solar & Space Weather Overlay", status: "standby" },
  { id: "M24", name: "Full Country Dossier Expansion", status: "standby" },
  { id: "M25", name: "Internet & Press Freedom Overlay", status: "standby" },
  { id: "M26", name: "3D Globe View", status: "standby" },
  { id: "M27", name: "Copilot Markets & Power Structure Grounding", status: "online" },
  { id: "M28", name: "Elections & Political Calendar", status: "online" },
  { id: "M29", name: "On This Day in Geopolitics", status: "standby" },
  { id: "M30", name: "Saved Views & Custom Dashboards", status: "standby" },
  { id: "M31", name: "Watchlist Push Notifications", status: "standby" },
  { id: "M32", name: "Day/Night Terminator", status: "standby" },
  { id: "M33", name: "Live Webcams", status: "standby" },
  { id: "M34", name: "Military & Nuclear Site Markers", status: "standby" },
  { id: "M35", name: "Critical Minerals & Energy Infrastructure", status: "standby" },
  { id: "M36", name: "Sanctions Layer", status: "standby" },
  { id: "M37", name: "Composite Country Instability Index", status: "standby" },
];
