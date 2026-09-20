"use client";

import { motion } from "framer-motion";
import { BatteryCharging, Fan, Headphones, Umbrella, Zap } from "lucide-react";

const tiles = [
  { title: "Turbo Airflow Mini Fans", description: "Pocket-sized cooling with powerful airflow.", icon: Fan, className: "md:col-span-2 md:row-span-2", visual: "🌀", tone: "dark:from-cyan-500/30 dark:via-slate-950 dark:to-violet-600/25" },
  { title: "65W GaN Fast Chargers", description: "High-voltage power, compact footprint.", icon: Zap, className: "", visual: "⚡", tone: "dark:from-amber-400/25 dark:via-slate-950 dark:to-orange-600/20" },
  { title: "Anti-UV Smart Umbrellas", description: "Waterproof protection with light-refraction fabric.", icon: Umbrella, className: "", visual: "☂️", tone: "dark:from-fuchsia-500/25 dark:via-slate-950 dark:to-cyan-500/20" },
  { title: "Noise-Canceling Wireless Audio", description: "Deep bass and all-day battery.", icon: Headphones, className: "md:col-span-2", visual: "🎧", tone: "dark:from-violet-500/30 dark:via-slate-950 dark:to-blue-500/20" },
];

export function BentoGrid() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8 lg:pb-24" aria-labelledby="bento-title">
      <div className="mb-8"><p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-600 dark:text-cyan-400">আলোড়ন এডিট</p><h2 id="bento-title" className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">স্মার্ট পছন্দ। নিখুঁত প্রযুক্তি।</h2></div>
      <div className="grid auto-rows-[190px] gap-4 md:grid-cols-4">
        {tiles.map((tile, index) => {
          const Icon = tile.icon;
          return <motion.article key={tile.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.08, type: "spring", damping: 20 }} whileHover={{ scale: 1.03, y: -6 }} whileTap={{ scale: 0.94 }} className={`group relative overflow-hidden rounded-3xl border border-[#eae6df] bg-[#fffdf9] p-6 shadow-[0_8px_30px_rgba(60,50,40,0.04)] backdrop-blur-sm transition hover:border-cyan-400/60 hover:shadow-[0_12px_32px_rgba(60,50,40,0.08)] dark:border-white/15 dark:bg-gradient-to-br dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] ${tile.tone} ${tile.className}`}>
            <div className="relative z-10 flex h-full flex-col justify-between"><div className="flex items-start justify-between"><div><Icon className="text-cyan-600 dark:text-cyan-300" size={24} /><h3 className="mt-4 max-w-sm text-xl font-black text-slate-900 dark:text-white">{tile.title}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">{tile.description}</p></div><span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-700 dark:border-white/15 dark:bg-white/10 dark:text-cyan-100">{index === 0 ? "3D airflow" : index === 1 ? "65W output" : index === 2 ? "UV 50+" : "40h battery"}</span></div><div className="flex items-end justify-between"><span className="text-xs font-bold text-slate-500 dark:text-slate-400">কালেকশন দেখুন <span className="text-cyan-600 dark:text-cyan-300">↗</span></span>{index === 3 && <BatteryCharging className="text-cyan-600 dark:text-emerald-300" size={22} />}</div></div>
            <motion.span animate={index === 0 ? { y: [0, -12, 0], rotate: [0, 8, 0] } : { y: [0, -5, 0] }} transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-5 right-8 text-7xl opacity-70 grayscale-[.15]">{tile.visual}</motion.span>
          </motion.article>;
        })}
      </div>
    </section>
  );
}
