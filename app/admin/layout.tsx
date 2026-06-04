import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  const adminName = session.user.name || "Admin";
  const adminRole = session.user.role || "admin";

  return (
    <AdminShell
      adminName={adminName}
      adminRole={adminRole}
      adminImage={session.user.image}
    >
      {children}
    </AdminShell>
  );
}
