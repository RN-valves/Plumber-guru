import { getOtpLength } from "@/lib/otp-config";
import { toMsg91Mobile } from "@/lib/phone";

type Msg91LegacyResponse = {
  type?: string;
  message?: string;
  request_id?: string;
};

type Msg91V5Response = {
  type?: string;
  message?: string;
  request_id?: string;
};

function getMsg91Config() {
  const authKey = process.env.MSG91_AUTH_KEY?.trim();
  const templateId = process.env.MSG91_OTP_TEMPLATE_ID?.trim();
  const senderId = process.env.MSG91_SENDER_ID?.trim();
  const useV5 =
    process.env.MSG91_USE_V5?.trim().toLowerCase() !== "false";
  return { authKey, templateId, senderId, useV5 };
}

function isDevConsoleOnly(): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  const flag = process.env.OTP_DEV_CONSOLE?.trim().toLowerCase();
  if (flag === "true" || flag === "1") return true;
  const { authKey, templateId } = getMsg91Config();
  return !authKey || !templateId;
}

async function sendViaV5(
  authKey: string,
  templateId: string,
  mobile: string,
  otp: string
): Promise<{ ok: boolean; error?: string; requestId?: string }> {
  const otpLength = getOtpLength();
  const params = new URLSearchParams({
    mobile,
    template_id: templateId,
    otp,
    otp_length: String(otpLength),
    otp_expiry: "10",
  });

  const url = `https://control.msg91.com/api/v5/otp?${params.toString()}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      authkey: authKey,
      "Content-Type": "application/json",
    },
  });

  const text = await res.text();
  let data: Msg91V5Response = {};
  try {
    data = JSON.parse(text) as Msg91V5Response;
  } catch {
    return { ok: false, error: text || `MSG91 v5 error (${res.status})` };
  }

  if (data.type === "error") {
    return { ok: false, error: data.message || "MSG91 failed to send OTP" };
  }

  if (data.type !== "success") {
    return {
      ok: false,
      error: data.message || "Unexpected MSG91 v5 response",
    };
  }

  return { ok: true, requestId: data.request_id };
}

async function sendViaLegacy(
  authKey: string,
  templateId: string,
  senderId: string,
  mobile: string,
  otp: string
): Promise<{ ok: boolean; error?: string }> {
  const otpLength = getOtpLength();
  const params = new URLSearchParams({
    authkey: authKey,
    mobile,
    otp,
    otp_length: String(otpLength),
    otp_expiry: "10",
    sender: senderId || "SMSIND",
    template_id: templateId,
  });

  const url = `https://control.msg91.com/api/sendotp.php?${params.toString()}`;
  const res = await fetch(url, { method: "GET" });
  const text = await res.text();

  let data: Msg91LegacyResponse = {};
  try {
    data = JSON.parse(text) as Msg91LegacyResponse;
  } catch {
    return { ok: false, error: text || `MSG91 error (${res.status})` };
  }

  if (!res.ok) {
    return { ok: false, error: data.message || `MSG91 error (${res.status})` };
  }

  if (data.type === "error") {
    return { ok: false, error: data.message || "MSG91 failed to send OTP" };
  }

  if (data.type !== "success") {
    return { ok: false, error: data.message || "Unexpected MSG91 response" };
  }

  return { ok: true };
}

/**
 * Sends OTP via MSG91 (v5 OTP API by default — use with "OTP" app + DLT-verified template).
 */
export async function sendOtpViaMsg91(
  phone: string,
  otp: string
): Promise<{ ok: boolean; error?: string }> {
  const { authKey, templateId, senderId, useV5 } = getMsg91Config();

  if (process.env.NODE_ENV === "development") {
    console.log(`[DEV] OTP for ${phone}: ${otp} (length ${getOtpLength()})`);
  }

  if (isDevConsoleOnly()) {
    return { ok: true };
  }

  if (!authKey || !templateId) {
    return { ok: false, error: "MSG91 is not configured" };
  }

  const mobile = toMsg91Mobile(phone);

  try {
    const result = useV5
      ? await sendViaV5(authKey, templateId, mobile, otp)
      : await sendViaLegacy(authKey, templateId, senderId || "", mobile, otp);

    if (process.env.NODE_ENV === "development" && result.ok) {
      const reqId =
        "requestId" in result && result.requestId
          ? result.requestId
          : "ok";
      console.log(`[DEV] MSG91 accepted OTP request (${reqId})`);
    }

    return result;
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "MSG91 request failed",
    };
  }
}
