import { NextResponse } from "next/server";
import { sendOtpToPhone } from "@/lib/otp-service";
import type { OtpProfileMeta } from "@/models/OTP";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      phone?: string;
      role?: "plumber" | "customer";
      profile?: OtpProfileMeta;
    };

    if (!body.phone) {
      return NextResponse.json(
        { success: false, error: "Phone number required" },
        { status: 400 }
      );
    }

    const profile: OtpProfileMeta | undefined = body.profile
      ? { ...body.profile, role: body.profile.role || body.role }
      : body.role
        ? { role: body.role }
        : undefined;

    const result = await sendOtpToPhone(body.phone, profile);

    if (!result.success) {
      const status =
        result.error === "Please wait 60 seconds" ? 429 : 500;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[send-otp]", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}
