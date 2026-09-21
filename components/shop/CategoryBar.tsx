"use client";

import { Cable, Fan, Headphones, Package, Zap } from "lucide-react";

const categories = [
  ["Mini Fan", "মিনি ফ্যান", Fan],
  ["Charger", "ফাস্ট চার্জার", Zap],
  ["Cable", "ক্যাবল", Cable],
  ["Audio", "ইয়ারবাডস", Headphones],
  ["Smart Essentials", "স্মার্ট গ্যাজেট", Package],
] as const;

export function CategoryBar({ active, onChange }: { active: string; onChange: (category: string) => void }) {
  return <nav aria-label="পণ্য ক্যাটাগরি" className="border-b border-[#eae6df] bg-white/70 px-4 py-4 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/50"><div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pb-1 lg:justify-center">{categories.map(([value, label, Icon]) => <button type="button" key={value} onClick={() => onChange(active === value ? "" : value)} className={`flex min-w-max items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-cyan-500 ${active === value ? "border-cyan-500 bg-cyan-500 text-slate-950" : "border-stone-200 bg-[#fffdf9] text-stone-700 hover:border-cyan-400 hover:text-cyan-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"}`}><Icon size={17} aria-hidden="true" />{label}</button>)}</div></nav>;
}
