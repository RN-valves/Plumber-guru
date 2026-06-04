"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

type LogoutButtonProps = {
  className?: string;
  label?: string;
  showIcon?: boolean;
};

export function LogoutButton({
  className = "",
  label = "Logout",
  showIcon = true,
}: LogoutButtonProps) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={className}
    >
      {showIcon ? <LogOut className="w-4 h-4 shrink-0" /> : null}
      {label}
    </button>
  );
}
