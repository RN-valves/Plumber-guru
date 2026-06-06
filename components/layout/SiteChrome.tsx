"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { LoginSuccessBanner } from "@/components/auth/LoginSuccessBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <LoginSuccessBanner />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
