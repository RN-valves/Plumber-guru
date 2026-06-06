import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import {
  ADMIN_ROLE_PRESETS,
  ALL_ADMIN_PERMISSIONS,
  sanitizePermissions,
} from "@/lib/admin-permissions";
import type {
  AdminAccessProfile,
  AdminActivityRecord,
  AdminPermission,
  AdminRoleType,
  AdminStatus,
  AdminUserRecord,
} from "@/types/admin-permissions";

type DbAdminUser = {
  _id: ObjectId;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  adminRole?: AdminRoleType;
  adminPermissions?: AdminPermission[];
  assignedCity?: string | null;
  adminStatus?: AdminStatus;
  lastLogin?: Date;
  createdAt?: Date;
};

function defaultAdminAccess(): AdminAccessProfile {
  return {
    adminRole: "super_admin",
    permissions: ALL_ADMIN_PERMISSIONS,
    assignedCity: null,
    adminStatus: "active",
  };
}

export function resolveAdminAccess(user: DbAdminUser | null): AdminAccessProfile {
  if (!user || user.role !== "admin") {
    return {
      adminRole: "super_admin",
      permissions: [],
      assignedCity: null,
      adminStatus: "active",
    };
  }

  const adminRole = user.adminRole ?? "super_admin";
  const adminStatus = user.adminStatus ?? "active";

  return {
    adminRole,
    permissions: sanitizePermissions(user.adminPermissions, adminRole),
    assignedCity: user.assignedCity ?? null,
    adminStatus,
  };
}

export async function getAdminAccessByUserId(
  userId: string
): Promise<AdminAccessProfile> {
  try {
    const db = await getDb();
    const user = (await db.collection("users").findOne({
      _id: new ObjectId(userId),
      role: "admin",
    })) as DbAdminUser | null;

    return resolveAdminAccess(user);
  } catch {
    return defaultAdminAccess();
  }
}

function formatDate(value?: Date | null): string | null {
  if (!value) return null;
  return value.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function toAdminUserRecord(user: DbAdminUser): AdminUserRecord {
  const adminRole = user.adminRole ?? "super_admin";
  return {
    id: user._id.toString(),
    name: user.name || "Admin",
    email: user.email || "",
    phone: user.phone || "",
    adminRole,
    permissions: sanitizePermissions(user.adminPermissions, adminRole),
    assignedCity: user.assignedCity ?? null,
    adminStatus: user.adminStatus ?? "active",
    lastLogin: formatDate(user.lastLogin),
    createdAt: formatDate(user.createdAt) ?? "—",
  };
}

export async function listAdminUsers(): Promise<AdminUserRecord[]> {
  const db = await getDb();
  const users = (await db
    .collection("users")
    .find({ role: "admin" })
    .sort({ createdAt: -1 })
    .toArray()) as DbAdminUser[];

  return users.map(toAdminUserRecord);
}

export async function createSubAdmin(input: {
  name: string;
  phone: string;
  email?: string;
  adminRole: AdminRoleType;
  permissions?: AdminPermission[];
  assignedCity?: string | null;
}): Promise<AdminUserRecord> {
  const db = await getDb();
  const now = new Date();
  const permissions = sanitizePermissions(
    input.permissions ?? ADMIN_ROLE_PRESETS[input.adminRole],
    input.adminRole
  );

  const normalizedPhone = input.phone.replace(/\D/g, "").slice(-10);
  if (normalizedPhone.length !== 10) {
    throw new Error("Valid 10-digit phone number is required");
  }

  const existing = await db.collection("users").findOne({
    phone: normalizedPhone,
  });

  if (existing && existing.role !== "admin") {
    throw new Error("This phone number belongs to a plumber or customer account");
  }

  const payload = {
    name: input.name.trim(),
    email: input.email?.trim() || "",
    phone: normalizedPhone,
    role: "admin",
    adminRole: input.adminRole,
    adminPermissions: permissions,
    assignedCity:
      input.adminRole === "city_manager" ? input.assignedCity?.trim() || null : null,
    adminStatus: "invited" as AdminStatus,
    isActive: true,
    updatedAt: now,
  };

  if (existing) {
    await db.collection("users").updateOne(
      { _id: existing._id },
      {
        $set: payload,
      }
    );
    const updated = (await db.collection("users").findOne({
      _id: existing._id,
    })) as DbAdminUser;
    return toAdminUserRecord(updated);
  }

  const result = await db.collection("users").insertOne({
    ...payload,
    city: input.assignedCity?.trim() || "",
    skills: [],
    language: "hi",
    isProfileComplete: true,
    profileComplete: 100,
    createdAt: now,
  });

  const created = (await db.collection("users").findOne({
    _id: result.insertedId,
  })) as DbAdminUser;

  return toAdminUserRecord(created);
}

export async function updateSubAdmin(
  adminId: string,
  patch: {
    name?: string;
    email?: string;
    adminRole?: AdminRoleType;
    permissions?: AdminPermission[];
    assignedCity?: string | null;
    adminStatus?: AdminStatus;
  }
): Promise<AdminUserRecord | null> {
  const db = await getDb();
  const existing = (await db.collection("users").findOne({
    _id: new ObjectId(adminId),
    role: "admin",
  })) as DbAdminUser | null;

  if (!existing) return null;

  const adminRole = patch.adminRole ?? existing.adminRole ?? "super_admin";
  const update: Record<string, unknown> = { updatedAt: new Date() };

  if (patch.name !== undefined) update.name = patch.name.trim();
  if (patch.email !== undefined) update.email = patch.email.trim();
  if (patch.adminRole !== undefined) update.adminRole = patch.adminRole;
  if (patch.adminStatus !== undefined) update.adminStatus = patch.adminStatus;

  if (patch.permissions !== undefined || patch.adminRole !== undefined) {
    update.adminPermissions = sanitizePermissions(
      patch.permissions ?? existing.adminPermissions,
      adminRole
    );
  }

  if (patch.assignedCity !== undefined || patch.adminRole !== undefined) {
    update.assignedCity =
      adminRole === "city_manager"
        ? patch.assignedCity ?? existing.assignedCity ?? null
        : null;
  }

  await db.collection("users").updateOne({ _id: existing._id }, { $set: update });

  const updated = (await db.collection("users").findOne({
    _id: existing._id,
  })) as DbAdminUser;

  return toAdminUserRecord(updated);
}

export async function logAdminActivity(input: {
  adminId: string;
  adminName: string;
  action: string;
  detail: string;
}): Promise<void> {
  try {
    const db = await getDb();
    await db.collection("admin_activity").insertOne({
      adminId: input.adminId,
      adminName: input.adminName,
      action: input.action,
      detail: input.detail,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("[logAdminActivity]", err);
  }
}

export async function listAdminActivity(limit = 20): Promise<AdminActivityRecord[]> {
  const db = await getDb();
  const rows = await db
    .collection("admin_activity")
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return rows.map((row) => ({
    id: row._id.toString(),
    adminId: String(row.adminId ?? ""),
    adminName: String(row.adminName ?? "Admin"),
    action: String(row.action ?? ""),
    detail: String(row.detail ?? ""),
    createdAt: formatDate(row.createdAt as Date) ?? "—",
  }));
}
