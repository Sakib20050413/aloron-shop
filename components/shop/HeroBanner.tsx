"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const defaultSlides = [
  {
    id: "qcy-gt2-amoled-smart-watch",
    eyebrow: "ফ্ল্যাগশিপ গ্যাজেট • GAD-WATCH-01",
    title: "QCY GT2 AMOLED",
    subtitle: "১.৪৩\" চোখ জুড়ানো ডিসপ্লে ও প্রিমিয়াম জিংক অ্যালয় মেটাল বডি",
    price: "৳২,৯৯০",
    originalPrice: "৳৩,৭০০",
    discount: "২০% ছাড়",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&q=85",
    features: ["১.৪৩\" AMOLED", "Zinc Alloy Frame", "5ATM Waterproof", "৬ দিন ব্যাটারি"],
  },
  {
    id: "65w-gan-fast-charger",
    eyebrow: "সুপারফাস্ট পাওয়ার • GAD-CHG-01",
    title: "65W GaN Fast Charger",
    subtitle: "এক চার্জারেই ল্যাপটপ, ট্যাবলেট ও স্মার্টফোন আল্ট্রাফাস্ট চার্জিং",
    price: "৳১,৭৯০",
    originalPrice: "৳১,৯৯০",
    discount: "১০% ছাড়",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=85",
    features: ["65W Max Output", "GaN Pro Tech", "3x Multi-Port", "ওভারহিট প্রোটেকশন"],
  },
  {
    id: "airbeat-wireless-earbuds",
    eyebrow: "স্টুডিও সাউন্ড • GAD-AUD-01",
    title: "AirBeat True Wireless",
    subtitle: "১৩মিমি ডিপ ব্যাস ড্রাইভার, লো-ল্যাটেন্সি গেমিং ও সারাদিনের ব্যাটারি ব্যাকআপ",
    price: "৳১,৪৯০",
    originalPrice: "৳১,৬৯০",
    discount: "১২% ছাড়",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1200&q=85",
    features: ["13mm Dynamic Driver", "২৮ ঘণ্টা প্লেটাইম", "Bluetooth v5.3", "নয়েজ আইসোলেশন"],
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
  subtitle: string;
  price: string;
  originalPrice?: string;
  discount: string;
  image: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
};

export function HeroBanner({ cmsSlides = [] }: { cmsSlides?: HeroSlideRecord[] }) {
  const slides: SlideView[] = cmsSlides.length
    ? cmsSlides.map((item) => ({
        id: item.id,
        eyebrow: item.subtitle || "এক্সক্লুসিভ কালেকশন",
        title: item.title,
        subtitle: item.badgeText || "প্রিমিয়াম কোয়ালিটি সার্টিফাইড",
        price: item.priceText,
        discount: item.discountTag || "অফার",
        image: item.imageUrl,
        features: ["১০০% টেস্টেড", "দ্রুত ডেলিভারি", "৭ দিন রিপ্লেসমেন্ট"],
        ctaText: item.ctaText || "অর্ডার করুন",
        ctaLink: item.ctaLink || `/product/${item.id}`,
      }))
    : defaultSlides.map((item) => ({
        ...item,
        ctaText: "এখনই কিনুন",
        ctaLink: `/product/${item.id}`,
      }));

  const slideCount = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (paused || slideCount <= 1) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slideCount);
    }, 4500);
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
      aria-label="প্রিমিয়াম গ্যাজেট কালেকশন"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        touchStart.current = null;
        setPaused(false);
      }}
      className="relative overflow-hidden bg-neutral-950 text-white selection:bg-indigo-500 selection:text-white"
    >
      {/* Cinematic Studio Glow & Ambient Aura */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_70%)]" />

      {/* GPU 60fps Carousel Track */}
      <div
        className="relative flex min-h-[32rem] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] sm:min-h-[36rem]"
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
            className="flex-shrink-0"
            style={{ width: `${100 / slideCount}%` }}
          >
            <div className="mx-auto grid min-h-[inherit] w-full max-w-7xl items-center gap-10 px-5 py-12 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
              {/* Left Column: Editorial Info */}
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/90 px-3.5 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-300 shadow-inner backdrop-blur-md">
                  <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span>{slide.eyebrow}</span>
                </div>

                <h1 className="mt-5 text-balance text-4xl sm:text-6xl font-black leading-[1.08] tracking-tight text-white">
                  {slide.title}
                </h1>

                <p className="mt-4 max-w-xl text-base sm:text-lg text-neutral-300 font-normal leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* Tactile Feature Chips */}
                {slide.features && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {slide.features.map((feat) => (
                      <span
                        key={feat}
                        className="inline-flex items-center gap-1 rounded-lg border border-neutral-800/90 bg-neutral-900/70 px-3 py-1 text-xs font-semibold text-neutral-300 shadow-sm backdrop-blur-md"
                      >
                        <Sparkles size={11} className="text-amber-400" />
                        {feat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price Display */}
                <div className="mt-7 flex items-baseline gap-3">
                  <span className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                    {slide.price}
                  </span>
                  {slide.originalPrice && (
                    <del className="text-base sm:text-lg text-neutral-500 font-semibold">
                      {slide.originalPrice}
                    </del>
                  )}
                  <span className="rounded-md bg-gradient-to-r from-amber-400 to-amber-500 px-2.5 py-0.5 text-xs font-black text-neutral-950 uppercase tracking-wide shadow-sm">
                    {slide.discount}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href={slide.ctaLink}
                    tabIndex={index === active ? 0 : -1}
                    className="group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-7 text-sm font-black text-neutral-950 shadow-xl transition-all duration-300 hover:bg-neutral-100 active:scale-[0.98]"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white via-neutral-100 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <Zap size={16} className="relative z-10 fill-neutral-950 text-neutral-950 transition-transform group-hover:scale-110" />
                    <span className="relative z-10">{slide.ctaText}</span>
                  </Link>
                  <Link
                    href={slide.ctaLink}
                    tabIndex={index === active ? 0 : -1}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/80 px-6 text-sm font-bold text-neutral-200 shadow-md backdrop-blur-md transition-all duration-300 hover:border-neutral-600 hover:bg-neutral-800/80 hover:text-white active:scale-[0.98]"
                  >
                    ফিচারসমূহ <ArrowRight size={15} />
                  </Link>
                </div>
              </div>

              {/* Right Column: Studio Gadget Showcase with Concentric Pedestal Aura */}
              <div className="relative mx-auto aspect-square w-full max-w-[26rem] sm:max-w-[30rem]">
                {/* Concentric Ambient Light Ring */}
                <div className="absolute inset-0 rounded-full border border-white/[0.06] scale-110 pointer-events-none" />
                <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/10 to-cyan-500/20 blur-3xl pointer-events-none" />
                
                <div className="relative flex h-full items-center justify-center overflow-hidden rounded-3xl border border-neutral-800/90 bg-gradient-to-b from-neutral-900/80 via-neutral-900/40 to-neutral-950/90 p-8 shadow-2xl backdrop-blur-xl group">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    width={900}
                    height={900}
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    unoptimized
                    sizes="(max-width: 1024px) 90vw, 42vw"
                    onError={(event) => {
                      event.currentTarget.src = "/logo.png";
                    }}
                    className="h-full w-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.7)] transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* High-Tech Authenticity Badge */}
                  <div className="absolute top-4 right-4 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-mono text-neutral-400 backdrop-blur-md">
                    ALORON // AUTHENTIC
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Navigation Bar with Dynamic Countdown Bar */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 z-20">
        <button
          type="button"
          onClick={() => handleSlideChange(active - 1)}
          aria-label="পূর্ববর্তী স্লাইড"
          className="grid size-9 place-items-center rounded-xl border border-neutral-800 bg-neutral-900/80 text-neutral-400 backdrop-blur-md hover:border-neutral-600 hover:text-white transition-all active:scale-95"
        >
          <ArrowLeft size={15} />
        </button>

        <div className="flex items-center gap-1.5">
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.id}
              onClick={() => handleSlideChange(index)}
              aria-label={`স্লাইড ${index + 1}`}
              aria-current={index === active}
              className="p-1"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  index === active
                    ? "w-8 bg-gradient-to-r from-white to-neutral-300 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    : "w-2 bg-neutral-700 hover:bg-neutral-500"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => handleSlideChange(active + 1)}
          aria-label="পরবর্তী স্লাইড"
          className="grid size-9 place-items-center rounded-xl border border-neutral-800 bg-neutral-900/80 text-neutral-400 backdrop-blur-md hover:border-neutral-600 hover:text-white transition-all active:scale-95"
        >
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Bottom Trust Ribbon */}
      <div className="border-t border-neutral-800/80 bg-neutral-950/90 py-3 px-5 text-xs text-neutral-400 font-medium backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-around gap-4 text-center">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" /> ১০০% অরিজিনাল সার্টিফাইড
          </span>
          <span className="hidden sm:inline-block text-neutral-700">•</span>
          <span>🚚 ঢাকার সেন্ট্রাল হাব থেকে ২৪–৪৮ ঘণ্টায় ডেলিভারি</span>
          <span className="hidden sm:inline-block text-neutral-700">•</span>
          <span>💵 ৳২০০ বিকাশ অগ্রিমে ক্যাশ অন ডেলিভারি</span>
          <span className="hidden sm:inline-block text-neutral-700">•</span>
          <span>🔄 ৭ দিনের সহজ রিপ্লেসমেন্ট</span>
        </div>
      </div>
    </section>
  );
}
