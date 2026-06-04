import { NextResponse } from "next/server";
import { requireAdmin, plumberBaseFilter } from "@/lib/admin-auth";
import { getDb } from "@/lib/mongodb";
import {
  fillRegistrationDays,
  startOfMonth,
  thirtyDaysAgo,
} from "@/lib/admin-serialize";
import type { AdminStatsResponse } from "@/types/admin-api";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const db = await getDb();
    const users = db.collection("users");
    const jobs = db.collection("jobs");
    const base = plumberBaseFilter();
    const monthStart = startOfMonth();
    const since30 = thirtyDaysAgo();

    const [
      totalPlumbers,
      verifiedPlumbers,
      pendingVerification,
      activeJobs,
      newPlumbersThisMonth,
      cityAgg,
      registrationAgg,
    ] = await Promise.all([
      users.countDocuments(base),
      users.countDocuments({ ...base, verified: true }),
      users.countDocuments({
        ...base,
        $or: [{ verified: false }, { verified: { $exists: false } }],
      }),
      jobs.countDocuments({
        status: "active",
        deleted: { $ne: true },
      }),
      users.countDocuments({
        ...base,
        createdAt: { $gte: monthStart },
      }),
      users
        .aggregate<{ _id: string; count: number }>([
          {
            $match: {
              ...base,
              city: { $exists: true, $nin: ["", null] },
            },
          },
          { $group: { _id: "$city", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ])
        .toArray(),
      users
        .aggregate<{ _id: string; count: number }>([
          {
            $match: {
              ...base,
              createdAt: { $gte: since30 },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),
    ]);

    const body: AdminStatsResponse = {
      totalPlumbers,
      verifiedPlumbers,
      pendingVerification,
      activeJobs,
      newPlumbersThisMonth,
      plumbersByCity: cityAgg.map((c) => ({
        city: c._id,
        count: c.count,
      })),
      registrationsLast30Days: fillRegistrationDays(
        registrationAgg.map((r) => ({ date: r._id, count: r.count }))
      ),
    };

    return NextResponse.json(body);
  } catch (err) {
    console.error("[admin/stats]", err);
    return NextResponse.json(
      { error: "Failed to load admin stats" },
      { status: 500 }
    );
  }
}
