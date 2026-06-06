import type { Metadata } from "next";
import { LOCALES, type Locale } from "@/lib/locale";
import {
  LOCALE_HOME_PREFIXES,
  PAGE_SEO,
  SITE,
  SITE_URL,
  type PageSeoKey,
} from "@/lib/seo-defaults";
import type { SeoContext } from "@/types/site-settings";

export {
  LOCALE_HOME_PREFIXES,
  PAGE_SEO,
  PUBLIC_SITEMAP_PAGES,
  SITE,
  SITE_URL,
  type PageSeoKey,
} from "@/lib/seo-defaults";

function buildDefaultSeoContext(): SeoContext {
  const pages = Object.fromEntries(
    (Object.keys(PAGE_SEO) as PageSeoKey[]).map((key) => {
      const base = PAGE_SEO[key];
      return [
        key,
        {
          title: base.title,
          description: base.description,
          path: base.path,
          keywords: base.keywords ?? [],
        },
      ];
    })
  ) as SeoContext["pages"];

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
  ) as SeoContext["localePages"];

  return {
    siteUrl: SITE_URL,
    siteName: SITE.name,
    tagline: SITE.tagline,
    taglineHi: SITE.taglineHi,
    description: SITE.description,
    email: SITE.email,
    supportEmail: SITE.supportEmail,
    phone: SITE.phone,
    twitterHandle: SITE.twitterHandle,
    locale: SITE.locale,
    defaultKeywords: [...SITE.defaultKeywords],
    ogImageUrl: "",
    googleVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
    bingVerification: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "",
    yandexVerification: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION ?? "",
    socialUrls: [
      process.env.NEXT_PUBLIC_FACEBOOK_URL,
      process.env.NEXT_PUBLIC_INSTAGRAM_URL,
      process.env.NEXT_PUBLIC_YOUTUBE_URL,
      process.env.NEXT_PUBLIC_LINKEDIN_URL,
    ].filter(Boolean) as string[],
    pages,
    localePages,
  };
}

const DEFAULT_CTX = buildDefaultSeoContext();

type MetadataOptions = {
  noIndex?: boolean;
  locale?: Locale;
};

function resolvePageCopy(
  key: PageSeoKey,
  ctx: SeoContext,
  locale?: Locale
) {
  const page = ctx.pages[key];
  const localized =
    key === "home" && locale && locale !== "en"
      ? ctx.localePages[locale]
      : undefined;

  return {
    title: localized?.title ?? page.title,
    description: localized?.description ?? page.description,
    path: page.path,
    keywords: page.keywords,
  };
}

export function buildCanonical(
  path: string,
  locale?: Locale,
  siteUrl: string = DEFAULT_CTX.siteUrl
): string {
  if (locale && locale !== "en" && path === "/") {
    return `${siteUrl}/${locale}`;
  }
  return `${siteUrl}${path === "/" ? "" : path}`;
}

export function buildLanguageAlternates(
  path: string,
  siteUrl: string = DEFAULT_CTX.siteUrl
): Record<string, string> {
  const languages: Record<string, string> = {
    en: buildCanonical(path, undefined, siteUrl),
    "x-default": buildCanonical(path, undefined, siteUrl),
  };

  if (path === "/") {
    for (const locale of LOCALE_HOME_PREFIXES) {
      languages[locale] = `${siteUrl}/${locale}`;
    }
  }

  return languages;
}

function ogImage(ctx: SeoContext) {
  const url = ctx.ogImageUrl || "/opengraph-image";
  return [
    {
      url,
      width: 1200,
      height: 630,
      alt: `${ctx.siteName} — ${ctx.tagline}`,
    },
  ];
}

export function createPageMetadata(
  key: PageSeoKey,
  options?: MetadataOptions,
  ctx: SeoContext = DEFAULT_CTX
): Metadata {
  const page = PAGE_SEO[key];
  const copy = resolvePageCopy(key, ctx, options?.locale);
  const canonical = buildCanonical(page.path, options?.locale, ctx.siteUrl);
  const keywords = [...ctx.defaultKeywords, ...(copy.keywords ?? [])];

  const metadata: Metadata = {
    title: copy.title,
    description: copy.description,
    keywords,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(page.path, ctx.siteUrl),
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: canonical,
      siteName: ctx.siteName,
      locale: ctx.locale,
      type: "website",
      images: ogImage(ctx),
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [ctx.ogImageUrl || "/opengraph-image"],
    },
  };

  if (options?.noIndex) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}

export function createRootMetadata(ctx: SeoContext = DEFAULT_CTX): Metadata {
  const home = createPageMetadata("home", undefined, ctx);
  return {
    ...home,
    metadataBase: new URL(ctx.siteUrl),
    applicationName: ctx.siteName,
    authors: [{ name: ctx.siteName, url: ctx.siteUrl }],
    creator: ctx.siteName,
    publisher: ctx.siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: ctx.googleVerification || undefined,
      yandex: ctx.yandexVerification || undefined,
      other: ctx.bingVerification
        ? { "msvalidate.01": ctx.bingVerification }
        : undefined,
    },
    icons: {
      icon: [{ url: "/icon", type: "image/png" }],
      apple: [{ url: "/apple-icon", type: "image/png" }],
    },
    manifest: "/manifest.webmanifest",
  };
}

export async function getPageMetadata(
  key: PageSeoKey,
  options?: MetadataOptions
): Promise<Metadata> {
  const { getSeoContext } = await import("@/lib/site-settings");
  const ctx = await getSeoContext();
  return createPageMetadata(key, options, ctx);
}

export async function getRootMetadata(): Promise<Metadata> {
  const { getSeoContext } = await import("@/lib/site-settings");
  const ctx = await getSeoContext();
  return createRootMetadata(ctx);
}

export function organizationJsonLd(ctx: SeoContext = DEFAULT_CTX) {
  const logo = ctx.ogImageUrl || `${ctx.siteUrl}/opengraph-image`;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ctx.siteName,
    url: ctx.siteUrl,
    logo,
    description: ctx.description,
    email: ctx.email,
    telephone: ctx.phone,
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: ctx.supportEmail,
        telephone: ctx.phone,
        contactType: "customer support",
        availableLanguage: ["English", "Hindi", "Telugu", "Tamil", "Kannada"],
      },
    ],
    sameAs: ctx.socialUrls,
  };
}

export function websiteJsonLd(ctx: SeoContext = DEFAULT_CTX) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ctx.siteName,
    url: ctx.siteUrl,
    description: ctx.description,
    inLanguage: LOCALES.map((locale) =>
      locale === "en" ? "en-IN" : `${locale}-IN`
    ),
    publisher: {
      "@type": "Organization",
      name: ctx.siteName,
      url: ctx.siteUrl,
    },
  };
}

export function webPageJsonLd(
  key: PageSeoKey,
  locale?: Locale,
  ctx: SeoContext = DEFAULT_CTX
) {
  const copy = resolvePageCopy(key, ctx, locale);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: copy.title,
    description: copy.description,
    url: buildCanonical(PAGE_SEO[key].path, locale, ctx.siteUrl),
    isPartOf: {
      "@type": "WebSite",
      name: ctx.siteName,
      url: ctx.siteUrl,
    },
    inLanguage: locale && locale !== "en" ? `${locale}-IN` : "en-IN",
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
  locale?: Locale,
  ctx: SeoContext = DEFAULT_CTX
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildCanonical(item.path, locale, ctx.siteUrl),
    })),
  };
}
