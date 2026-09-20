"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function HeroBanner({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#030712] dark:text-white">
      <div className="pointer-events-none absolute -left-32 top-0 size-96 rounded-full bg-cyan-400/10 blur-3xl dark:bg-[#06B6D4]/25" />
      <div className="pointer-events-none absolute right-0 top-0 size-[28rem] rounded-full bg-cyan-300/10 blur-3xl dark:bg-[#8B5CF6]/25" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-28">
        <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-700 dark:text-cyan-200">
            <Sparkles size={14} /> ২০২৬ সালের গ্যাজেট কালেকশন
          </div>
          <p className="mb-4 text-sm font-semibold text-cyan-700 dark:text-cyan-200">ফেসবুকে ২.৫K+ ফলোয়ারের বিশ্বস্ত গ্যাজেট শপ</p>
          <h1 className="max-w-3xl text-balance text-3xl font-black leading-[1.2] tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.08] lg:text-7xl dark:text-white">{title ?? "প্রয়োজনীয় সব"} <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent dark:from-cyan-300 dark:to-violet-400">{title ? "" : "স্মার্ট গ্যাজেট ও ইলেকট্রনিক্স"}</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg dark:text-slate-300">{subtitle ?? "Thoughtfully chosen tech essentials for the way you live, work, and move."}</p>
          <div className="mt-7 flex flex-wrap gap-3 sm:mt-9">
            <Link href="#trending" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-cyan-600 focus-visible:ring-2 focus-visible:ring-cyan-200">কালেকশন দেখুন <ArrowUpRight size={17} /></Link>
            <Link href="#trending" className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700 focus-visible:ring-2 focus-visible:ring-cyan-200 dark:border-white/15 dark:text-slate-200 dark:hover:border-cyan-400/50">ট্রেন্ডিং গ্যাজেট</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold text-slate-700 dark:text-slate-200">
            <span className="rounded-full border border-cyan-300/40 bg-cyan-100 px-3 py-2 dark:bg-cyan-300/10">⚡ ২৪–৪৮ ঘণ্টায় ডেলিভারি</span>
            <span className="rounded-full border border-violet-300/40 bg-violet-100 px-3 py-2 dark:bg-violet-300/10">✦ ১০০% টেস্টেড</span>
            <span className="rounded-full border border-amber-300/40 bg-amber-100 px-3 py-2 dark:bg-amber-300/10">৳২০০ বিকাশ অগ্রিম বুকিং</span>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 1, scale: 1, rotate: 0 }} animate={{ opacity: 1, scale: 1, rotate: 0, y: [0, -12, 0] }} transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }} className="relative mx-auto w-full max-w-md">
          <motion.div animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.12, 1] }} transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }} className="absolute inset-5 rounded-[2rem] bg-cyan-400/40 blur-2xl" />
          <div className="absolute -right-10 -top-10 size-48 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white/90 p-7 shadow-[0_8px_25px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-gradient-to-br dark:from-cyan-500 dark:via-indigo-600 dark:to-violet-600 dark:shadow-2xl dark:shadow-cyan-950/40">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-white/70 p-6 backdrop-blur-sm dark:border-white/20 dark:bg-black/10">
              <span className="text-sm font-bold text-cyan-700 dark:text-cyan-100">আলোড়ন / ২০২৬ কালেকশন</span>
              <div><div className="text-8xl">🎧</div><p className="mt-4 text-2xl font-black text-slate-900 dark:text-white">স্বচ্ছন্দ সাউন্ড।<br />কম শব্দ।</p></div>
              <div className="flex items-end justify-between text-sm text-cyan-700 dark:text-cyan-100"><span>নির্বাচিত গ্যাজেট</span><ArrowUpRight size={20} /></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
