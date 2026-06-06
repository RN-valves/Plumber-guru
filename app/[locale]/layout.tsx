import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageSeo } from "@/components/seo/PageSeo";
import { isValidLocale, type Locale } from "@/lib/locale";
import { getPageMetadata } from "@/lib/seo";
import { getSeoContext } from "@/lib/site-settings";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isValidLocale(params.locale) || params.locale === "en") {
    return {};
  }

  return getPageMetadata("home", { locale: params.locale as Locale });
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  if (!isValidLocale(params.locale) || params.locale === "en") {
    notFound();
  }

  const locale = params.locale as Locale;
  const ctx = await getSeoContext();

  return (
    <div lang={locale}>
      <PageSeo page="home" locale={locale} ctx={ctx} />
      {children}
    </div>
  );
}
