import { ObjectId, type Document } from "mongodb";
import type { PlumberListItem, PlumberDetailResponse } from "@/types/admin-api";

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Delhi: { lat: 28.6139, lng: 77.209 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
};

export function parseObjectId(id: string): ObjectId | null {
  try {
    if (!ObjectId.isValid(id)) return null;
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export function formatDate(d: Date | string | undefined): string {
  if (!d) return "—";
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeTime(d: Date | string | undefined): string {
  if (!d) return "—";
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return "—";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${Math.max(1, mins)} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function serializePlumberListItem(doc: Document): PlumberListItem {
  const createdAt = doc.createdAt as Date | undefined;
  return {
    id: doc._id.toString(),
    name: (doc.name as string) || "Unknown",
    phone: (doc.phone as string) || "",
    city: (doc.city as string) || "—",
    skills: Array.isArray(doc.skills) ? (doc.skills as string[]) : [],
    verified: Boolean(doc.verified),
    rating: typeof doc.rating === "number" ? doc.rating : 0,
    jobsDone: typeof doc.jobsDone === "number" ? doc.jobsDone : 0,
    joinedDate: createdAt
      ? createdAt.toLocaleDateString("en-IN")
      : "—",
    status: (doc.status as PlumberListItem["status"]) || "active",
    available:
      (doc.available as PlumberListItem["available"]) || "offline",
  };
}

export function serializePlumberDetail(
  doc: Document,
  jobs: Document[] = []
): PlumberDetailResponse {
  const city = (doc.city as string) || "";
  const coords = CITY_COORDS[city] ?? CITY_COORDS.Delhi;
  const id = doc._id.toString();
  const jobsDone =
    typeof doc.jobsDone === "number"
      ? doc.jobsDone
      : jobs.filter((j) => j.status === "completed").length;

  return {
    id,
    name: (doc.name as string) || "Unknown",
    phone: (doc.phone as string) || "",
    email: (doc.email as string) || "",
    city: city || "—",
    languages: Array.isArray(doc.languages)
      ? (doc.languages as string[])
      : doc.language
        ? [doc.language as string]
        : ["Hindi"],
    skills: Array.isArray(doc.skills) ? (doc.skills as string[]) : [],
    verified: Boolean(doc.verified),
    rating: typeof doc.rating === "number" ? doc.rating : 0,
    reviewCount: typeof doc.reviewCount === "number" ? doc.reviewCount : 0,
    joinedDate: formatDate(doc.createdAt as Date),
    lastActive: formatRelativeTime(
      (doc.lastActiveAt as Date) || (doc.updatedAt as Date)
    ),
    status: (doc.status as string) || "active",
    available: (doc.available as string) || "offline",
    location: doc.location
      ? (doc.location as { lat: number; lng: number })
      : { lat: coords.lat, lng: coords.lng },
    adminNotes: (doc.adminNotes as string) || "",
    stats: {
      jobsDone,
      earningsEstimate: jobsDone * 1850,
      profileViews:
        typeof doc.profileViews === "number" ? doc.profileViews : 0,
    },
    jobs: jobs.map((j) => ({
      id: j._id.toString(),
      title: (j.title as string) || "Job",
      customer: (j.customer as string) || (j.postedBy as string) || "—",
      city: (j.city as string) || city,
      status: (j.status as string) || "applied",
      amount: typeof j.amount === "number" ? j.amount : (j.salary as number) || 0,
      date: formatDate((j.createdAt as Date) || (j.postedDate as Date)),
    })),
    documents: Array.isArray(doc.documents)
      ? (doc.documents as PlumberDetailResponse["documents"])
      : [],
    activityLog: Array.isArray(doc.activityLog)
      ? (doc.activityLog as PlumberDetailResponse["activityLog"])
      : [],
  };
}

export function fillRegistrationDays(
  rows: { date: string; count: number }[]
): { date: string; count: number }[] {
  const map = new Map(rows.map((r) => [r.date, r.count]));
  const result: { date: string; count: number }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
    result.push({ date: label, count: map.get(key) ?? 0 });
  }
  return result;
}

export function startOfMonth(): Date {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function thirtyDaysAgo(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 29);
  d.setHours(0, 0, 0, 0);
  return d;
}
