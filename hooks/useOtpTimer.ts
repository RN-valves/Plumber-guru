"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "pg_otp_resend_until";
const COOLDOWN_SECONDS = 60;

export function useOtpTimer(phone?: string) {
  const storageKey = phone
    ? `${STORAGE_KEY}_${phone.replace(/\D/g, "").slice(-10)}`
    : STORAGE_KEY;

  const [seconds, setSeconds] = useState(0);

  const syncFromStorage = useCallback(() => {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) {
      setSeconds(0);
      return;
    }
    const end = parseInt(raw, 10);
    const remaining = Math.ceil((end - Date.now()) / 1000);
    setSeconds(remaining > 0 ? remaining : 0);
  }, [storageKey]);

  useEffect(() => {
    syncFromStorage();
    const id = setInterval(syncFromStorage, 1000);
    return () => clearInterval(id);
  }, [syncFromStorage]);

  const startTimer = useCallback(() => {
    const end = Date.now() + COOLDOWN_SECONDS * 1000;
    sessionStorage.setItem(storageKey, String(end));
    setSeconds(COOLDOWN_SECONDS);
  }, [storageKey]);

  const canResend = seconds <= 0;

  const formatted = `${Math.floor(seconds / 60)}:${(seconds % 60)
    .toString()
    .padStart(2, "0")}`;

  return { seconds, canResend, startTimer, formatted, COOLDOWN_SECONDS };
}
