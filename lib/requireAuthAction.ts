"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

function buildCallbackUrl(pathname: string, query: string): string {
  if (!query) return pathname;
  return `${pathname}?${query}`;
}

export function useRequireAuthAction() {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (onAuthenticated: () => void) => {
    if (status === "authenticated") {
      onAuthenticated();
      return true;
    }

    if (status === "loading") {
      return false;
    }

    const callbackUrl = buildCallbackUrl(pathname, searchParams.toString());
    router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    return false;
  };
}
