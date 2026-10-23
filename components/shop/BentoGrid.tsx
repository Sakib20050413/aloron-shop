"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Cable, Headphones, Shield, Sparkles, Watch, Zap } from "lucide-react";

const tiles = [
  {
    title: "QCY GT2 ফ্ল্যাগশিপ স্মার্টওয়াচ",
    subtitle: "AMOLED 1.43\" Display & Zinc Alloy",
    description: "চোখ জুড়ানো হাই-রেজোলিউশন AMOLED স্ক্রিন, প্রিমিয়াম আর্কিটেকচারাল মেটাল ফ্রেম এবং 5ATM ওয়াটার রেজিস্ট্যান্স।",
    icon: Watch,
    className: "md:col-span-2 md:row-span-2",
    sku: "SKU // GAD-WCH-01",
    tag: "২০২৬ ফ্ল্যাগশিপ",
    href: "/product/qcy-gt2-amoled-smart-watch",
  },
  {
    title: "৬৫ ওয়াট GaN ফাস্ট চার্জার",
    subtitle: "Triple Port Ultra-Fast Protocol",
    description: "ল্যাপটপ, ট্যাবলেট ও স্মার্টফোনের জন্য সুপারফাস্ট ও কুল চার্জিং আর্কিটেকচার।",
    icon: Zap,
    className: "",
    sku: "SKU // PWR-GAN-65",
    tag: "GaN Pro",
    href: "/product/65w-gan-fast-charger",
  },
  {
    title: "হাই-স্পিড ব্রেইডেড টাইপ-সি",
    subtitle: "Ballistic Nylon & 60W Delivery",
    description: "টেকসই আর্মার্ড নাইলন বুনন এবং হাই-স্পিড পিডি ডেটা ট্রান্সফার সুবিধা।",
    icon: Cable,
    className: "",
    sku: "SKU // CBL-TYP-03",
    tag: "Heavy-Duty",
    href: "/product/braided-usb-c-cable",
  },
  {
    title: "ডিপ ব্যাস ওয়্যারলেস ইয়ারবাডস",
    subtitle: "13mm Dynamic Driver & ENC",
    description: "১৩মিমি টাইটানিয়াম ড্রাইভার, ক্রিস্টাল কলিং এবং ২৮ ঘণ্টার অবিরাম ব্যাটারি ব্যাকআপ।",
    icon: Headphones,
    className: "md:col-span-2",
    sku: "SKU // AUD-EBD-02",
    tag: "Hi-Fi Studio",
    href: "/product/airbeat-wireless-earbuds",
  },
];

export function BentoGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24" aria-labelledby="bento-title">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200/80 pb-6 dark:border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 dark:border-white/10 bg-neutral-100 dark:bg-white/5 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-neutral-800 dark:text-neutral-200 backdrop-blur-md">
            <Sparkles size={12} className="text-amber-500" />
            <span>আলোড়ন এক্সক্লুসিভ ইঞ্জিনিয়ারিং</span>
          </div>
          <h2 id="bento-title" className="mt-3 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
            স্মার্ট গ্যাজেট। নিখুঁত দৈনন্দিন প্রযুক্তি।
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            আমাদের ল্যাবরেটরিতে প্রতিটি ইউনিট শতভাগ পারফর্ম্যান্স ও কোয়ালিটি টেস্টেড।
          </p>
        </div>
        <Link
          href="/products"
          className="group inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-900 transition-colors hover:text-indigo-600 dark:text-neutral-100 dark:hover:text-indigo-400"
        >
          <span>সব পণ্য এক্সপ্লোর করুন</span>
          <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div className="grid auto-rows-[220px] gap-4 md:grid-cols-4">
        {tiles.map((tile, index) => {
          const Icon = tile.icon;
          return (
            <motion.article
              key={tile.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/90 dark:border-white/[0.08] bg-white/90 dark:bg-[#0c0f18]/80 p-6 shadow-sm hover:shadow-2xl transition-all duration-300 hover:border-neutral-400 dark:hover:border-indigo-500/40 backdrop-blur-md ${tile.className}`}
            >
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-indigo-500/0 via-transparent to-purple-500/0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />

              <Link href={tile.href} className="absolute inset-0 z-20" aria-label={`View ${tile.title}`} />
              
              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/5 text-neutral-900 dark:text-neutral-100 shadow-inner">
                    <Icon size={18} />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      {tile.sku}
                    </span>
                    <p className="font-mono text-[11px] font-medium text-neutral-700 dark:text-neutral-300">
                      {tile.subtitle}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  {tile.tag}
                </span>
              </div>

              <div className="relative z-10 my-auto pt-4">
                <h3 className="text-base font-bold text-neutral-950 transition-colors group-hover:text-indigo-600 sm:text-lg dark:text-white dark:group-hover:text-indigo-400">
                  {tile.title}
                </h3>
                <p className="mt-1.5 max-w-md text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-400">
                  {tile.description}
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-between border-t border-neutral-100 dark:border-white/[0.06] pt-3">
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-900 transition-colors group-hover:text-indigo-600 dark:text-neutral-200 dark:group-hover:text-indigo-400">
                  <span>স্পেসিফিকেশন ও অর্ডার</span>
                  <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px] text-neutral-500">
                  <Shield size={11} className="text-emerald-500" /> ল্যাব টেস্টেড
                </span>
              </div>

              {/* Minimal architectural watermark */}
              <div className="pointer-events-none absolute -bottom-4 -right-4 font-mono text-8xl font-black text-neutral-950/[0.03] select-none dark:text-white/[0.04]">
                0{index + 1}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
