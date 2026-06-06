import { NextResponse } from "next/server";
import {
  recordAdminAction,
  requireAdminPermission,
  requireSuperAdmin,
} from "@/lib/admin-auth";
import {
  createSubAdmin,
  listAdminActivity,
  listAdminUsers,
} from "@/lib/admin-users";
import type { AdminPermission, AdminRoleType } from "@/types/admin-permissions";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminPermission("settings.admins");
  if (auth.error) return auth.error;

  try {
    const [admins, activity] = await Promise.all([
      listAdminUsers(),
      listAdminActivity(20),
    ]);

    return NextResponse.json({ admins, activity });
  } catch (err) {
    console.error("[admin/admins GET]", err);
    return NextResponse.json(
      { error: "Failed to load admin users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const adminRole = body.adminRole as AdminRoleType;
    const permissions = body.permissions as AdminPermission[] | undefined;

    if (!body.name?.trim() || !body.phone?.trim()) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    if (
      !adminRole ||
      !["super_admin", "content_manager", "support_agent", "city_manager"].includes(
        adminRole
      )
    ) {
      return NextResponse.json({ error: "Invalid admin role" }, { status: 400 });
    }

    if (adminRole === "city_manager" && !body.assignedCity?.trim()) {
      return NextResponse.json(
        { error: "Assigned city is required for city managers" },
        { status: 400 }
      );
    }

    const admin = await createSubAdmin({
      name: body.name,
      phone: body.phone,
      email: body.email,
      adminRole,
      permissions,
      assignedCity: body.assignedCity ?? null,
    });

    await recordAdminAction(
      auth.session!,
      "Invited admin",
      `${admin.name} (${admin.phone}) as ${admin.adminRole}`
    );

    return NextResponse.json({ admin }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create admin";
    console.error("[admin/admins POST]", err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
