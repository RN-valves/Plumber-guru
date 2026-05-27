import { NextResponse } from "next/server";
import {
  generateOtp,
  normalizePhone,
  sendOtpViaFast2Sms,
  storeOtp,
  type OtpProfile,
} from "@/lib/otp";

/**
 * Environment variables (.env.local):
 *
 * MONGODB_URI=mongodb+srv://...
 * MONGODB_DB_NAME=plumber-guru
 * NEXTAUTH_SECRET=your-random-secret
 * GOOGLE_CLIENT_ID=...
 * GOOGLE_CLIENT_SECRET=...
 *
 * Fast2SMS (server-side recommended):
 * FAST2SMS_API_KEY=your_fast2sms_api_key
 *
 * Note: User requested NEXT_PUBLIC_FAST2SMS_KEY — prefer FAST2SMS_API_KEY
 * on the server only. NEXT_PUBLIC_* exposes keys to the browser.
 * sendOtpViaFast2Sms falls back to NEXT_PUBLIC_FAST2SMS_KEY if set.
 */

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      phone?: string;
      role?: "plumber" | "customer";
      profile?: OtpProfile;
    };

    if (!body.phone) {
      return NextResponse.json(
        { success: false, error: "Phone number required" },
        { status: 400 },
      );
    }

    const phone = normalizePhone(body.phone);
    if (phone.length !== 10) {
      return NextResponse.json(
        { success: false, error: "Valid 10-digit phone number required" },
        { status: 400 },
      );
    }

    const otp = generateOtp();
    const profile: OtpProfile = {
      ...body.profile,
      role: body.role || body.profile?.role,
    };

    await storeOtp(phone, otp, profile);

    const sms = await sendOtpViaFast2Sms(phone, otp);

    if (!sms.ok) {
      return NextResponse.json(
        {
          success: false,
          error: sms.error || "Failed to send OTP",
          ...(process.env.NODE_ENV === "development" ? { devOtp: otp } : {}),
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP bhej diya gaya hai",
      ...(process.env.NODE_ENV === "development" ? { devOtp: otp } : {}),
    });
  } catch (err) {
    console.error("send-otp error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 },
    );
  }
}
