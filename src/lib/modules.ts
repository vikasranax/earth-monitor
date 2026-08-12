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
  { id: "M11", name: "Alerts · Auth · Personalisation", status: "standby" },
  { id: "M12", name: "AI Copilot", status: "online" },
  { id: "M13", name: "Global Polish & Ship", status: "standby" },
  { id: "M14", name: "Power Structure & Leadership Intel", status: "standby" },
  { id: "M15", name: "Space & Orbital Tracker", status: "standby" },
  { id: "M16", name: "Signal & Freedom Indices", status: "standby" },
  { id: "M17", name: "Multilingual Core", status: "standby" },
];
