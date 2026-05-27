import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { authOptions, calcProfileComplete } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const dynamic = "force-dynamic";

function getMissingFields(user: {
  name?: string;
  phone?: string;
  city?: string;
  skills?: string[];
  role?: string;
}): string[] {
  const missing: string[] = [];
  if (!user.name) missing.push("Name");
  if (!user.phone) missing.push("Phone");
  if (!user.city) missing.push("City");
  if (user.role === "plumber" && (!user.skills || user.skills.length === 0)) {
    missing.push("Skills");
  }
  return missing;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  let profileComplete = 60;
  let missingFields: string[] = [];
  let userName = session.user.name || "Plumber";

  try {
    const db = await getDb();
    const user = await db.collection("users").findOne({
      _id: new ObjectId(session.user.id),
    });

    if (user) {
      userName = (user.name as string) || userName;
      profileComplete =
        (user.profileComplete as number) ||
        calcProfileComplete({
          name: user.name as string,
          phone: user.phone as string,
          city: user.city as string,
          skills: user.skills as string[],
          role: user.role as string,
        });
      missingFields = getMissingFields({
        name: user.name as string,
        phone: user.phone as string,
        city: user.city as string,
        skills: user.skills as string[],
        role: user.role as string,
      });
    }
  } catch {
    // DB unavailable — show dashboard with session data only
    missingFields = getMissingFields({
      name: session.user.name || undefined,
      phone: session.user.phone,
      role: session.user.role,
    });
    profileComplete = calcProfileComplete({
      name: session.user.name || undefined,
      phone: session.user.phone,
      role: session.user.role,
    });
  }

  if (session.user.role === "customer") {
    return (
      <div className="container-pg py-10">
        <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Customer Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Namaste, {userName}! Find a plumber near you.
          </p>
          <a
            href="/find-plumber"
            className="mt-6 inline-flex rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold px-6 py-3"
          >
            Find Plumber
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-8rem)] py-10">
      <div className="container-pg">
        <DashboardView
          userName={userName}
          phone={session.user.phone}
          profileComplete={profileComplete}
          missingFields={missingFields}
        />
      </div>
    </div>
  );
}
