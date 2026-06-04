import type { NextRequest } from "next/server";

export const LOCALES = ["en", "hi", "te", "ta", "kn"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "pg-locale";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  te: "తెలుగు",
  ta: "தமிழ்",
  kn: "ಕನ್ನಡ",
};

export function getLocaleLabel(locale: Locale): string {
  return LOCALE_LABELS[locale];
}

export function isValidLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Map Accept-Language tags to supported locale codes. */
export function detectLocaleFromRequest(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isValidLocale(cookie)) return cookie;

  const accept = request.headers.get("accept-language") ?? "";
  const tags = accept
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean);

  for (const tag of tags) {
    const base = tag.split("-")[0];
    if (isValidLocale(base)) return base;
    if (base === "mr" || base === "bn") return "hi";
  }

  return DEFAULT_LOCALE;
}

export function pathnameHasLocale(pathname: string): boolean {
  return LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

export function stripLocalePrefix(pathname: string): string {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1) || "/";
    }
  }
  return pathname;
}
