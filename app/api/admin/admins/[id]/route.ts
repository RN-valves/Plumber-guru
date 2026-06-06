import { NextResponse } from "next/server";
import {
  recordAdminAction,
  requireSuperAdmin,
} from "@/lib/admin-auth";
import { updateSubAdmin } from "@/lib/admin-users";
import type { AdminPermission, AdminRoleType, AdminStatus } from "@/types/admin-permissions";

export const dynamic = "force-dynamic";

type RouteContext = { params: { id: string } };

export async function PATCH(request: Request, { params }: RouteContext) {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();

    if (params.id === auth.session!.user.id && body.adminStatus === "suspended") {
      return NextResponse.json(
        { error: "You cannot suspend your own account" },
        { status: 400 }
      );
    }

    if (
      params.id === auth.session!.user.id &&
      body.adminRole &&
      body.adminRole !== "super_admin"
    ) {
      return NextResponse.json(
        { error: "You cannot remove your own super admin access" },
        { status: 400 }
      );
    }

    const admin = await updateSubAdmin(params.id, {
      name: body.name,
      email: body.email,
      adminRole: body.adminRole as AdminRoleType | undefined,
      permissions: body.permissions as AdminPermission[] | undefined,
      assignedCity: body.assignedCity,
      adminStatus: body.adminStatus as AdminStatus | undefined,
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    await recordAdminAction(
      auth.session!,
      "Updated admin access",
      `${admin.name} — ${admin.adminRole}`
    );

    return NextResponse.json({ admin });
  } catch (err) {
    console.error("[admin/admins PATCH]", err);
    return NextResponse.json(
      { error: "Failed to update admin user" },
      { status: 500 }
    );
  }
}
