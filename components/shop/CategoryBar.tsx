"use client";

import { Cable, Headphones, LayoutGrid, Package, Zap } from "lucide-react";

const categories = [
  ["", "সব কালেকশন", LayoutGrid],
  ["SMART GADGET", "স্মার্ট গ্যাজেট", Package],
  ["CHARGER", "ফাস্ট চার্জার", Zap],
  ["AUDIO", "ইয়ারবাডস ও অডিও", Headphones],
  ["CABLE", "ক্যাবল ও অ্যাক্সেসরিজ", Cable],
] as const;

export function CategoryBar({ active, onChange }: { active: string; onChange: (category: string) => void }) {
  return (
    <nav aria-label="পণ্য ক্যাটাগরি" className="border-b border-[#eae6df] bg-white/70 px-4 py-4 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/50">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto pb-1 lg:justify-center">
        {categories.map(([value, label, Icon]) => {
          const isSelected = active === value;
          return (
            <button
              type="button"
              key={value || "all"}
              onClick={() => onChange(value)}
              className={`flex min-w-max items-center gap-2 rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                isSelected
                  ? "border-cyan-500 bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "border-stone-200 bg-[#fffdf9] text-stone-700 hover:border-cyan-400 hover:text-cyan-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-500/50"
              }`}
            >
              <Icon size={16} aria-hidden="true" className={isSelected ? "text-slate-950" : "text-cyan-600 dark:text-cyan-400"} />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
