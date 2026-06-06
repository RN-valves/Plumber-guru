"use client";

import { Suspense, useState } from "react";
import { LoginSuccessBanner } from "@/components/auth/LoginSuccessBanner";
import { Sidebar } from "@/components/admin/Sidebar";
import { TopBar } from "@/components/admin/TopBar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

type AdminShellProps = {
  children: React.ReactNode;
  adminName: string;
  adminRole: string;
  adminImage?: string | null;
};

export function AdminShell({
  children,
  adminName,
  adminRole,
  adminImage,
}: AdminShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-gray-950">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(249,115,22,0.06),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(59,130,246,0.04),_transparent_50%)]"
        aria-hidden
      />
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] lg:block lg:shadow-xl lg:shadow-black/5">
        <Sidebar adminName={adminName} adminRole={adminRole} />
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent
          side="left"
          showCloseButton
          className="w-[260px] max-w-[260px] gap-0 border-r p-0 sm:max-w-[260px]"
        >
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <Sidebar
            adminName={adminName}
            adminRole={adminRole}
            onNavigate={() => setMobileNavOpen(false)}
            className="border-r-0"
          />
        </SheetContent>
      </Sheet>

      <div className="relative z-10 flex min-h-screen min-w-0 flex-1 flex-col lg:pl-[260px]">
        <TopBar
          onMenuClick={() => setMobileNavOpen(true)}
          adminName={adminName}
          adminImage={adminImage}
        />
        <Suspense fallback={null}>
          <LoginSuccessBanner />
        </Suspense>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
