import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPermissionGuard } from "@/components/admin/AdminPermissionGuard";
import { getPageMetadata } from "@/lib/seo";
import { formatAdminRoleLabel } from "@/lib/admin-permissions";
import { getAdminAccessByUserId } from "@/lib/admin-users";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("admin", { noIndex: true });
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  const access = await getAdminAccessByUserId(session.user.id);

  if (access.adminStatus === "suspended") {
    redirect("/auth/login?error=AccountSuspended");
  }

  const adminName = session.user.name || "Admin";
  const adminRoleLabel = formatAdminRoleLabel(access.adminRole);

  return (
    <AdminShell
      adminName={adminName}
      adminRole={adminRoleLabel}
      adminImage={session.user.image}
      access={access}
    >
      <AdminPermissionGuard access={access}>{children}</AdminPermissionGuard>
    </AdminShell>
  );
}
