"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  canAccessAdminRoute,
  getFirstAllowedAdminRoute,
} from "@/lib/admin-permissions";
import type { AdminAccessProfile } from "@/types/admin-permissions";

type AdminPermissionGuardProps = {
  access: AdminAccessProfile;
  children: React.ReactNode;
};

export function AdminPermissionGuard({
  access,
  children,
}: AdminPermissionGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const allowed = canAccessAdminRoute(access, pathname);

  useEffect(() => {
    if (!allowed) {
      router.replace("/admin/access-denied");
    }
  }, [allowed, router]);

  if (!allowed) {
    return null;
  }

  if (
    pathname === "/admin" &&
    !canAccessAdminRoute(access, "/admin") &&
    canAccessAdminRoute(access, getFirstAllowedAdminRoute(access))
  ) {
    router.replace(getFirstAllowedAdminRoute(access));
    return null;
  }

  return <>{children}</>;
}
