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
    title: "দ্রুততম সেন্ট্রাল হোম ডেলিভারি",
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
    title: "৭ দিনের অফিসিয়াল রিপ্লেসমেন্ট",
    tag: "WARRANTY POLICY",
    description: "প্রোডাক্টে যেকোনো মেকানিক্যাল বা প্রযুক্তিগত ত্রুটিতে তাৎক্ষণিক রিপ্লেসমেন্ট সুবিধা।",
  },
] as const;

export function TrustSection() {
  return (
    <section id="trust-section" className="border-y border-neutral-200/80 bg-neutral-50/50 py-12 dark:border-neutral-800 dark:bg-neutral-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(({ icon: Icon, title, tag, description }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid size-10 place-items-center rounded-lg border border-neutral-200 bg-neutral-100 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {tag}
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-bold text-neutral-950 sm:text-base dark:text-white">
                  {title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-400">
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
