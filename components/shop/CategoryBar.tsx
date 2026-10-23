"use client";

import { Cable, Headphones, LayoutGrid, Package, Zap } from "lucide-react";

const categories = [
  ["", "সব গ্যাজেটস", LayoutGrid],
  ["SMART GADGET", "স্মার্ট গ্যাজেট", Package],
  ["CHARGER", "ফাস্ট চার্জার", Zap],
  ["AUDIO", "অডিও ও ইয়ারবাডস", Headphones],
  ["CABLE", "ক্যাবল ও কানেক্টিভিটি", Cable],
] as const;

export function CategoryBar({ active, onChange }: { active: string; onChange: (category: string) => void }) {
  return (
    <nav aria-label="পণ্য ফিল্টার" className="border-b border-neutral-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-[#06080d]/70 backdrop-blur-xl px-4 py-3.5">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto pb-1 lg:justify-center scrollbar-none">
        {categories.map(([value, label, Icon]) => {
          const isSelected = active === value;
          return (
            <button
              type="button"
              key={value || "all"}
              onClick={() => onChange(value)}
              className={`flex min-w-max items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                isSelected
                  ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md font-bold"
                  : "border border-neutral-200/90 dark:border-white/10 bg-white/80 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500 backdrop-blur-sm"
              }`}
            >
              <Icon size={15} aria-hidden="true" className={isSelected ? "text-white dark:text-neutral-950" : "text-neutral-400"} />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
