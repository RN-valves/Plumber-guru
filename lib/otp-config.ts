import { randomInt } from "crypto";

/** OTP length — must match MSG91 template setting (OTP → Templates). */
export function getOtpLength(): number {
  const raw =
    process.env.MSG91_OTP_LENGTH?.trim() ||
    process.env.NEXT_PUBLIC_OTP_LENGTH?.trim();
  const n = raw ? parseInt(raw, 10) : 6;
  if (Number.isNaN(n) || n < 4 || n > 9) return 6;
  return n;
}

/** For client components (login/register). */
export const OTP_INPUT_LENGTH = getOtpLength();

export function generateOtpCode(): string {
  const len = getOtpLength();
  const min = 10 ** (len - 1);
  const max = 10 ** len;
  return randomInt(min, max).toString();
}

export function otpDigitRegex(): RegExp {
  const len = getOtpLength();
  return new RegExp(`^\\d{${len}}$`);
}
