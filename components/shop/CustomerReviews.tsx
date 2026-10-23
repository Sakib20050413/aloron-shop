"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Star } from "lucide-react";

const reviews = [
  {
    name: "তানভীর আহমেদ",
    location: "মিরপুর, ঢাকা",
    product: "QCY GT2 AMOLED Smart Watch",
    date: "৩ দিন আগে",
    rating: 5,
    comment: "ওয়াচটি সত্যি প্রিমিয়াম! মেটাল বডি এবং অ্যামোলেড ডিসপ্লে এক কথায় অসাধারণ। ঢাকা সিটির ভেতরে অর্ডার করার ২৪ ঘণ্টার মধ্যেই পেয়ে গেছি। আলোড়নের সার্ভিস সত্যিই প্রশংসনীয়।",
  },
  {
    name: "মাহমুদুল হাসান",
    location: "জিইসি, চট্টগ্রাম",
    product: "65W GaN Fast Charger",
    date: "৫ দিন আগে",
    rating: 5,
    comment: "এক চার্জারেই আমার ম্যাকবুক আর স্যামসাং ফোন ফুল স্পিডে চার্জ হচ্ছে। ২০০ টাকা অ্যাডভান্স দিয়ে একটু চিন্তায় ছিলাম, কিন্তু প্রোডাক্ট হাতে পেয়ে ক্যাশ পরিশোধের সুবিধাটা খুবই সিকিউর।",
  },
  {
    name: "নুসরাত জাহান",
    location: "উপশহর, সিলেট",
    product: "AirBeat Wireless Earbuds",
    date: "১ সপ্তাহ আগে",
    rating: 5,
    comment: "সাউন্ড কোয়ালিটি এবং ব্যাস দুর্দান্ত। প্যাকেজিং খুব সুন্দর ছিল এবং কলিং কোয়ালিটিও পরিষ্কার। আলোড়ন অনলাইন শপিংয়ের হোয়াটসঅ্যাপ সাপোর্ট টিম খুব হেল্পফুল।",
  },
];

export function CustomerReviews() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-20" aria-labelledby="reviews-heading">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={14} /> ভেরিফাইড কাস্টমার রিভিউ
          </div>
          <h2 id="reviews-heading" className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            আমাদের সন্তুষ্ট ক্রেতাদের মতামত
          </h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-slate-400">
            দেশজুড়ে হাজারো গ্যাজেট প্রেমী প্রতিদিন আলোড়নে আস্থা রাখছেন।
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-stone-700 dark:text-slate-300">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={17} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span>৪.৯ / ৫.০ রেটিং (১,২০০+ রিভিউ)</span>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {reviews.map((review, index) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="flex flex-col justify-between rounded-3xl border border-[#eae6df] bg-[#fffdf9] p-6 shadow-[0_8px_30px_rgba(60,50,40,0.04)] backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/50 hover:shadow-lg dark:border-white/10 dark:bg-slate-900/60"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] font-medium text-stone-400 dark:text-slate-500">
                  {review.date}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-stone-700 dark:text-slate-200">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#eae6df] dark:border-white/10 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                  {review.name}
                  <span title="ভেরিফাইড ক্রেতা">
                    <CheckCircle2 size={14} className="text-emerald-500 fill-emerald-500/20" />
                  </span>
                </p>
                <p className="text-xs text-stone-500 dark:text-slate-400">{review.location}</p>
              </div>
              <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md">
                {review.product.split(" ")[0]} {review.product.split(" ")[1]}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
