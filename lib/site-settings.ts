import { unstable_cache, revalidateTag } from "next/cache";
import { getDb } from "@/lib/mongodb";
import {
  LOCALE_HOME_PREFIXES,
  PAGE_SEO,
  PUBLIC_SITEMAP_PAGES,
  SITE,
  SITE_URL,
  type PageSeoKey,
} from "@/lib/seo-defaults";
import {
  SETTINGS_ID,
  buildDefaultSeoSettings,
  getDefaultSiteSettings,
} from "@/lib/site-settings-defaults";
import type {
  LocaleHomeKey,
  PublicPageSeoKey,
  SeoContext,
  SeoPageFields,
  SiteSettingsDocument,
  SiteSettingsPatch,
} from "@/types/site-settings";

export type { SeoContext };

const CACHE_TAG = "site-settings";

function mergeSeoPages(
  stored?: Partial<Record<PublicPageSeoKey, Partial<SeoPageFields>>>
): Record<PublicPageSeoKey, SeoPageFields> {
  const defaults = buildDefaultSeoSettings().pages;
  const merged = { ...defaults };

  if (stored) {
    for (const key of PUBLIC_SITEMAP_PAGES) {
      if (stored[key]) {
        merged[key] = { ...defaults[key], ...stored[key] };
      }
    }
  }

  return merged;
}

function mergeLocalePages(
  stored?: Partial<
    Record<LocaleHomeKey, Partial<{ title: string; description: string }>>
  >
) {
  const defaults = buildDefaultSeoSettings().localePages;
  const merged = { ...defaults };

  if (stored) {
    for (const locale of LOCALE_HOME_PREFIXES) {
      if (stored[locale]) {
        merged[locale] = { ...defaults[locale], ...stored[locale] };
      }
    }
  }

  return merged;
}

export function mergeSiteSettings(
  stored: Partial<SiteSettingsDocument> | null
): SiteSettingsDocument {
  const defaults = getDefaultSiteSettings();

  if (!stored) return defaults;

  return {
    _id: SETTINGS_ID,
    general: { ...defaults.general, ...stored.general },
    seo: {
      ...defaults.seo,
      ...stored.seo,
      pages: mergeSeoPages(stored.seo?.pages),
      localePages: mergeLocalePages(stored.seo?.localePages),
    },
    homepage: {
      ...defaults.homepage,
      ...stored.homepage,
      featuredCities:
        stored.homepage?.featuredCities ?? defaults.homepage.featuredCities,
    },
    notifications: {
      enabled: {
        ...defaults.notifications.enabled,
        ...stored.notifications?.enabled,
      },
      templates: {
        ...defaults.notifications.templates,
        ...stored.notifications?.templates,
      },
    },
    payment: { ...defaults.payment, ...stored.payment },
    updatedAt: stored.updatedAt ?? defaults.updatedAt,
    updatedBy: stored.updatedBy,
  };
}

async function fetchSiteSettingsFromDb(): Promise<SiteSettingsDocument> {
  try {
    const db = await getDb();
    const doc = await db
      .collection<SiteSettingsDocument>("site_settings")
      .findOne({ _id: SETTINGS_ID });

    return mergeSiteSettings(doc);
  } catch (err) {
    console.error("[site-settings] Falling back to defaults:", err);
    return getDefaultSiteSettings();
  }
}

export const getSiteSettings = unstable_cache(
  fetchSiteSettingsFromDb,
  [CACHE_TAG],
  { revalidate: 120, tags: [CACHE_TAG] }
);

export async function saveSiteSettings(
  patch: SiteSettingsPatch,
  updatedBy?: string
): Promise<SiteSettingsDocument> {
  const current = await fetchSiteSettingsFromDb();
  const next: SiteSettingsDocument = {
    ...current,
    ...patch,
    general: patch.general
      ? { ...current.general, ...patch.general }
      : current.general,
    seo: patch.seo
      ? {
          ...current.seo,
          ...patch.seo,
          pages: patch.seo.pages
            ? mergeSeoPages({ ...current.seo.pages, ...patch.seo.pages })
            : current.seo.pages,
          localePages: patch.seo.localePages
            ? mergeLocalePages({
                ...current.seo.localePages,
                ...patch.seo.localePages,
              })
            : current.seo.localePages,
        }
      : current.seo,
    homepage: patch.homepage
      ? { ...current.homepage, ...patch.homepage }
      : current.homepage,
    notifications: patch.notifications
      ? {
          enabled: {
            ...current.notifications.enabled,
            ...patch.notifications.enabled,
          },
          templates: {
            ...current.notifications.templates,
            ...patch.notifications.templates,
          },
        }
      : current.notifications,
    payment: patch.payment
      ? { ...current.payment, ...patch.payment }
      : current.payment,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };

  const db = await getDb();
  await db
    .collection<SiteSettingsDocument>("site_settings")
    .updateOne({ _id: SETTINGS_ID }, { $set: next }, { upsert: true });

  revalidateTag(CACHE_TAG);
  return next;
}

export function parseKeywords(value: string): string[] {
  return value
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

export function buildSeoContext(settings: SiteSettingsDocument): SeoContext {
  const { general, seo } = settings;
  const siteName = general.siteName || SITE.name;

  const pages = Object.fromEntries(
    (Object.keys(PAGE_SEO) as PageSeoKey[]).map((key) => {
      const base = PAGE_SEO[key];
      const custom =
        key in seo.pages ? seo.pages[key as PublicPageSeoKey] : undefined;

      return [
        key,
        {
          title: custom?.title || base.title.replaceAll(SITE.name, siteName),
          description: custom?.description || base.description,
          path: base.path,
          keywords: custom
            ? parseKeywords(custom.keywords)
            : (base.keywords ?? []),
        },
      ];
    })
  ) as SeoContext["pages"];

  return {
    siteUrl: seo.siteUrl || SITE_URL,
    siteName,
    tagline: seo.taglineEn || general.tagline || SITE.tagline,
    taglineHi: seo.taglineHi || SITE.taglineHi,
    description: seo.defaultDescription || SITE.description,
    email: general.contactEmail || SITE.email,
    supportEmail: seo.supportEmail || SITE.supportEmail,
    phone: general.contactPhone || SITE.phone,
    twitterHandle: seo.twitterHandle || SITE.twitterHandle,
    locale: SITE.locale,
    defaultKeywords: parseKeywords(seo.defaultKeywords).length
      ? parseKeywords(seo.defaultKeywords)
      : [...SITE.defaultKeywords],
    ogImageUrl: seo.ogImageUrl,
    googleVerification: seo.googleVerification,
    bingVerification: seo.bingVerification,
    yandexVerification: seo.yandexVerification,
    socialUrls: [
      seo.facebookUrl,
      general.instagram,
      general.youtube,
      seo.linkedinUrl,
      general.whatsappChannel,
    ].filter(Boolean),
    pages,
    localePages: seo.localePages,
  };
}

export async function getSeoContext(): Promise<SeoContext> {
  const settings = await getSiteSettings();
  return buildSeoContext(settings);
}
