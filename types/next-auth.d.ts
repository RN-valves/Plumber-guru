import "next-auth";
import "next-auth/jwt";
import type {
  AdminPermission,
  AdminRoleType,
  AdminStatus,
} from "@/types/admin-permissions";

export type UserRole = "plumber" | "customer" | "admin";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string;
      role?: UserRole;
      adminRole?: AdminRoleType;
      adminPermissions?: AdminPermission[];
      assignedCity?: string | null;
      adminStatus?: AdminStatus;
    };
  }

  interface User {
    id: string;
    phone?: string;
    role?: UserRole;
    adminRole?: AdminRoleType;
    adminPermissions?: AdminPermission[];
    assignedCity?: string | null;
    adminStatus?: AdminStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    phone?: string;
    role?: UserRole;
    adminRole?: AdminRoleType;
    adminPermissions?: AdminPermission[];
    assignedCity?: string | null;
    adminStatus?: AdminStatus;
  }
}
