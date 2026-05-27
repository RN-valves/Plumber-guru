"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { OtpInput } from "@/components/auth/OtpInput";
import { Phone, Loader2 } from "lucide-react";

type LoginTab = "plumber" | "customer";

export default function LoginPage() {
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState("/dashboard");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCallbackUrl(params.get("callbackUrl") || "/dashboard");
  }, []);

  const [tab, setTab] = useState<LoginTab>("plumber");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const sendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, role: tab }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "OTP bhejne mein problem aayi");
        if (data.devOtp) setDevOtp(data.devOtp);
        return;
      }
      setOtpSent(true);
      if (data.devOtp) setDevOtp(data.devOtp);
    } catch {
      setError("Network error. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signIn("phone-otp", {
        phone,
        otp,
        role: tab,
        redirect: false,
      });

      if (result?.error) {
        setError("Galat OTP ya expire ho gaya. Dobara try karein.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Login fail ho gaya. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50 dark:bg-gray-900 py-10">
      <div className="container-pg max-w-md mx-auto">
        <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white text-center">
            Login
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
            Apna number se OTP se login karein
          </p>

          {/* Tabs */}
          <div className="mt-6 flex rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-1">
            <button
              type="button"
              onClick={() => {
                setTab("plumber");
                setOtpSent(false);
                setOtp("");
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
                setOtp("");
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

          {error && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </p>
          )}

          {devOtp && (
            <p className="mt-3 text-xs text-center text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2">
              Dev OTP: <strong>{devOtp}</strong>
            </p>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                Phone number
              </label>
              <div className="relative mt-1">
                <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Apna number daalo"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  disabled={otpSent && loading}
                />
              </div>
            </div>

            {otpSent && (
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-200 block text-center mb-3">
                  6 digit OTP daalo
                </label>
                <OtpInput value={otp} onChange={setOtp} disabled={loading} />
              </div>
            )}

            {!otpSent ? (
              <button
                type="button"
                onClick={sendOtp}
                disabled={loading || phone.replace(/\D/g, "").length < 10}
                className="w-full rounded-xl bg-[#F97316] hover:bg-[#ea580c] disabled:opacity-50 text-white font-semibold py-3 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                OTP bhejo
              </button>
            ) : (
              <button
                type="button"
                onClick={verifyAndLogin}
                disabled={loading || otp.length !== 6}
                className="w-full rounded-xl bg-[#F97316] hover:bg-[#ea580c] disabled:opacity-50 text-white font-semibold py-3 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Login karo
              </button>
            )}

            {otpSent && (
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  sendOtp();
                }}
                className="w-full text-sm text-[#F97316] font-semibold hover:underline"
              >
                OTP dubara bhejo
              </button>
            )}
          </div>

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
              Password bhool gaye? / Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
