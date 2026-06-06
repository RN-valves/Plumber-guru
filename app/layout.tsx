import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getRootMetadata,
  organizationJsonLd,
  webPageJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { getSeoContext } from "@/lib/site-settings";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return getRootMetadata();
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getSeoContext();

  return (
    <html lang="en-IN" suppressHydrationWarning className={inter.variable}>
      <head>
        <JsonLd
          data={[
            organizationJsonLd(ctx),
            websiteJsonLd(ctx),
            webPageJsonLd("home", undefined, ctx),
          ]}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <SiteChrome>{children}</SiteChrome>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
