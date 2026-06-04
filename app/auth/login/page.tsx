"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { OtpInput } from "@/components/auth/OtpInput";
import { OTP_INPUT_LENGTH } from "@/lib/otp-config";
import { useOtpTimer } from "@/hooks/useOtpTimer";
import {
  formatPhoneDisplay,
  maskPhone,
  normalizePhone,
} from "@/lib/phone";
import { Loader2, Phone } from "lucide-react";

type LoginTab = "plumber" | "customer";

function mapErrorMessage(error: string, attemptsLeft?: number): string {
  if (error.includes("60 seconds") || error.includes("wait")) {
    return "Thoda wait karo, 60 seconds baad try karo";
  }
  if (error.includes("expired") || error.includes("not found")) {
    return "OTP expire ho gaya, dobara bhejo";
  }
  if (error.includes("Too many") || attemptsLeft === 0) {
    return "Zyada galat OTP. Naya OTP maango";
  }
  if (error.includes("Invalid OTP") && attemptsLeft != null) {
    return `Galat OTP. ${attemptsLeft} attempt bachi`;
  }
  if (error.includes("Invalid OTP")) {
    return "Galat OTP. Dobara try karein";
  }
  return error;
}

export default function LoginPage() {
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState("/dashboard");
  const [tab, setTab] = useState<LoginTab>("plumber");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState(false);

  const normalizedPhone = normalizePhone(phone);
  const { canResend, startTimer, formatted } = useOtpTimer(
    otpSent ? normalizedPhone : undefined
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCallbackUrl(params.get("callbackUrl") || "/dashboard");
  }, []);

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    setPhone(formatPhoneDisplay(digits));
  };

  const sendOtp = async () => {
    setError("");
    setOtpError(false);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone, role: tab }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(mapErrorMessage(data.error || "OTP bhejne mein problem aayi"));
        return;
      }
      setOtpSent(true);
      startTimer();
    } catch {
      setError("Network error. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpComplete = async (otp: string) => {
    setError("");
    setOtpError(false);
    setLoading(true);

    try {
      const verifyRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizedPhone,
          otp,
          role: tab,
        }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        setOtpError(true);
        setError(
          mapErrorMessage(
            verifyData.error || "Galat OTP",
            verifyData.attemptsLeft
          )
        );
        return;
      }

      const result = await signIn("phone-otp", {
        phone: normalizedPhone,
        otp,
        role: tab,
        redirect: false,
      });

      if (result?.error) {
        setOtpError(true);
        setError("Login fail ho gaya. Dobara try karein.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Network error. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    await sendOtp();
  };

  const handleGoogle = () => {
    signIn("google", { callbackUrl });
  };

  const phoneValid = normalizedPhone.length === 10;

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-md mx-auto">
        <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white text-center">
            Login
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
            Apna number se OTP se login karein
          </p>

          <div className="mt-6 flex rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-1">
            <button
              type="button"
              onClick={() => {
                setTab("plumber");
                setOtpSent(false);
                setError("");
                setOtpError(false);
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                tab === "plumber"
                  ? "bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Plumber Login
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("customer");
                setOtpSent(false);
                setError("");
                setOtpError(false);
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                tab === "customer"
                  ? "bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Customer Login
            </button>
          </div>

          {error && !otpSent && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </p>
          )}

          {!otpSent ? (
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  Mobile number
                </label>
                <div className="relative mt-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    +91
                  </span>
                  <Phone className="w-4 h-4 text-gray-400 absolute left-12 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="Apna mobile number daalo"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 pl-[4.5rem] pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/40"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={sendOtp}
                disabled={loading || !phoneValid}
                className="w-full rounded-xl bg-[#F97316] hover:bg-[#ea580c] disabled:opacity-50 text-white font-semibold py-3 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                OTP Bhejo
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                OTP bheja gaya{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {maskPhone(normalizedPhone)}
                </span>{" "}
                par
              </p>

              <OtpInput
                key={`${normalizedPhone}-${otpError}`}
                length={OTP_INPUT_LENGTH}
                onComplete={handleOtpComplete}
                isLoading={loading}
                hasError={otpError}
                errorMessage={otpError ? error : undefined}
              />

              {error && !otpError && (
                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                  {error}
                </p>
              )}

              {loading && (
                <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verify ho raha hai…
                </p>
              )}

              <div className="text-center text-sm">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="text-[#F97316] font-semibold hover:underline disabled:opacity-50"
                  >
                    OTP dobara bhejo
                  </button>
                ) : (
                  <span className="text-gray-500">
                    Resend in {formatted}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setError("");
                  setOtpError(false);
                }}
                className="w-full text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Number change karein
              </button>
            </div>
          )}

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-gray-950 px-2 text-gray-500">
                ya
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="mt-4 w-full rounded-xl border border-gray-200 dark:border-gray-700 py-3 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:border-[#F97316] transition-colors"
          >
            Google se login karein
          </button>

          <div className="mt-6 flex flex-col items-center gap-2 text-sm">
            <Link
              href="/auth/register"
              className="text-[#F97316] font-semibold hover:underline"
            >
              Register karo
            </Link>
            <Link
              href="/support"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Help / Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
