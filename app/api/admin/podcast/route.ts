import { NextRequest, NextResponse } from "next/server";
import { requireAdminPermission } from "@/lib/admin-auth";
import { formatDate } from "@/lib/admin-serialize";
import { getDb } from "@/lib/mongodb";
import type { Document } from "mongodb";
import type { PodcastEpisode, PodcastListResponse } from "@/types/admin-api";

export const dynamic = "force-dynamic";

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

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission("content.podcast");
  if (auth.error) return auth.error;

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
  );

  try {
    const db = await getDb();
    const collection = db.collection("podcast_episodes");
    const skip = (page - 1) * limit;

    const [docs, totalCount] = await Promise.all([
      collection
        .find({ deleted: { $ne: true } })
        .sort({ episodeNumber: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments({ deleted: { $ne: true } }),
    ]);

    const body: PodcastListResponse = {
      episodes: docs.map(serializeEpisode),
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      page,
      limit,
    };

    return NextResponse.json(body);
  } catch (err) {
    console.error("[admin/podcast GET]", err);
    return NextResponse.json(
      { error: "Failed to load episodes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminPermission("content.podcast");
  if (auth.error) return auth.error;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.title || typeof body.title !== "string") {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const now = new Date();
    const doc = {
      title: body.title,
      episodeNumber: Number(body.episodeNumber) || 1,
      description: (body.description as string) || "",
      guest: (body.guest as string) || null,
      duration: (body.duration as string) || "0:00",
      plays: 0,
      publishedDate:
        body.status === "published" ? now : body.publishedDate || null,
      status: (body.status as string) || "draft",
      featured: Boolean(body.featured),
      language: (body.language as string) || "Hindi",
      audioUrl: (body.audioUrl as string) || null,
      coverUrl: (body.coverUrl as string) || null,
      createdAt: now,
      updatedAt: now,
      deleted: false,
    };

    const result = await db.collection("podcast_episodes").insertOne(doc);
    const inserted = await db
      .collection("podcast_episodes")
      .findOne({ _id: result.insertedId });

    return NextResponse.json(serializeEpisode(inserted!), { status: 201 });
  } catch (err) {
    console.error("[admin/podcast POST]", err);
    return NextResponse.json(
      { error: "Failed to create episode" },
      { status: 500 }
    );
  }
}
