import type { Metadata } from "next";
import { PageSeo } from "@/components/seo/PageSeo";
import { getPageMetadata, type PageSeoKey } from "@/lib/seo";
import { getSeoContext } from "@/lib/site-settings";

type PageLayoutOptions = {
  page: PageSeoKey;
  breadcrumbs?: { name: string; path: string }[];
  noIndex?: boolean;
};

export function createPageLayout({
  page,
  breadcrumbs,
  noIndex,
}: PageLayoutOptions) {
  async function generateMetadata(): Promise<Metadata> {
    return getPageMetadata(page, noIndex ? { noIndex: true } : undefined);
  }

  async function Layout({ children }: { children: React.ReactNode }) {
    const ctx = await getSeoContext();
    return (
      <>
        {!noIndex && breadcrumbs ? (
          <PageSeo page={page} ctx={ctx} breadcrumbs={breadcrumbs} />
        ) : null}
        {children}
      </>
    );
  }

  return { generateMetadata, default: Layout };
}
