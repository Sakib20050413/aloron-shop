"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle({ mobile = false }: { mobile?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "লাইট থিম চালু করুন" : "ডার্ক থিম চালু করুন"}
      className={mobile
        ? "flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-3.5 text-base font-bold text-white transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-cyan-400"
        : "grid size-11 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-cyan-600 focus-visible:ring-2 focus-visible:ring-cyan-400 dark:text-slate-300 dark:hover:bg-white/10"}
    >
      {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
      {mobile && (theme === "dark" ? "লাইট থিম" : "ডার্ক থিম")}
    </button>
  );
}
