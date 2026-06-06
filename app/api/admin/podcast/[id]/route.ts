import { NextRequest, NextResponse } from "next/server";
import { requireAdminPermission } from "@/lib/admin-auth";
import { parseObjectId, formatDate } from "@/lib/admin-serialize";
import { getDb } from "@/lib/mongodb";
import type { Document } from "mongodb";
import type { PodcastEpisode } from "@/types/admin-api";

export const dynamic = "force-dynamic";

type RouteContext = { params: { id: string } };

function serializeEpisode(doc: Document): PodcastEpisode {
  return {
    id: doc._id.toString(),
    episodeNumber: (doc.episodeNumber as number) || 0,
    title: (doc.title as string) || "",
    description: (doc.description as string) || "",
    guest: (doc.guest as string) || null,
    duration: (doc.duration as string) || "0:00",
    plays: typeof doc.plays === "number" ? doc.plays : 0,
    publishedDate: formatDate(
      (doc.publishedDate as Date) || (doc.createdAt as Date)
    ),
    status: (doc.status as PodcastEpisode["status"]) || "draft",
    featured: Boolean(doc.featured),
    language: (doc.language as string) || "Hindi",
    audioUrl: (doc.audioUrl as string) || null,
    coverUrl: (doc.coverUrl as string) || null,
    createdAt: formatDate(doc.createdAt as Date),
  };
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const auth = await requireAdminPermission("content.podcast");
  if (auth.error) return auth.error;

  const oid = parseObjectId(params.id);
  if (!oid) {
    return NextResponse.json({ error: "Invalid episode id" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const allowed = [
    "title",
    "episodeNumber",
    "description",
    "guest",
    "duration",
    "status",
    "featured",
    "language",
    "audioUrl",
    "coverUrl",
    "publishedDate",
    "plays",
  ];
  const updates: Record<string, unknown> = { updatedAt: new Date() };

  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  if (body.status === "published" && !body.publishedDate) {
    updates.publishedDate = new Date();
  }

  try {
    const db = await getDb();
    const result = await db.collection("podcast_episodes").updateOne(
      { _id: oid, deleted: { $ne: true } },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }

    const doc = await db.collection("podcast_episodes").findOne({ _id: oid });
    return NextResponse.json(serializeEpisode(doc!));
  } catch (err) {
    console.error("[admin/podcast/[id] PATCH]", err);
    return NextResponse.json(
      { error: "Failed to update episode" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const auth = await requireAdminPermission("content.podcast");
  if (auth.error) return auth.error;

  const oid = parseObjectId(params.id);
  if (!oid) {
    return NextResponse.json({ error: "Invalid episode id" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const now = new Date();
    const result = await db.collection("podcast_episodes").updateOne(
      { _id: oid },
      { $set: { deleted: true, deletedAt: now, updatedAt: now } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, deleted: true });
  } catch (err) {
    console.error("[admin/podcast/[id] DELETE]", err);
    return NextResponse.json(
      { error: "Failed to delete episode" },
      { status: 500 }
    );
  }
}
