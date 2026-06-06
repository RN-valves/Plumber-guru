"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";

const LOGIN_SUCCESS_KEY = "pg-login-success";

export function markLoginSuccess() {
  sessionStorage.setItem(LOGIN_SUCCESS_KEY, "1");
}

export function appendLoginSuccessParam(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}login=success`;
}

function hasLoginSuccessSignal(searchParams: URLSearchParams): boolean {
  if (typeof window === "undefined") return false;
  if (sessionStorage.getItem(LOGIN_SUCCESS_KEY) === "1") return true;
  return searchParams.get("login") === "success";
}

export function LoginSuccessBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const clearLoginSuccess = useCallback(() => {
    sessionStorage.removeItem(LOGIN_SUCCESS_KEY);

    if (searchParams.get("login") !== "success") return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("login");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (hasLoginSuccessSignal(searchParams)) {
      setVisible(true);
    }
  }, [searchParams, pathname]);

  useEffect(() => {
    if (!visible) return;

    const timer = window.setTimeout(() => {
      setVisible(false);
      clearLoginSuccess();
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [visible, clearLoginSuccess]);

  const dismiss = () => {
    setVisible(false);
    clearLoginSuccess();
  };

  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed left-1/2 top-20 z-[100] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 shadow-lg dark:border-green-900/50 dark:bg-green-950 dark:shadow-black/40"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-medium text-green-800 dark:text-green-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          Login successful! Welcome back.
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-lg p-1 text-green-700 transition-colors hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-900/50"
          aria-label="Dismiss login success message"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
