import type { MetadataRoute } from "next";
import { env } from "../lib/env";
import { supabaseServer } from "../lib/supabase-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.siteUrl;
  const { data } = await supabaseServer.from("seo_listing_pages").select("path,updated_at");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  const listingRoutes: MetadataRoute.Sitemap = (data ?? [])
    .filter((item) => item.path)
    .map((item) => ({
      url: `${baseUrl}${item.path}`,
      lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));

  return [...staticRoutes, ...listingRoutes];
}
