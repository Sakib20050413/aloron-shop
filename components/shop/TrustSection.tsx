"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Clock, CreditCard, ShieldCheck } from "lucide-react";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "১০০% অরিজিনাল ও টেস্টেড",
    tag: "QC VERIFIED",
    description: "ডেলিভারির পূর্বে প্রতি ইউনিট দক্ষ কোয়ালিটি ল্যাবে পুঙ্খানুপুঙ্খ টেস্ট করা হয়।",
  },
  {
    icon: Clock,
    title: "সেন্ট্রাল ঢাকা হাব ডেলিভারি",
    tag: "DHAKA CENTRAL HUB",
    description: "ঢাকার ভেতরে ২৪ ঘণ্টায় এবং সারাদেশে ৪৮–৭২ ঘণ্টায় দ্রুততম হোম ডেলিভারি।",
  },
  {
    icon: CreditCard,
    title: "নিরাপদ ক্যাশ অন ডেলিভারি",
    tag: "ADVANCE ৳200",
    description: "বিকাশে ডেলিভারি সিকিউরিটি অ্যাডভান্স করে অবশিষ্ট মূল্য পণ্য হাতে পেয়ে পরিশোধ।",
  },
  {
    icon: BadgeCheck,
    title: "৭ দিনের রিপ্লেসমেন্ট ওয়ারেন্টি",
    tag: "WARRANTY POLICY",
    description: "প্রোডাক্টে যেকোনো মেকানিক্যাল বা প্রযুক্তিগত ত্রুটিতে তাৎক্ষণিক রিপ্লেসমেন্ট সুবিধা।",
  },
] as const;

export function TrustSection() {
  return (
    <section id="trust-section" className="border-y border-neutral-200/80 bg-neutral-100/40 py-14 dark:border-white/[0.08] dark:bg-[#080a10]/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(({ icon: Icon, title, tag, description }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              whileHover={{ y: -4 }}
              className="group flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white/90 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-neutral-400 dark:border-white/[0.08] dark:bg-[#0c0f18]/80 dark:hover:border-indigo-500/40 backdrop-blur-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid size-11 place-items-center rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/5 text-neutral-900 dark:text-neutral-100 shadow-inner group-hover:scale-105 transition-transform">
                    <Icon size={20} aria-hidden="true" className="text-neutral-800 dark:text-neutral-200" />
                  </div>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {tag}
                  </span>
                </div>
                <h3 className="mt-5 text-sm font-bold text-neutral-950 sm:text-base dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-400">
                  {description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
