import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import {
  hasAdminPermission,
  isSuperAdmin,
} from "@/lib/admin-permissions";
import { getAdminAccessByUserId, logAdminActivity } from "@/lib/admin-users";
import type { AdminAccessProfile, AdminPermission } from "@/types/admin-permissions";

export type AdminSession = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    phone?: string;
    role?: string;
    adminRole?: AdminAccessProfile["adminRole"];
    adminPermissions?: AdminPermission[];
    assignedCity?: string | null;
    adminStatus?: AdminAccessProfile["adminStatus"];
  };
};

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (session.user.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  const access = await getAdminAccessByUserId(session.user.id);

  if (access.adminStatus === "suspended") {
    return {
      error: NextResponse.json({ error: "Admin account suspended" }, { status: 403 }),
    };
  }

  return { session: session as AdminSession, access };
}

export async function requireAdminPermission(permission: AdminPermission) {
  const auth = await requireAdmin();
  if (auth.error) return auth;

  if (!hasAdminPermission(auth.access!, permission)) {
    return {
      error: NextResponse.json(
        { error: "You do not have permission for this action" },
        { status: 403 }
      ),
    };
  }

  return auth;
}

export async function requireSuperAdmin() {
  const auth = await requireAdmin();
  if (auth.error) return auth;

  if (!isSuperAdmin(auth.access!)) {
    return {
      error: NextResponse.json(
        { error: "Only super admins can perform this action" },
        { status: 403 }
      ),
    };
  }

  return auth;
}

export async function recordAdminAction(
  session: AdminSession,
  action: string,
  detail: string
) {
  await logAdminActivity({
    adminId: session.user.id,
    adminName: session.user.name || "Admin",
    action,
    detail,
  });
}

export function plumberBaseFilter() {
  return {
    role: "plumber",
    deleted: { $ne: true },
  } as const;
}
