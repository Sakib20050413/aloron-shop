"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Clock3, CreditCard, ShieldCheck } from "lucide-react";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "১০০% অরিজিনাল ও টেস্টেড",
    description: "ডেলিভারির আগে প্রতি ইউনিট দক্ষ কোয়ালিটি টিম দ্বারা টেস্ট করা হয়।",
  },
  {
    icon: Clock3,
    title: "দ্রুততম হোম ডেলিভারি",
    description: "ঢাকার ভেতরে ২৪ ঘণ্টায় এবং সারাদেশে ৪৮-৭২ ঘণ্টায় কেন্দ্রীয় হাব থেকে ডেলিভারি।",
  },
  {
    icon: CreditCard,
    title: "৳২০০ অগ্রিমে নিশ্চিত ক্যাশ অন ডেলিভারি",
    description: "বিকাশে ডেলিভারি চার্জ অগ্রিম দিয়ে বাকি টাকা পণ্য হাতে পেয়ে নিরাপদে পরিশোধ।",
  },
  {
    icon: BadgeCheck,
    title: "৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি",
    description: "প্রোডাক্টে কোনো প্রযুক্তিগত ত্রুটি পেলে দ্রুত সহজ এক্সচেঞ্জ সুবিধা।",
  },
] as const;

export function TrustSection() {
  return (
    <section id="trust-section" className="border-y border-[#eae6df] bg-[#fbf9f5] py-14 dark:border-white/10 dark:bg-[#070b14]">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(({ icon: Icon, title, description }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-[#eae6df] bg-white p-6 shadow-sm transition-all duration-300 hover:border-cyan-500/50 hover:shadow-md dark:border-white/10 dark:bg-slate-900/60"
            >
              <div className="grid size-12 place-items-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:bg-cyan-400/15 dark:text-cyan-300">
                <Icon size={24} aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-base font-black leading-6 text-stone-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-6 text-stone-600 dark:text-slate-300">
                {description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
