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
      className={mobile
        ? "flex min-h-11 w-full items-center justify-between rounded-xl bg-white/10 p-1 text-sm font-bold text-white transition-colors duration-200 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-cyan-400"
        : "inline-flex h-10 items-center gap-1 rounded-full border border-stone-200/80 bg-stone-100/80 p-1 text-xs font-bold text-stone-600 transition-colors duration-200 hover:border-cyan-400/60 focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300"}
    >
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 transition-colors duration-200 ${theme === "light" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 dark:text-slate-400"}`}><Sun size={14} aria-hidden="true" /> দিন</span>
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 transition-colors duration-200 ${theme === "dark" ? "bg-slate-950 text-white shadow-sm" : "text-stone-500"}`}><Moon size={14} aria-hidden="true" /> রাত</span>
    </button>
  );
}
