import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/site-settings";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();
  const { general, seo } = settings;
  const siteUrl = seo.siteUrl.replace(/\/$/, "");

  return {
    name: general.siteName,
    short_name: general.siteName,
    description: seo.defaultDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#F97316",
    orientation: "portrait-primary",
    lang: "en-IN",
    scope: "/",
    id: siteUrl,
    categories: ["business", "education", "utilities"],
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
