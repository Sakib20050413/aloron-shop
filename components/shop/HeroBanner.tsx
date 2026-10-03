"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const defaultSlides = [
  {
    id: "qcy-gt2-amoled-smart-watch",
    eyebrow: "২০২৬ স্মার্ট ড্রপ · GAD-WATCH-01",
    title: "QCY GT2 ফ্ল্যাগশিপ স্মার্টওয়াচ",
    product: "১.৪৩\" প্রিমিয়াম AMOLED ডিসপ্লে ও মেটাল বডি",
    price: "৳২,৯৯০",
    discount: "২০% ছাড়",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&q=85",
    accent: "from-cyan-500/20 via-sky-400/10 to-transparent",
  },
  {
    id: "65w-gan-fast-charger",
    eyebrow: "এক চার্জারেই সব ডিভাইস · GAD-CHG-01",
    title: "এক চার্জারেই ল্যাপটপ ও ফোন",
    product: "আল্ট্রা ফাস্ট চার্জিং",
    price: "৳১,৭৯০",
    discount: "১০% ছাড়",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=85",
    accent: "from-amber-500/20 via-orange-400/10 to-transparent",
  },
  {
    id: "airbeat-wireless-earbuds",
    eyebrow: "সাউন্ড যা আপনার পছন্দের · GAD-AUD-01",
    title: "ডিপ ব্যাস ও নয়েজ ক্যান্সেলেশন",
    product: "সারাদিনের ব্যাটারি ব্যাকআপ",
    price: "৳১,৪৯০",
    discount: "১২% ছাড়",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1200&q=85",
    accent: "from-violet-500/20 via-fuchsia-400/10 to-transparent",
  },
];

type HeroSlideRecord = {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  discountTag: string;
  priceText: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
};

type SlideView = {
  id: string;
  eyebrow: string;
  title: string;
  product: string;
  price: string;
  discount: string;
  image: string;
  accent: string;
  ctaText: string;
  ctaLink: string;
};

export function HeroBanner({ cmsSlides = [] }: { cmsSlides?: HeroSlideRecord[] }) {
  const slides: SlideView[] = cmsSlides.length
    ? cmsSlides.map((item) => ({
        id: item.id,
        eyebrow: item.subtitle,
        title: item.title,
        product: item.badgeText,
        price: item.priceText,
        discount: item.discountTag,
        image: item.imageUrl,
        accent: "from-cyan-500/20 via-sky-400/10 to-transparent",
        ctaText: item.ctaText,
        ctaLink: item.ctaLink,
      }))
    : defaultSlides.map((item) => ({ ...item, ctaText: "কালেকশন দেখুন", ctaLink: `/product/${item.id}` }));

  const slideCount = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (paused || slideCount <= 1) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slideCount);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [paused, slideCount]);

  const handleSlideChange = (index: number) => {
    setActive(((index % slideCount) + slideCount) % slideCount);
  };
  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStart.current = event.changedTouches[0]?.clientX ?? null;
    setPaused(true);
  };
  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    const start = touchStart.current;
    const end = event.changedTouches[0]?.clientX;
    touchStart.current = null;
    if (start !== null && end !== undefined && Math.abs(end - start) > 48) {
      handleSlideChange(active + (end < start ? 1 : -1));
    }
    setPaused(false);
  };

  return (
    <section
      aria-label="বিশেষ অফার"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        touchStart.current = null;
        setPaused(false);
      }}
      className="relative overflow-hidden bg-[#faf9f6] text-stone-950 dark:bg-[#080d1a] dark:text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(6,182,212,0.12),transparent_35%)] dark:bg-[radial-gradient(circle_at_70%_20%,rgba(6,182,212,0.16),transparent_35%)]" />
      <div
        className="relative flex min-h-[30rem] transition-transform duration-700 ease-out sm:min-h-[32rem]"
        style={{
          width: `${slideCount * 100}%`,
          transform: `translate3d(-${(active * 100) / slideCount}%, 0, 0)`,
          willChange: "transform",
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            aria-hidden={index !== active}
            className={`flex-shrink-0 bg-gradient-to-br ${slide.accent}`}
            style={{ width: `${100 / slideCount}%` }}
          >
            <div className="mx-auto grid min-h-[inherit] w-full max-w-7xl items-center gap-10 px-5 py-12 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-20">
              <div className="relative z-10">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-700 dark:text-cyan-200">
                  <Sparkles size={14} aria-hidden="true" /> ২০২৬ সালের গ্যাজেট কালেকশন
                </div>
                <p className="text-sm font-bold tracking-wide text-cyan-700 dark:text-cyan-300">{slide.eyebrow}</p>
                <h1 className="mt-4 max-w-2xl text-balance text-4xl font-black leading-[1.12] tracking-tight sm:text-6xl">
                  {slide.title}
                  <br />
                  <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent dark:from-cyan-300 dark:to-violet-400">
                    — {slide.product}
                  </span>
                </h1>
                <div className="mt-7 flex items-center gap-4">
                  <span className="text-3xl font-black sm:text-4xl">{slide.price}</span>
                  <span className="rounded-full bg-amber-400 px-3 py-1.5 text-xs font-black text-slate-950">{slide.discount}</span>
                </div>
                <Link
                  href={slide.ctaLink}
                  tabIndex={index === active ? 0 : -1}
                  className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 text-sm font-black text-slate-950 shadow-[0_0_24px_rgba(6,182,212,0.2)] transition hover:bg-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-500 active:scale-[0.97]"
                >
                  {slide.ctaText} <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
              <div className="relative mx-auto aspect-square w-full max-w-[28rem]">
                <div className="absolute inset-8 rounded-full bg-cyan-400/20 blur-3xl" />
                <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[2.5rem] border border-[#eae6df] bg-white/80 p-8 shadow-[0_18px_60px_rgba(60,50,40,0.12)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]">
                  <Image
                    src={slide.image}
                    alt={slide.product}
                    width={900}
                    height={900}
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    unoptimized
                    sizes="(max-width: 1024px) 90vw, 42vw"
                    onError={(event) => {
                      event.currentTarget.src = "/logo.png";
                    }}
                    className="h-full w-full object-contain mix-blend-multiply drop-shadow-2xl dark:mix-blend-normal"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3">
        <button
          type="button"
          onClick={() => handleSlideChange(active - 1)}
          aria-label="আগের স্লাইড"
          className="grid size-10 place-items-center rounded-full border border-stone-300 bg-white/80 text-stone-800 transition hover:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-white/15 dark:bg-slate-900/80 dark:text-white"
        >
          <ArrowLeft size={16} />
        </button>
        {slides.map((slide, index) => (
          <button
            type="button"
            key={slide.id}
            onClick={() => handleSlideChange(index)}
            aria-label={`স্লাইড ${index + 1}`}
            aria-current={index === active}
            className="grid size-8 place-items-center rounded-full transition focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            <span
              className={`block h-2 rounded-full transition-all ${
                index === active ? "w-8 bg-cyan-500" : "w-2 bg-stone-300 dark:bg-white/30"
              }`}
            />
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleSlideChange(active + 1)}
          aria-label="পরের স্লাইড"
          className="grid size-10 place-items-center rounded-full border border-stone-300 bg-white/80 text-stone-800 transition hover:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-white/15 dark:bg-slate-900/80 dark:text-white"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}