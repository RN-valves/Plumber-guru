import { NextRequest, NextResponse } from "next/server";
import { requireAdminPermission, plumberBaseFilter } from "@/lib/admin-auth";
import { parseObjectId, serializePlumberDetail } from "@/lib/admin-serialize";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

type RouteContext = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const auth = await requireAdminPermission("plumbers.view");
  if (auth.error) return auth.error;

  const oid = parseObjectId(params.id);
  if (!oid) {
    return NextResponse.json({ error: "Invalid plumber id" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const doc = await db.collection("users").findOne({
      _id: oid,
      ...plumberBaseFilter(),
    });

    if (!doc) {
      const softDeleted = await db.collection("users").findOne({
        _id: oid,
        role: "plumber",
        deleted: true,
      });
      if (!softDeleted) {
        return NextResponse.json({ error: "Plumber not found" }, { status: 404 });
      }
      return NextResponse.json(
        { error: "Plumber has been deleted" },
        { status: 410 }
      );
    }

    const jobs = await db
      .collection("jobs")
      .find({
        $or: [{ plumberId: params.id }, { assignedPlumberId: params.id }],
        deleted: { $ne: true },
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(serializePlumberDetail(doc, jobs));
  } catch (err) {
    console.error("[admin/plumbers/[id] GET]", err);
    return NextResponse.json(
      { error: "Failed to load plumber" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const auth = await requireAdminPermission("plumbers.view");
  if (auth.error) return auth.error;

  const oid = parseObjectId(params.id);
  if (!oid) {
    return NextResponse.json({ error: "Invalid plumber id" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const allowed = [
    "verified",
    "status",
    "available",
    "adminNotes",
    "name",
    "city",
    "phone",
    "skills",
    "rating",
  ];
  const updates: Record<string, unknown> = { updatedAt: new Date() };

  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  if (body.verified === true) {
    updates.verifiedAt = new Date();
  }

  if (Object.keys(updates).length <= 1) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const result = await db.collection("users").updateOne(
      { _id: oid, role: "plumber", deleted: { $ne: true } },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Plumber not found" }, { status: 404 });
    }

    const doc = await db.collection("users").findOne({ _id: oid });
    const jobs = await db
      .collection("jobs")
      .find({ plumberId: params.id, deleted: { $ne: true } })
      .limit(50)
      .toArray();

    return NextResponse.json(serializePlumberDetail(doc!, jobs));
  } catch (err) {
    console.error("[admin/plumbers/[id] PATCH]", err);
    return NextResponse.json(
      { error: "Failed to update plumber" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const auth = await requireAdminPermission("plumbers.view");
  if (auth.error) return auth.error;

  const oid = parseObjectId(params.id);
  if (!oid) {
    return NextResponse.json({ error: "Invalid plumber id" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const now = new Date();
    const result = await db.collection("users").updateOne(
      { _id: oid, role: "plumber" },
      { $set: { deleted: true, deletedAt: now, updatedAt: now } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Plumber not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, deleted: true });
  } catch (err) {
    console.error("[admin/plumbers/[id] DELETE]", err);
    return NextResponse.json(
      { error: "Failed to delete plumber" },
      { status: 500 }
    );
  }
}
