import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getFirstAllowedAdminRoute } from "@/lib/admin-permissions";
import { getAdminAccessByUserId } from "@/lib/admin-users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminAccessDeniedPage() {
  const session = await getServerSession(authOptions);
  const access = session?.user?.id
    ? await getAdminAccessByUserId(session.user.id)
    : null;
  const fallback = access ? getFirstAllowedAdminRoute(access) : "/";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
        <ShieldAlert className="size-8" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-foreground">Access denied</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        You don&apos;t have permission to view this section. Contact your super
        admin if you need access.
      </p>
      <Link href={fallback} className={cn(buttonVariants(), "mt-6")}>
        Go to allowed section
      </Link>
    </div>
  );
}
