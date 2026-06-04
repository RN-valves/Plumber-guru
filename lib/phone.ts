/** Normalize to 10-digit Indian mobile (no country code). */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
}

/** Validate 10-digit Indian mobile starting with 6–9. */
export function validateIndianPhone(phone: string): {
  valid: boolean;
  normalized: string;
  error?: string;
} {
  const normalized = normalizePhone(phone);
  if (normalized.length !== 10) {
    return {
      valid: false,
      normalized,
      error: "Valid 10-digit mobile number required",
    };
  }
  if (!/^[6-9]\d{9}$/.test(normalized)) {
    return {
      valid: false,
      normalized,
      error: "Valid Indian mobile number required",
    };
  }
  return { valid: true, normalized };
}

/** Display format: 98765 43210 */
export function formatPhoneDisplay(phone: string): string {
  const digits = normalizePhone(phone).slice(0, 10);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

/** Mask for UI: 98765XXXXX */
export function maskPhone(phone: string): string {
  const digits = normalizePhone(phone);
  if (digits.length < 5) return digits;
  return `${digits.slice(0, 5)}${"X".repeat(Math.min(5, digits.length - 5))}`;
}

/** MSG91 mobile param: 919876543210 */
export function toMsg91Mobile(phone: string): string {
  return `91${normalizePhone(phone)}`;
}
