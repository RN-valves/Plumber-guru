import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/locale";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale) || params.locale === "en") {
    notFound();
  }

  return <div lang={params.locale as Locale}>{children}</div>;
}
