import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_HOMEPAGE,
  DEFAULT_PAYMENT,
  NOTIFICATION_EVENTS,
} from "@/lib/admin-settings-mock";
import {
  LOCALE_HOME_PREFIXES,
  PAGE_SEO,
  PUBLIC_SITEMAP_PAGES,
  SITE,
  SITE_URL,
} from "@/lib/seo-defaults";
import type {
  PublicPageSeoKey,
  SeoPageFields,
  SeoSettings,
  SiteSettingsDocument,
} from "@/types/site-settings";

export const SETTINGS_ID = "global" as const;

export const PUBLIC_PAGE_SEO_LABELS: Record<
  PublicPageSeoKey,
  { label: string; path: string }
> = {
  home: { label: "Homepage", path: "/" },
  about: { label: "About", path: "/about" },
  training: { label: "Training", path: "/training" },
  jobs: { label: "Jobs", path: "/jobs" },
  tools: { label: "Tools", path: "/tools" },
  findPlumber: { label: "Find Plumber", path: "/find-plumber" },
  support: { label: "Support", path: "/support" },
  community: { label: "Community", path: "/community" },
  healthSafety: { label: "Health & Safety", path: "/health-safety" },
  brands: { label: "Brands", path: "/brands" },
};

function pageFieldsFromSeo(key: PublicPageSeoKey): SeoPageFields {
  const page = PAGE_SEO[key];
  return {
    title: page.title,
    description: page.description,
    keywords: (page.keywords ?? []).join(", "),
    focusKeyword: page.keywords?.[0] ?? "",
  };
}

export function buildDefaultSeoSettings(): SeoSettings {
  const pages = Object.fromEntries(
    PUBLIC_SITEMAP_PAGES.map((key) => [key, pageFieldsFromSeo(key)])
  ) as Record<PublicPageSeoKey, SeoPageFields>;

  const localePages = Object.fromEntries(
    LOCALE_HOME_PREFIXES.map((locale) => {
      const localized = PAGE_SEO.home.localeTitles?.[locale];
      return [
        locale,
        {
          title: localized?.title ?? PAGE_SEO.home.title,
          description: localized?.description ?? PAGE_SEO.home.description,
        },
      ];
    })
  ) as SeoSettings["localePages"];

  return {
    siteUrl: SITE_URL,
    defaultDescription: SITE.description,
    defaultKeywords: SITE.defaultKeywords.join(", "),
    taglineEn: SITE.tagline,
    taglineHi: SITE.taglineHi,
    supportEmail: SITE.supportEmail,
    twitterHandle: SITE.twitterHandle,
    googleVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
    bingVerification: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "",
    yandexVerification: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION ?? "",
    facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
    linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "",
    ogImageUrl: "",
    pages,
    localePages,
  };
}

function buildDefaultNotifications() {
  return {
    enabled: Object.fromEntries(
      NOTIFICATION_EVENTS.map((e) => [e.id, e.defaultEnabled])
    ),
    templates: Object.fromEntries(
      NOTIFICATION_EVENTS.map((e) => [e.templateKey, e.defaultTemplate])
    ),
  };
}

export function getDefaultSiteSettings(): SiteSettingsDocument {
  return {
    _id: SETTINGS_ID,
    general: { ...DEFAULT_SITE_SETTINGS },
    seo: buildDefaultSeoSettings(),
    homepage: { ...DEFAULT_HOMEPAGE },
    notifications: buildDefaultNotifications(),
    payment: { ...DEFAULT_PAYMENT },
    updatedAt: new Date().toISOString(),
  };
}

export function pageSeoHealth(title: string, description: string) {
  const titleLen = title.trim().length;
  const descLen = description.trim().length;

  const titleStatus =
    titleLen >= 50 && titleLen <= 60
      ? "good"
      : titleLen >= 40 && titleLen <= 70
        ? "warning"
        : "poor";

  const descStatus =
    descLen >= 150 && descLen <= 160
      ? "good"
      : descLen >= 120 && descLen <= 180
        ? "warning"
        : "poor";

  const score =
    titleStatus === "poor" || descStatus === "poor"
      ? "poor"
      : titleStatus === "warning" || descStatus === "warning"
        ? "warning"
        : "good";

  return {
    score,
    checks: [
      {
        label: `Title length (${titleLen} chars, ideal 50–60)`,
        status: titleStatus,
      },
      {
        label: `Description length (${descLen} chars, ideal 150–160)`,
        status: descStatus,
      },
    ],
  } as const;
}
