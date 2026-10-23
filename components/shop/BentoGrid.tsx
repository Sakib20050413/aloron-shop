"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Cable, Headphones, Sparkles, Watch, Zap } from "lucide-react";

const tiles = [
  {
    title: "QCY GT2 ফ্ল্যাগশিপ স্মার্টওয়াচ",
    description: "১.৪৩\" চোখ জুড়ানো AMOLED ডিসপ্লে, প্রিমিয়াম জিংক অ্যালয় মেটাল বডি ও ৫এটিএম ওয়াটারপ্রুফ।",
    icon: Watch,
    className: "md:col-span-2 md:row-span-2",
    visual: "⌚",
    tone: "dark:from-cyan-500/25 dark:via-slate-950 dark:to-blue-600/20",
    tag: "২০২৬ ফ্ল্যাগশিপ",
    href: "/product/qcy-gt2-amoled-smart-watch",
  },
  {
    title: "৬৫ ওয়াট GaN ফাস্ট চার্জার",
    description: "এক চার্জারেই ল্যাপটপ, ট্যাব ও ফোন সুপারফাস্ট চার্জিং।",
    icon: Zap,
    className: "",
    visual: "⚡",
    tone: "dark:from-amber-400/20 dark:via-slate-950 dark:to-orange-600/15",
    tag: "65W GaN Pro",
    href: "/product/65w-gan-fast-charger",
  },
  {
    title: "হাই-স্পিড ব্রেইডেড টাইপ-সি",
    description: "টেকসই নাইলন ব্রেইড ও ৬০W হাই স্পিড ডেটা ও চার্জিং।",
    icon: Cable,
    className: "",
    visual: "🔌",
    tone: "dark:from-fuchsia-500/20 dark:via-slate-950 dark:to-violet-500/15",
    tag: "Heavy-Duty Cable",
    href: "/product/braided-usb-c-cable",
  },
  {
    title: "ডিপ ব্যাস ওয়্যারলেস ইয়ারবাডস",
    description: "১৩মিমি ডাইনামিক ড্রাইভার, ট্রু ওয়্যারলেস স্টেরিও ও ২৮ ঘণ্টা ব্যাটারি ব্যাকআপ।",
    icon: Headphones,
    className: "md:col-span-2",
    visual: "🎧",
    tone: "dark:from-teal-500/25 dark:via-slate-950 dark:to-emerald-500/15",
    tag: "Hi-Fi Studio Audio",
    href: "/product/airbeat-wireless-earbuds",
  },
];

export function BentoGrid() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8 lg:pb-24" aria-labelledby="bento-title">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
            <Sparkles size={13} /> আলোড়ন এক্সক্লুসিভ
          </div>
          <h2 id="bento-title" className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            স্মার্ট গ্যাজেট। নিখুঁত দৈনন্দিন প্রযুক্তি।
          </h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-slate-400">
            আমাদের ল্যাবে প্রতিটি ইউনিট ১০০% কোয়ালিটি ও পারফর্ম্যান্স টেস্টেড।
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs sm:text-sm font-bold text-cyan-700 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300"
        >
          সব পণ্য এক্সপ্লোর করুন →
        </Link>
      </div>

      <div className="grid auto-rows-[200px] gap-4 md:grid-cols-4">
        {tiles.map((tile, index) => {
          const Icon = tile.icon;
          return (
            <motion.article
              key={tile.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.08, type: "spring", damping: 20 }}
              whileHover={{ scale: 1.015, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative overflow-hidden rounded-3xl border border-[#eae6df] bg-[#fffdf9] p-6 shadow-[0_8px_30px_rgba(60,50,40,0.04)] backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/60 hover:shadow-[0_16px_36px_rgba(60,50,40,0.08)] dark:border-white/10 dark:bg-gradient-to-br dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] ${tile.tone} ${tile.className}`}
            >
              <Link href={tile.href} className="absolute inset-0 z-20" aria-label={`View ${tile.title}`} />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="grid size-10 place-items-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:bg-cyan-400/15 dark:text-cyan-300">
                      <Icon size={22} />
                    </span>
                    <h3 className="mt-4 max-w-sm text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {tile.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-xs sm:text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {tile.description}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-stone-200 bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-700 dark:border-white/15 dark:bg-white/10 dark:text-cyan-200">
                    {tile.tag}
                  </span>
                </div>
                <div className="flex items-end justify-between pt-4">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-700 dark:text-cyan-300 group-hover:translate-x-1 transition-transform">
                    বিস্তারিত ও অর্ডার করুন <span>↗</span>
                  </span>
                </div>
              </div>
              <motion.span
                animate={index === 0 ? { y: [0, -8, 0], rotate: [0, 4, 0] } : { y: [0, -5, 0] }}
                transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute bottom-4 right-6 text-6xl sm:text-7xl opacity-50 grayscale-[.1] dark:opacity-40"
              >
                {tile.visual}
              </motion.span>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
