import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { authOptions, calcProfileComplete } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { CustomerDashboardView } from "@/components/dashboard/CustomerDashboardView";
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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { login?: string };
}) {
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
      <div className="relative min-h-[calc(100vh-8rem)] bg-[#f8fafc] py-10 dark:bg-gray-950">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(30,58,138,0.06),_transparent_55%)]"
          aria-hidden
        />
        <div className="container-pg relative">
          <CustomerDashboardView
            userName={userName}
            phone={session.user.phone}
          />
        </div>
      </div>
    );
  }

  if (session.user.role === "admin") {
    const loginSuccess =
      searchParams?.login === "success" ? "?login=success" : "";
    redirect(`/admin${loginSuccess}`);
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)] bg-[#f8fafc] py-10 dark:bg-gray-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(249,115,22,0.08),_transparent_55%)]"
        aria-hidden
      />
      <div className="container-pg relative">
        <DashboardView
          userName={userName}
          phone={session.user.phone}
          role={session.user.role}
          profileComplete={profileComplete}
          missingFields={missingFields}
        />
      </div>
    </div>
  );
}
