import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { ObjectId } from "mongodb";
import { getDb, getMongoClientPromise } from "@/lib/mongodb";
import { normalizePhone, verifyOtp, type OtpProfile } from "@/lib/otp";
import type { UserRole } from "@/types/next-auth";

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
  if (user.skills && user.skills.length > 0) score += 20;
  score += 20; // language optional bonus
  return Math.min(100, score);
}

async function upsertUserFromOtp(
  phone: string,
  profile: OtpProfile | null,
  fallbackRole: UserRole = "plumber",
) {
  const db = await getDb();
  const users = db.collection("users");

  const existing = await users.findOne({ phone });
  const role = (profile?.role || fallbackRole) as UserRole;

  if (existing) {
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (profile?.name) updates.name = profile.name;
    if (profile?.city) updates.city = profile.city;
    if (profile?.skills?.length) updates.skills = profile.skills;
    if (profile?.language) updates.language = profile.language;

    await users.updateOne({ phone }, { $set: updates });
    const updated = await users.findOne({ phone });
    return updated!;
  }

  const doc = {
    _id: new ObjectId(),
    name: profile?.name || "Plumber Guru User",
    phone,
    email: `${phone}@plumber-guru.local`,
    emailVerified: null,
    image: null,
    role,
    city: profile?.city || "",
    skills: profile?.skills || [],
    language: profile?.language || "hi",
    profileComplete: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  doc.profileComplete = calcProfileComplete(doc);
  await users.insertOne(doc);
  return doc;
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

        const phone = normalizePhone(credentials.phone);
        const otp = credentials.otp.trim();
        const fallbackRole = (credentials.role as UserRole) || "plumber";

        const { valid, profile } = await verifyOtp(phone, otp);
        if (!valid) return null;

        const userDoc = await upsertUserFromOtp(phone, profile ?? null, fallbackRole);

        return {
          id: userDoc._id.toString(),
          name: userDoc.name as string,
          email: userDoc.email as string,
          phone: userDoc.phone as string,
          role: userDoc.role as UserRole,
          image: (userDoc.image as string) || null,
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
            },
            $setOnInsert: {
              phone: "",
              city: "",
              skills: [],
              language: "hi",
              profileComplete: 40,
              createdAt: new Date(),
            },
          },
          { upsert: true },
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.phone = token.phone as string;
        session.user.role = token.role as UserRole;
        if (token.name) session.user.name = token.name as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export { calcProfileComplete };
