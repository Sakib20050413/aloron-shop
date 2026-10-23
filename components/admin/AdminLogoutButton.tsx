"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function AdminLogoutButton() {
  return (
    <button
      type="button"
      onClick={() => void signOut({ callbackUrl: "/login" })}
      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-2 font-mono text-xs font-semibold text-neutral-800 transition hover:bg-neutral-50 active:scale-95 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
    >
      <LogOut size={14} className="text-rose-500" />
      <span>লগআউট</span>
    </button>
  );
}
