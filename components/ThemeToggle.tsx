"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle({ mobile = false }: { mobile?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="থিম পরিবর্তন করুন (Light / Dark Mode)"
      title="থিম পরিবর্তন করুন (Light / Dark Mode)"
      className={
        mobile
          ? "flex min-h-11 w-full items-center justify-between rounded-xl bg-neutral-100 dark:bg-neutral-900 p-1.5 text-sm font-bold text-neutral-900 dark:text-neutral-100 transition-colors"
          : "inline-flex h-10 items-center gap-1 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900/80 p-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300 transition-colors"
      }
    >
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all duration-200 ${
          theme === "light"
            ? "bg-white text-neutral-950 font-bold shadow-sm"
            : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
        }`}
      >
        <Sun size={13} aria-hidden="true" /> দিন
      </span>
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all duration-200 ${
          theme === "dark"
            ? "bg-neutral-800 text-white font-bold shadow-sm"
            : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
        }`}
      >
        <Moon size={13} aria-hidden="true" /> রাত
      </span>
    </button>
  );
}
