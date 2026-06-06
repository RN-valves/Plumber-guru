import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireAdminPermission } from "@/lib/admin-auth";
import { formatDate } from "@/lib/admin-serialize";
import { getDb } from "@/lib/mongodb";
import type { Document } from "mongodb";
import type { JobListItem, JobPatchBody, JobsListResponse } from "@/types/admin-api";

export const dynamic = "force-dynamic";

function serializeJob(doc: Document): JobListItem {
  return {
    id: doc._id.toString(),
    title: (doc.title as string) || "",
    postedBy: (doc.postedBy as string) || (doc.company as string) || "—",
    city: (doc.city as string) || "—",
    salary:
      typeof doc.salary === "number"
        ? doc.salary
        : (doc.salaryPerDay as number) || 0,
    skills: Array.isArray(doc.skills) ? (doc.skills as string[]) : [],
    applications:
      typeof doc.applications === "number" ? doc.applications : 0,
    status: (doc.status as string) || "active",
    jobType: (doc.jobType as string) || "gig",
    postedDate: formatDate(
      (doc.postedDate as Date) || (doc.createdAt as Date)
    ),
    featured: Boolean(doc.featured),
  };
}

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission("jobs.view");
  if (auth.error) return auth.error;

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
  );
  const search = searchParams.get("search")?.trim() || "";
  const city = searchParams.get("city")?.trim() || "";
  const status = searchParams.get("status")?.trim() || "";
  const jobType = searchParams.get("jobType")?.trim() || "";

  const filter: Record<string, unknown> = { deleted: { $ne: true } };

  if (city && city !== "All cities") filter.city = city;
  if (status && status !== "all") filter.status = status;
  if (jobType && jobType !== "all") filter.jobType = jobType;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { postedBy: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  try {
    const db = await getDb();
    const jobs = db.collection("jobs");
    const skip = (page - 1) * limit;

    const [docs, totalCount] = await Promise.all([
      jobs.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      jobs.countDocuments(filter),
    ]);

    const body: JobsListResponse = {
      jobs: docs.map(serializeJob),
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      page,
      limit,
    };

    return NextResponse.json(body);
  } catch (err) {
    console.error("[admin/jobs GET]", err);
    return NextResponse.json({ error: "Failed to load jobs" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdminPermission("jobs.view");
  if (auth.error) return auth.error;

  let body: JobPatchBody;
  try {
    body = (await req.json()) as JobPatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const ids = body.ids?.length
    ? body.ids
    : body.id
      ? [body.id]
      : [];

  if (ids.length === 0) {
    return NextResponse.json({ error: "id or ids required" }, { status: 400 });
  }

  const objectIds = ids
    .map((id) => (ObjectId.isValid(id) ? new ObjectId(id) : null))
    .filter(Boolean) as ObjectId[];

  if (objectIds.length === 0) {
    return NextResponse.json({ error: "No valid ids" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const jobs = db.collection("jobs");
    const now = new Date();

    if (body.action === "delete") {
      await jobs.updateMany(
        { _id: { $in: objectIds } },
        { $set: { deleted: true, deletedAt: now, updatedAt: now } }
      );
      return NextResponse.json({ ok: true, action: "delete" });
    }

    if (body.action === "feature") {
      await jobs.updateMany(
        { _id: { $in: objectIds } },
        { $set: { featured: true, updatedAt: now } }
      );
      return NextResponse.json({ ok: true, action: "feature" });
    }

    if (body.action === "unfeature") {
      await jobs.updateMany(
        { _id: { $in: objectIds } },
        { $set: { featured: false, updatedAt: now } }
      );
      return NextResponse.json({ ok: true, action: "unfeature" });
    }

    if (body.action === "update_status" && body.status) {
      await jobs.updateMany(
        { _id: { $in: objectIds } },
        { $set: { status: body.status, updatedAt: now } }
      );
      return NextResponse.json({ ok: true, action: "update_status" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("[admin/jobs PATCH]", err);
    return NextResponse.json({ error: "Job update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminPermission("jobs.view");
  if (auth.error) return auth.error;

  const id = req.nextUrl.searchParams.get("id");
  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "id query param required" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const now = new Date();
    const result = await db.collection("jobs").updateOne(
      { _id: new ObjectId(id) },
      { $set: { deleted: true, deletedAt: now, updatedAt: now } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, deleted: true });
  } catch (err) {
    console.error("[admin/jobs DELETE]", err);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
