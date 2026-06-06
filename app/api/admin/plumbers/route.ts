import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireAdminPermission, plumberBaseFilter } from "@/lib/admin-auth";
import { serializePlumberListItem } from "@/lib/admin-serialize";
import { getDb } from "@/lib/mongodb";
import type {
  PlumberBulkPatchBody,
  PlumbersListResponse,
} from "@/types/admin-api";

export const dynamic = "force-dynamic";

function parseVerifiedParam(value: string | null): boolean | undefined {
  if (value === "true" || value === "verified") return true;
  if (value === "false" || value === "pending") return false;
  return undefined;
}

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission("plumbers.view");
  if (auth.error) return auth.error;

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
  );
  const search = searchParams.get("search")?.trim() || "";
  const city = searchParams.get("city")?.trim() || "";
  const verified = parseVerifiedParam(searchParams.get("verified"));
  const available = searchParams.get("available")?.trim() || "";
  const skill = searchParams.get("skill")?.trim() || "";

  const filter: Record<string, unknown> = { ...plumberBaseFilter() };

  if (city && city !== "All cities") filter.city = city;
  if (verified === true) filter.verified = true;
  if (verified === false) {
    filter.$or = [{ verified: false }, { verified: { $exists: false } }];
  }
  if (available && available !== "all") filter.available = available;
  if (skill && skill !== "All skills") {
    filter.skills = { $regex: skill, $options: "i" };
  }
  if (search) {
    const searchOr = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
    ];
    filter.$and = [
      ...(Array.isArray(filter.$and) ? filter.$and : []),
      { $or: searchOr },
    ];
  }

  try {
    const db = await getDb();
    const users = db.collection("users");
    const skip = (page - 1) * limit;

    const [docs, totalCount] = await Promise.all([
      users
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      users.countDocuments(filter),
    ]);

    const body: PlumbersListResponse = {
      plumbers: docs.map(serializePlumberListItem),
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      page,
      limit,
    };

    return NextResponse.json(body);
  } catch (err) {
    console.error("[admin/plumbers GET]", err);
    return NextResponse.json(
      { error: "Failed to load plumbers" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdminPermission("plumbers.view");
  if (auth.error) return auth.error;

  let body: PlumberBulkPatchBody;
  try {
    body = (await req.json()) as PlumberBulkPatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.ids) || body.ids.length === 0) {
    return NextResponse.json({ error: "ids array required" }, { status: 400 });
  }

  if (!["verify", "suspend", "delete"].includes(body.action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const objectIds = body.ids
    .map((id) => {
      try {
        return ObjectId.isValid(id) ? new ObjectId(id) : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as ObjectId[];

  if (objectIds.length === 0) {
    return NextResponse.json({ error: "No valid ids" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const users = db.collection("users");
    const now = new Date();

    if (body.action === "verify") {
      await users.updateMany(
        { _id: { $in: objectIds }, role: "plumber" },
        { $set: { verified: true, verifiedAt: now, updatedAt: now } }
      );
    } else if (body.action === "suspend") {
      await users.updateMany(
        { _id: { $in: objectIds }, role: "plumber" },
        { $set: { status: "suspended", updatedAt: now } }
      );
    } else if (body.action === "delete") {
      await users.updateMany(
        { _id: { $in: objectIds }, role: "plumber" },
        { $set: { deleted: true, deletedAt: now, updatedAt: now } }
      );
    }

    return NextResponse.json({
      ok: true,
      modified: objectIds.length,
      action: body.action,
    });
  } catch (err) {
    console.error("[admin/plumbers PATCH]", err);
    return NextResponse.json(
      { error: "Bulk action failed" },
      { status: 500 }
    );
  }
}
