import type { Locale } from "@/lib/locale";
import type { PageSeoKey } from "@/lib/seo-defaults";

export type PublicPageSeoKey = Exclude<
  PageSeoKey,
  "login" | "register" | "dashboard" | "admin" | "notFound"
>;

export type LocaleHomeKey = Exclude<Locale, "en">;

export type SeoPageFields = {
  title: string;
  description: string;
  keywords: string;
  focusKeyword: string;
};

export type SeoSettings = {
  siteUrl: string;
  defaultDescription: string;
  defaultKeywords: string;
  taglineEn: string;
  taglineHi: string;
  supportEmail: string;
  twitterHandle: string;
  googleVerification: string;
  bingVerification: string;
  yandexVerification: string;
  facebookUrl: string;
  linkedinUrl: string;
  ogImageUrl: string;
  pages: Record<PublicPageSeoKey, SeoPageFields>;
  localePages: Record<LocaleHomeKey, { title: string; description: string }>;
};

export type GeneralSettings = {
  siteName: string;
  tagline: string;
  contactPhone: string;
  contactEmail: string;
  whatsapp: string;
  youtube: string;
  instagram: string;
  whatsappChannel: string;
  maintenanceMode: boolean;
};

export type HomepageSettings = {
  statPlumbers: string;
  statJobs: string;
  statCities: string;
  statTraining: string;
  showPodcast: boolean;
  showTestimonials: boolean;
  showLanguageBanner: boolean;
  featuredCities: string[];
};

export type NotificationSettings = {
  enabled: Record<string, boolean>;
  templates: Record<string, string>;
};

export type PaymentSettings = {
  razorpayKey: string;
  leadCommission: string;
  brandBasic: string;
  brandPro: string;
  brandEnterprise: string;
};

export type SiteSettingsDocument = {
  _id: "global";
  general: GeneralSettings;
  seo: SeoSettings;
  homepage: HomepageSettings;
  notifications: NotificationSettings;
  payment: PaymentSettings;
  updatedAt: string;
  updatedBy?: string;
};

export type SiteSettingsPatch = Partial<
  Pick<SiteSettingsDocument, "general" | "seo" | "homepage" | "notifications" | "payment">
>;

export type SeoContext = {
  siteUrl: string;
  siteName: string;
  tagline: string;
  taglineHi: string;
  description: string;
  email: string;
  supportEmail: string;
  phone: string;
  twitterHandle: string;
  locale: string;
  defaultKeywords: string[];
  ogImageUrl: string;
  googleVerification: string;
  bingVerification: string;
  yandexVerification: string;
  socialUrls: string[];
  pages: Record<
    PageSeoKey,
    { title: string; description: string; path: string; keywords: string[] }
  >;
  localePages: Record<LocaleHomeKey, { title: string; description: string }>;
};
