import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSiteSettings, saveSiteSettings } from "@/lib/site-settings";
import type { SiteSettingsPatch } from "@/types/site-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error("[admin/settings GET]", err);
    return NextResponse.json(
      { error: "Failed to load site settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = (await request.json()) as SiteSettingsPatch;
    const patch: SiteSettingsPatch = {};
    if (body.general !== undefined) patch.general = body.general;
    if (body.seo !== undefined) patch.seo = body.seo;
    if (body.homepage !== undefined) patch.homepage = body.homepage;
    if (body.notifications !== undefined) patch.notifications = body.notifications;
    if (body.payment !== undefined) patch.payment = body.payment;

    if (Object.keys(patch).length === 0) {
      return NextResponse.json(
        { error: "No valid settings provided" },
        { status: 400 }
      );
    }

    const updated = await saveSiteSettings(
      patch,
      auth.session?.user?.name ?? auth.session?.user?.email ?? "admin"
    );

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[admin/settings PATCH]", err);
    return NextResponse.json(
      { error: "Failed to save site settings" },
      { status: 500 }
    );
  }
}
