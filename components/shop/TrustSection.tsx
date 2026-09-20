"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Clock3, CreditCard, ShieldCheck } from "lucide-react";

const trustItems = [
  [ShieldCheck, "১০০% অরিজিনাল ও টেস্টেড গ্যাজেট", "ডেলিভারির আগে প্রতি ইউনিট চেক করা হয়"],
  [Clock3, "দ্রুততম হোম ডেলিভারি", "কুমিল্লা ও ঢাকায় ২৪ ঘণ্টায়, সারাদেশে ৪৮ ঘণ্টায়"],
  [CreditCard, "২০০ টাকা অগ্রিমে নিশ্চিত বুকিং", "বিকাশে ডেলিভারি চার্জ দিয়ে বাকিটা ক্যাশ অন ডেলিভারি"],
  [BadgeCheck, "৭ দিনের সহজ রিপ্লেসমেন্ট ওয়ারেন্টি", "প্রোডাক্টে সমস্যা থাকলে দ্রুত সমাধান"],
] as const;

export function TrustSection() {
  return <section id="trust-section" className="border-y border-white/10 bg-[#030712]"><div className="mx-auto grid max-w-7xl gap-5 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">{trustItems.map(([Icon, title, description], index) => <motion.article key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} whileHover={{ y: -5 }} className="rounded-3xl border border-cyan-400/15 bg-white/[.06] p-5 shadow-xl shadow-cyan-950/10 backdrop-blur-xl"><div className="grid size-12 place-items-center rounded-2xl bg-cyan-400/15 text-cyan-300"><Icon size={22} aria-hidden="true" /></div><h3 className="mt-5 font-bold leading-6 text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{description}</p></motion.article>)}</div></section>;
}
