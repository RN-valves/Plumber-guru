import bcrypt from "bcryptjs";
import { generateOtpCode, getOtpLength, otpDigitRegex } from "@/lib/otp-config";
import { connectDB } from "@/lib/mongoose";
import { sendOtpViaMsg91 } from "@/lib/msg91";
import { validateIndianPhone } from "@/lib/phone";
import OTP, { type OtpProfileMeta } from "@/models/OTP";
import User, { type UserRole } from "@/models/User";

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 3;
const BCRYPT_ROUNDS = 10;

export type SendOtpResult =
  | { success: true; expiresIn: number }
  | { success: false; error: string };

export type VerifyOtpResult =
  | {
    success: true;
    userId: string;
    isNewUser: boolean;
    role: UserRole;
    name?: string;
    phone: string;
  }
  | {
    success: false;
    error: string;
    attemptsLeft?: number;
  };

function calcProfileComplete(user: {
  name?: string;
  phone?: string;
  city?: string;
  skills?: string[];
  role?: string;
}): number {
  if (user.role === "customer") {
    let score = 0;
    if (user.name) score += 34;
    if (user.phone) score += 33;
    if (user.city) score += 33;
    return score;
  }
  let score = 0;
  if (user.name) score += 20;
  if (user.phone) score += 20;
  if (user.city) score += 20;
  if (user.skills?.length) score += 20;
  score += 20;
  return Math.min(100, score);
}

export async function sendOtpToPhone(
  phone: string,
  profile?: OtpProfileMeta
): Promise<SendOtpResult> {
  const validation = validateIndianPhone(phone);
  if (!validation.valid) {
    return { success: false, error: validation.error || "Invalid phone number" };
  }

  const normalized = validation.normalized;

  await connectDB();

  const recent = await OTP.findOne({
    phone: normalized,
    createdAt: { $gte: new Date(Date.now() - RESEND_COOLDOWN_MS) },
  })
    .sort({ createdAt: -1 })
    .lean();

  if (recent) {
    return {
      success: false,
      error: "Please wait 60 seconds",
    };
  }

  const plainOtp = generateOtpCode();
  const hashedOtp = await bcrypt.hash(plainOtp, BCRYPT_ROUNDS);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

  const doc = await OTP.create({
    phone: normalized,
    otp: hashedOtp,
    expiresAt,
    verified: false,
    attempts: 0,
    profile: profile ?? null,
    createdAt: new Date(),
  });

  const sms = await sendOtpViaMsg91(normalized, plainOtp);

  if (!sms.ok) {
    await OTP.deleteOne({ _id: doc._id });
    return {
      success: false,
      error: sms.error || "Failed to send OTP",
    };
  }

  return { success: true, expiresIn: 600 };
}

export async function verifyPhoneOtp(
  phone: string,
  otpInput: string,
  fallbackRole: UserRole = "plumber"
): Promise<VerifyOtpResult> {
  const validation = validateIndianPhone(phone);
  if (!validation.valid) {
    return { success: false, error: validation.error || "Invalid phone number" };
  }

  const normalized = validation.normalized;
  const otp = otpInput.trim();

  if (!otpDigitRegex().test(otp)) {
    return {
      success: false,
      error: `Invalid OTP (${getOtpLength()} digits required)`,
    };
  }

  await connectDB();

  const now = new Date();

  const record = await OTP.findOne({
    phone: normalized,
    expiresAt: { $gt: now },
    verified: false,
  }).sort({ createdAt: -1 });

  if (!record) {
    return {
      success: false,
      error: "OTP expired or not found",
    };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return {
      success: false,
      error: "Too many attempts. Request new OTP",
      attemptsLeft: 0,
    };
  }

  const match = await bcrypt.compare(otp, record.otp);

  if (!match) {
    const attempts = record.attempts + 1;
    record.attempts = attempts;
    await record.save();

    if (attempts >= MAX_ATTEMPTS) {
      return {
        success: false,
        error: "Too many attempts. Request new OTP",
        attemptsLeft: 0,
      };
    }

    return {
      success: false,
      error: "Invalid OTP",
      attemptsLeft: MAX_ATTEMPTS - attempts,
    };
  }

  record.verified = true;
  await record.save();

  const profile = (record.profile as OtpProfileMeta | null) ?? null;
  const role = (profile?.role || fallbackRole) as UserRole;

  let user = await User.findOne({ phone: normalized });
  let isNewUser = false;

  if (user) {
    user.lastLogin = now;
    if (profile?.name) user.name = profile.name;
    if (profile?.city) user.city = profile.city;
    if (profile?.skills?.length) user.skills = profile.skills;
    if (profile?.language) user.language = profile.language;
    await user.save();
  } else {
    isNewUser = true;
    const userData = {
      phone: normalized,
      name: profile?.name || "Plumber Guru User",
      email: `${normalized}@plumber-guru.local`,
      role,
      city: profile?.city || "",
      skills: profile?.skills || [],
      language: profile?.language || "hi",
      isProfileComplete: false,
      lastLogin: now,
      createdAt: now,
      isActive: true,
      verified: false,
    };
    const profileComplete = calcProfileComplete({
      ...userData,
      phone: normalized,
    });
    user = await User.create({
      ...userData,
      profileComplete,
      isProfileComplete: profileComplete >= 80,
    });
  }

  return {
    success: true,
    userId: user._id.toString(),
    isNewUser,
    role: user.role,
    name: user.name,
    phone: normalized,
  };
}

/** Allow sign-in shortly after API verify (OTP already marked verified). */
export async function verifyPhoneOtpForSession(
  phone: string,
  otpInput: string,
  fallbackRole: UserRole = "plumber"
): Promise<VerifyOtpResult> {
  const validation = validateIndianPhone(phone);
  if (!validation.valid) {
    return { success: false, error: validation.error || "Invalid phone number" };
  }

  const normalized = validation.normalized;
  const otp = otpInput.trim();

  await connectDB();
  const now = new Date();

  const verifiedRecord = await OTP.findOne({
    phone: normalized,
    expiresAt: { $gt: now },
    verified: true,
  }).sort({ createdAt: -1 });

  if (verifiedRecord) {
    const match = await bcrypt.compare(otp, verifiedRecord.otp);
    if (match) {
      const user = await User.findOne({ phone: normalized });
      if (user) {
        return {
          success: true,
          userId: user._id.toString(),
          isNewUser: false,
          role: user.role,
          name: user.name,
          phone: normalized,
        };
      }
    }
  }

  return verifyPhoneOtp(phone, otp, fallbackRole);
}
