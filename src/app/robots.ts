import type { MetadataRoute } from "next";
import { env } from "../lib/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.siteUrl;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
