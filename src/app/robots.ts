import type { MetadataRoute } from "next";
import { serverEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${serverEnv.SITE_URL}/sitemap.xml`,
  };
}
