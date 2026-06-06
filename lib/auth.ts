import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { getDb, getMongoClientPromise } from "@/lib/mongodb";
import { verifyPhoneOtpForSession } from "@/lib/otp-service";
import { getAdminAccessByUserId } from "@/lib/admin-users";
import type { UserRole } from "@/types/next-auth";

const authSecret =
  process.env.NEXTAUTH_SECRET || "dev-only-secret-change-before-production";

function calcProfileComplete(user: {
  name?: string;
  phone?: string;
  city?: string;
  skills?: string[];
  role?: string;
}): number {
  if (user.role === "customer") {
    let score = 0;
    if (user.name) score += 34;
    if (user.phone) score += 33;
    if (user.city) score += 33;
    return score;
  }
  let score = 0;
  if (user.name) score += 20;
  if (user.phone) score += 20;
  if (user.city) score += 20;
  if (user.skills?.length) score += 20;
  score += 20;
  return Math.min(100, score);
}

export const authOptions: NextAuthOptions = {
  adapter: process.env.MONGODB_URI
    ? MongoDBAdapter(getMongoClientPromise())
    : undefined,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      id: "phone-otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) return null;

        const fallbackRole = (credentials.role as UserRole) || "plumber";

        const result = await verifyPhoneOtpForSession(
          credentials.phone,
          credentials.otp,
          fallbackRole
        );

        if (!result.success) {
          return null;
        }

        const adminAccess =
          result.role === "admin"
            ? await getAdminAccessByUserId(result.userId)
            : null;

        if (adminAccess?.adminStatus === "suspended") {
          return null;
        }

        return {
          id: result.userId,
          name: result.name || "Plumber Guru User",
          email: `${result.phone}@plumber-guru.local`,
          phone: result.phone,
          role: result.role,
          image: null,
          adminRole: adminAccess?.adminRole,
          adminPermissions: adminAccess?.permissions,
          assignedCity: adminAccess?.assignedCity,
          adminStatus: adminAccess?.adminStatus,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const db = await getDb();
        await db.collection("users").updateOne(
          { email: user.email },
          {
            $set: {
              name: user.name,
              email: user.email,
              image: user.image,
              role: "customer",
              updatedAt: new Date(),
              lastLogin: new Date(),
            },
            $setOnInsert: {
              phone: "",
              city: "",
              skills: [],
              language: "hi",
              profileComplete: 40,
              isProfileComplete: false,
              createdAt: new Date(),
              isActive: true,
            },
          },
          { upsert: true }
        );
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.phone = user.phone;
        token.role = user.role;
        token.name = user.name;
        token.adminRole = user.adminRole;
        token.adminPermissions = user.adminPermissions;
        token.assignedCity = user.assignedCity;
        token.adminStatus = user.adminStatus;
      }

      if (token.role === "admin" && token.userId) {
        const access = await getAdminAccessByUserId(token.userId as string);
        token.adminRole = access.adminRole;
        token.adminPermissions = access.permissions;
        token.assignedCity = access.assignedCity;
        token.adminStatus = access.adminStatus;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.phone = token.phone as string;
        session.user.role = token.role as UserRole;
        session.user.adminRole = token.adminRole;
        session.user.adminPermissions = token.adminPermissions;
        session.user.assignedCity = token.assignedCity ?? null;
        session.user.adminStatus = token.adminStatus;
        if (token.name) session.user.name = token.name as string;
      }
      return session;
    },
  },
  secret: authSecret,
};

export { calcProfileComplete };
