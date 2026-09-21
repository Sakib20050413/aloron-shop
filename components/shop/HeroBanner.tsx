"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  {
    id: "pocket-turbo-mini-fan",
    eyebrow: "গরমের সেরা সঙ্গী · GAD-001",
    title: "চরম গরমে তাৎক্ষণিক শীতল বাতাস",
    product: "পকেট টার্বো ফ্যান",
    price: "৳৬৯৯",
    discount: "১৩% ছাড়",
    image: "https://images.unsplash.com/photo-1583225275995-0f09b8f0b7a7?auto=format&fit=crop&w=1200&q=85",
    accent: "from-cyan-500/20 via-sky-400/10 to-transparent",
  },
  {
    id: "65w-gan-fast-charger",
    eyebrow: "এক চার্জার · সব ডিভাইস · GAD-002",
    title: "এক চার্জারেই ল্যাপটপ ও ফোন",
    product: "আল্ট্রা ফাস্ট চার্জিং",
    price: "৳১,৭৯০",
    discount: "১০% ছাড়",
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1200&q=85",
    accent: "from-amber-500/20 via-orange-400/10 to-transparent",
  },
  {
    id: "airbeat-wireless-earbuds",
    eyebrow: "সাউন্ড, যা আপনার · GAD-004",
    title: "ডিপ ব্যাস ও নয়েজ ক্যান্সেলেশন",
    product: "সারাদিনের ব্যাটারি ব্যাকআপ",
    price: "৳১,৪৯০",
    discount: "১২% ছাড়",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1200&q=85",
    accent: "from-violet-500/20 via-fuchsia-400/10 to-transparent",
  },
];

export function HeroBanner() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[active];

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section aria-label="বিশেষ অফার" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className={`relative overflow-hidden bg-gradient-to-br ${slide.accent} bg-[#faf9f6] text-stone-950 dark:bg-[#070a10] dark:text-white`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(6,182,212,0.12),transparent_35%)] dark:bg-[radial-gradient(circle_at_70%_20%,rgba(6,182,212,0.16),transparent_35%)]" />
      <div className="relative mx-auto grid min-h-[30rem] max-w-7xl items-center gap-10 px-5 py-12 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-20">
        <AnimatePresence mode="wait">
          <motion.div key={slide.id} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.35 }} className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-700 dark:text-cyan-200"><Sparkles size={14} aria-hidden="true" /> ২০২৬ সালের গ্যাজেট কালেকশন</div>
            <p className="text-sm font-bold tracking-wide text-cyan-700 dark:text-cyan-300">{slide.eyebrow}</p>
            <h1 className="mt-4 max-w-2xl text-balance text-4xl font-black leading-[1.12] tracking-tight sm:text-6xl">{slide.title}<br /><span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent dark:from-cyan-300 dark:to-violet-400">— {slide.product}</span></h1>
            <div className="mt-7 flex items-center gap-4"><span className="text-3xl font-black sm:text-4xl">{slide.price}</span><span className="rounded-full bg-amber-400 px-3 py-1.5 text-xs font-black text-slate-950">{slide.discount}</span></div>
            <Link href={`/product/${slide.id}`} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 text-sm font-black text-slate-950 shadow-[0_0_24px_rgba(6,182,212,0.2)] transition hover:bg-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-500 active:scale-[0.97]">কালেকশন দেখুন <ArrowRight size={17} aria-hidden="true" /></Link>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div key={slide.image} initial={{ opacity: 0, scale: .92, rotate: 3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 1.04, rotate: -3 }} transition={{ duration: 0.45 }} className="relative mx-auto aspect-square w-full max-w-[28rem]">
            <div className="absolute inset-8 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[2.5rem] border border-[#eae6df] bg-white/80 p-8 shadow-[0_18px_60px_rgba(60,50,40,0.12)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]"><Image src={slide.image} alt={slide.product} width={900} height={900} priority={active === 0} sizes="(max-width: 1024px) 90vw, 42vw" className="h-full w-full object-contain mix-blend-multiply drop-shadow-2xl dark:mix-blend-normal" /></div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3"><button type="button" onClick={() => setActive((active - 1 + slides.length) % slides.length)} aria-label="আগের স্লাইড" className="grid size-10 place-items-center rounded-full border border-stone-300 bg-white/80 text-stone-800 transition hover:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-white/15 dark:bg-slate-900/80 dark:text-white"><ArrowLeft size={16} /></button>{slides.map((item, index) => <button type="button" key={item.id} onClick={() => setActive(index)} aria-label={`স্লাইড ${index + 1}`} className={`h-2 rounded-full transition-all ${active === index ? "w-8 bg-cyan-500" : "w-2 bg-stone-300 dark:bg-white/30"}`} />)}<button type="button" onClick={() => setActive((active + 1) % slides.length)} aria-label="পরের স্লাইড" className="grid size-10 place-items-center rounded-full border border-stone-300 bg-white/80 text-stone-800 transition hover:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-white/15 dark:bg-slate-900/80 dark:text-white"><ArrowRight size={16} /></button></div>
    </section>
  );
}
