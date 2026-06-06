import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  type PageSeoKey,
  webPageJsonLd,
} from "@/lib/seo";
import { buildSeoContext } from "@/lib/site-settings";
import { getDefaultSiteSettings } from "@/lib/site-settings-defaults";
import type { SeoContext } from "@/types/site-settings";
import type { Locale } from "@/lib/locale";

type PageSeoProps = {
  page: PageSeoKey;
  locale?: Locale;
  breadcrumbs?: { name: string; path: string }[];
  ctx?: SeoContext;
};

export function PageSeo({ page, locale, breadcrumbs, ctx }: PageSeoProps) {
  const context = ctx ?? buildSeoContext(getDefaultSiteSettings());
  const schemas: Record<string, unknown>[] = [
    webPageJsonLd(page, locale, context),
  ];

  if (breadcrumbs?.length) {
    schemas.push(breadcrumbJsonLd(breadcrumbs, locale, context));
  }

  return <JsonLd data={schemas} />;
}
