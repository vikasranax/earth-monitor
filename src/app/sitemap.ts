import type { MetadataRoute } from "next";
import { serverEnv } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = serverEnv.SITE_URL;
  const routes = [
    "",
    "/map",
    "/news",
    "/markets",
    "/shipping",
    "/airspace",
    "/hazard",
    "/infrastructure",
    "/groups",
    "/power-structure",
    "/space",
    "/signal-freedom",
    "/watchlist",
    "/dashboards",
    "/dashboards/conflict-watch",
    "/dashboards/trade-flows",
  ];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}
