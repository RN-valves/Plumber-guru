import "next-auth";
import "next-auth/jwt";

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
    };
  }

  interface User {
    id: string;
    phone?: string;
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    phone?: string;
    role?: UserRole;
  }
}
