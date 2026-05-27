import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plumber Guru — India's #1 Plumber Platform",
  description:
    "Plumber Guru — भारत का नंबर 1 प्लंबर प्लेटफॉर्म। Find certified plumbers, get training, jobs, and tools. भारत के प्लंबरों के लिए बनाया गया।",
  keywords: [
    "plumber",
    "plumbing",
    "India",
    "प्लंबर",
    "प्लंबिंग",
    "plumber training",
    "plumber jobs",
    "find plumber",
  ],
  metadataBase: new URL("https://plumber-guru.com"),
  openGraph: {
    title: "Plumber Guru — India's #1 Plumber Platform",
    description:
      "भारत का नंबर 1 प्लंबर प्लेटफॉर्म | India's #1 platform for plumbers — training, jobs, and tools.",
    url: "https://plumber-guru.com",
    siteName: "Plumber Guru",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plumber Guru — India's #1 Plumber Platform",
    description:
      "भारत का नंबर 1 प्लंबर प्लेटफॉर्म | Training, Jobs & Tools for Indian Plumbers.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
