import { NextResponse } from "next/server";
import { verifyPhoneOtp } from "@/lib/otp-service";
import type { UserRole } from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      phone?: string;
      otp?: string;
      role?: UserRole;
    };

    if (!body.phone || !body.otp) {
      return NextResponse.json(
        { success: false, error: "Phone and OTP are required" },
        { status: 400 }
      );
    }

    const result = await verifyPhoneOtp(
      body.phone,
      body.otp,
      body.role || "plumber"
    );

    if (!result.success) {
      const status =
        result.error === "Too many attempts. Request new OTP" ? 429 : 400;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json({
      success: true,
      userId: result.userId,
      isNewUser: result.isNewUser,
    });
  } catch (err) {
    console.error("[verify-otp]", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}
