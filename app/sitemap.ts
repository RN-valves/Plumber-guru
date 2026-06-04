import type { MetadataRoute } from "next";

const BASE_URL = "https://plumber-guru.com";

const HIGH_PRIORITY = ["/training", "/jobs"];
const STANDARD_ROUTES = [
  "/",
  "/tools",
  "/find-plumber",
  "/support",
  "/community",
  "/health-safety",
  "/brands",
  "/about",
  "/auth/login",
  "/auth/register",
];

const LOCALE_PREFIXES = ["/hi", "/te", "/ta", "/kn"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STANDARD_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1.0 : HIGH_PRIORITY.includes(path) ? 0.9 : 0.7,
  }));

  for (const prefix of LOCALE_PREFIXES) {
    entries.push({
      url: `${BASE_URL}${prefix}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return entries;
}
