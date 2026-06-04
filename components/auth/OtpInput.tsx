"use client";

import { useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { cn } from "@/lib/utils";

type OtpInputProps = {
  onComplete: (otp: string) => void;
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  length?: number;
};

export function OtpInput({
  onComplete,
  isLoading = false,
  hasError = false,
  errorMessage,
  length = 6,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const valuesRef = useRef<string[]>(Array(length).fill(""));

  const focusInput = (index: number) => {
    inputsRef.current[index]?.focus();
  };

  const tryComplete = (digits: string[]) => {
    const otp = digits.join("");
    if (otp.length === length && new RegExp(`^\\d{${length}}$`).test(otp)) {
      onComplete(otp);
    }
  };

  const setDigit = (index: number, char: string) => {
    const next = [...valuesRef.current];
    next[index] = char;
    valuesRef.current = next;
    const el = inputsRef.current[index];
    if (el) el.value = char;
    tryComplete(next);
  };

  const handleChange = (index: number, raw: string) => {
    const char = raw.replace(/\D/g, "").slice(-1);
    if (!char) {
      setDigit(index, "");
      return;
    }
    setDigit(index, char);
    if (index < length - 1) focusInput(index + 1);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!valuesRef.current[index] && index > 0) {
        focusInput(index - 1);
      } else {
        setDigit(index, "");
      }
    }
    if (e.key === "ArrowLeft" && index > 0) focusInput(index - 1);
    if (e.key === "ArrowRight" && index < length - 1) focusInput(index + 1);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    const next = Array(length).fill("");
    pasted.split("").forEach((c, i) => {
      next[i] = c;
    });
    valuesRef.current = next;
    next.forEach((c, i) => {
      const el = inputsRef.current[i];
      if (el) el.value = c;
    });
    focusInput(Math.min(pasted.length, length - 1));
    tryComplete(next);
  };

  useEffect(() => {
    if (!hasError) return;
    valuesRef.current = Array(length).fill("");
    inputsRef.current.forEach((el) => {
      if (el) el.value = "";
    });
    focusInput(0);
  }, [hasError, length]);

  useEffect(() => {
    focusInput(0);
  }, []);

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex gap-2 sm:gap-3 justify-center",
          hasError && "animate-shake"
        )}
      >
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            disabled={isLoading}
            defaultValue=""
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className={cn(
              "w-11 h-12 sm:w-12 sm:h-14 text-center text-lg font-bold rounded-xl border bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50 transition-colors",
              hasError
                ? "border-red-500 ring-red-200"
                : "border-gray-200 dark:border-gray-700"
            )}
            aria-label={`OTP digit ${i + 1}`}
          />
        ))}
      </div>
      {errorMessage && (
        <p className="text-center text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
