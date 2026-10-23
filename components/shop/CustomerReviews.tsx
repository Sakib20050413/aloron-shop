"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Star } from "lucide-react";

const reviews = [
  {
    name: "তানভীর আহমেদ",
    location: "মিরপুর, ঢাকা",
    product: "QCY GT2 AMOLED Watch",
    date: "৩ দিন আগে",
    rating: 5,
    comment: "স্মার্টওয়াচটি সত্যি প্রিমিয়াম! মেটাল অ্যালয় বডি এবং অ্যামোলেড ডিসপ্লে এক কথায় অসাধারণ। ঢাকা সিটির ভেতরে অর্ডার করার ২৪ ঘণ্টার মধ্যেই ডেলিভারি পেয়েছি।",
  },
  {
    name: "মাহমুদুল হাসান",
    location: "জিইসি, চট্টগ্রাম",
    product: "65W GaN Fast Charger",
    date: "৫ দিন আগে",
    rating: 5,
    comment: "এক চার্জারেই আমার ল্যাপটপ আর ফোন ফুল স্পিডে চার্জ হচ্ছে। ২০০ টাকা অ্যাডভান্স দিয়ে একটু সংশয়ে ছিলাম, কিন্তু পণ্য হাতে পেয়ে অবশিষ্ট টাকা পরিশোধের পদ্ধতি খুবই সিকিউর।",
  },
  {
    name: "নুসরাত জাহান",
    location: "উপশহর, সিলেট",
    product: "AirBeat Wireless Earbuds",
    date: "১ সপ্তাহ আগে",
    rating: 5,
    comment: "সাউন্ড কোয়ালিটি এবং ব্যাস দুর্দান্ত। প্যাকেজিং খুব নিখুঁত ছিল এবং কলিং কোয়ালিটিও পরিষ্কার। আলোড়ন অনলাইন শপিংয়ের সাপোর্ট টিম খুবই সহযোগিতাপূর্ণ।",
  },
];

export function CustomerReviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="reviews-heading">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6 dark:border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-neutral-100 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
            <ShieldCheck size={13} className="text-emerald-500" />
            <span>ভেরিফাইড কাস্টমার এক্সপেরিয়েন্স</span>
          </div>
          <h2 id="reviews-heading" className="mt-3 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
            আমাদের সন্তুষ্ট ক্রেতাদের মতামত
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            দেশজুড়ে হাজারো প্রযুক্তিপ্রেমী প্রতিদিন আলোড়নের অরিজিনাল গ্যাজেটে আস্থা রাখছেন।
          </p>
        </div>
        <div className="flex items-center gap-2.5 font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={15} className="fill-amber-500 text-amber-500" />
            ))}
          </div>
          <span>৪.৯ / ৫.০ রেটিং (১,২০০+ রিভিউ)</span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {reviews.map((review, index) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            className="flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-white p-6 shadow-sm transition-all duration-200 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex text-amber-500">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
                  {review.date}
                </span>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-neutral-700 sm:text-sm dark:text-neutral-300">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 sm:text-sm dark:text-white">
                  {review.name}
                  <CheckCircle2 size={13} className="text-emerald-500" />
                </p>
                <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">{review.location}</p>
              </div>
              <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                {review.product}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
