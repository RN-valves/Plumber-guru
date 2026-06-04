"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { OtpInput } from "@/components/auth/OtpInput";
import { OTP_INPUT_LENGTH } from "@/lib/otp-config";
import { Loader2, Phone } from "lucide-react";

type RegisterTab = "plumber" | "customer";

const SKILL_OPTIONS = [
  "Pipe fitting",
  "Leak repair",
  "Bathroom fitting",
  "Bore well pump",
  "Valve repair",
  "Water heater",
  "Electrical basics",
];

const LANGUAGES = [
  { code: "hi", label: "हिंदी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "mr", label: "मराठी" },
  { code: "bn", label: "বাংলা" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [tab, setTab] = useState<RegisterTab>("plumber");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [language, setLanguage] = useState("hi");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState(false);

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const sendOtp = async () => {
    if (!acceptedTerms) {
      setError("Pehle Terms & Conditions accept karein.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const profile =
        tab === "plumber"
          ? { name, city, skills, language, role: "plumber" as const }
          : { name, city, role: "customer" as const };

      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, role: tab, profile }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(
          data.error?.includes("60 seconds")
            ? "Thoda wait karo, 60 seconds baad try karo"
            : data.error || "OTP bhejne mein problem aayi"
        );
        return;
      }
      setOtpSent(true);
    } catch {
      setError("Network error. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndRegister = async (otp: string) => {
    setError("");
    setOtpError(false);
    setLoading(true);
    try {
      const result = await signIn("phone-otp", {
        phone,
        otp,
        role: tab,
        redirect: false,
      });

      if (result?.error) {
        setOtpError(true);
        setError("Galat OTP. Dobara try karein.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Registration fail ho gayi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50 dark:bg-gray-900 py-10">
      <div className="container-pg max-w-lg mx-auto">
        <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white text-center">
            Register
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
            Naya account banayein — OTP se verify hoga
          </p>

          <div className="mt-6 flex rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-1">
            <button
              type="button"
              onClick={() => {
                setTab("plumber");
                setOtpSent(false);
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                tab === "plumber"
                  ? "bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Main Plumber hoon
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("customer");
                setOtpSent(false);
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                tab === "customer"
                  ? "bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Mujhe Plumber chahiye
            </button>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </p>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                Naam
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="Apna naam"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                Phone
              </label>
              <div className="relative mt-1">
                <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Apna number daalo"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                City
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="e.g. Delhi, Mumbai"
              />
            </div>

            {tab === "plumber" && (
              <>
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    Skills
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {SKILL_OPTIONS.map((skill) => (
                      <label
                        key={skill}
                        className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 cursor-pointer hover:border-orange-300"
                      >
                        <input
                          type="checkbox"
                          checked={skills.includes(skill)}
                          onChange={() => toggleSkill(skill)}
                          className="accent-[#F97316]"
                        />
                        {skill}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    Preferred Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <label className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 accent-[#F97316]"
              />
              <span>
                Main <strong>Terms &amp; Conditions</strong> aur{" "}
                <strong>Privacy Policy</strong> se agree karta/karti hoon. (
                नियम और शर्तें स्वीकार हैं)
              </span>
            </label>

            {otpSent && (
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-200 block text-center mb-3">
                  OTP verify karein
                </label>
                <OtpInput
                  key={String(otpError)}
                  length={OTP_INPUT_LENGTH}
                  onComplete={verifyAndRegister}
                  isLoading={loading}
                  hasError={otpError}
                  errorMessage={otpError ? error : undefined}
                />
              </div>
            )}

            {!otpSent && (
              <button
                type="button"
                onClick={sendOtp}
                disabled={
                  loading ||
                  !name ||
                  phone.replace(/\D/g, "").length < 10 ||
                  !city ||
                  !acceptedTerms
                }
                className="w-full rounded-xl bg-[#F97316] hover:bg-[#ea580c] disabled:opacity-50 text-white font-semibold py-3 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                OTP bhejo
              </button>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Pehle se account hai?{" "}
            <Link href="/auth/login" className="text-[#F97316] font-semibold hover:underline">
              Login karo
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
