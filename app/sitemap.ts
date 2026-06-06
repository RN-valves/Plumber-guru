import type { MetadataRoute } from "next";
import {
  LOCALE_HOME_PREFIXES,
  PAGE_SEO,
  PUBLIC_SITEMAP_PAGES,
} from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  const siteUrl = settings.seo.siteUrl.replace(/\/$/, "");
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const key of PUBLIC_SITEMAP_PAGES) {
    const page = PAGE_SEO[key];
    entries.push({
      url: `${siteUrl}${page.path === "/" ? "" : page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency ?? "weekly",
      priority: page.priority ?? 0.7,
    });
  }

  for (const locale of LOCALE_HOME_PREFIXES) {
    entries.push({
      url: `${siteUrl}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return entries;
}
