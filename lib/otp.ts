import { getDb } from "@/lib/mongodb";

export type OtpProfile = {
  name?: string;
  city?: string;
  skills?: string[];
  language?: string;
  role?: "plumber" | "customer";
};

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 10) return digits;
  return digits;
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeOtp(
  phone: string,
  otp: string,
  profile?: OtpProfile,
): Promise<void> {
  const db = await getDb();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await db.collection("otp_codes").updateOne(
    { phone },
    {
      $set: {
        phone,
        otp,
        expiresAt,
        profile: profile ?? null,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );
}

export async function verifyOtp(
  phone: string,
  otp: string,
): Promise<{ valid: boolean; profile?: OtpProfile | null }> {
  const db = await getDb();
  const record = await db.collection("otp_codes").findOne({ phone });

  if (!record) return { valid: false };

  const expired = new Date(record.expiresAt) < new Date();
  if (expired || record.otp !== otp) return { valid: false };

  await db.collection("otp_codes").deleteOne({ phone });

  return {
    valid: true,
    profile: (record.profile as OtpProfile | null) ?? null,
  };
}

export async function sendOtpViaFast2Sms(
  phone: string,
  otp: string,
): Promise<{ ok: boolean; error?: string }> {
  const apiKey =
    process.env.FAST2SMS_API_KEY || process.env.NEXT_PUBLIC_FAST2SMS_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] OTP for ${phone}: ${otp}`);
      return { ok: true };
    }
    return { ok: false, error: "SMS API key not configured" };
  }

  try {
    const params = new URLSearchParams({
      route: "otp",
      variables_values: otp,
      numbers: phone,
    });

    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = (await res.json()) as { return?: boolean; message?: string };

    if (!res.ok || data.return === false) {
      return { ok: false, error: data.message || "Failed to send SMS" };
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "SMS send failed",
    };
  }
}
