"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, MessageCircle, Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Truck, Zap } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { useCart } from "@/components/CartProvider";

type Props = {
  product: CatalogProduct;
  whatsappUrl: string;
};

const guarantees = [
  { icon: Truck, title: "ক্যাশ অন ডেলিভারি", detail: "পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধের সুবিধা" },
  { icon: Zap, title: "দ্রুততম হোম ডেলিভারি", detail: "ঢাকা সিটিতে ২৪ ঘণ্টায়, সারাদেশে ৪৮-৭২ ঘণ্টায়" },
  { icon: RotateCcw, title: "৭ দিনের রিপ্লেসমেন্ট", detail: "কোনো সমস্যা থাকলে দ্রুত সমাধান ও এক্সচেঞ্জ" },
  { icon: ShieldCheck, title: "১০০% টেস্টেড ও অরিজিনাল", detail: "প্রতিটি ইউনিট ল্যাব টেস্টেড ও কোয়ালিটি সার্টিফাইড" },
];

function toYouTubeEmbed(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  return yt ? `https://www.youtube.com/embed/${yt[1]}` : null;
}

export function ProductDetailExperience({ product, whatsappUrl }: Props) {
  const buyButtonRef = useRef<HTMLAnchorElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSticky, setShowSticky] = useState(false);
  const { addItem } = useCart();

  const specs = Object.entries(product.specs ?? {});
  const featurePairs = specs.slice(0, 4);
  const faqList = ((product as unknown as { faqs?: [string, string][] }).faqs ?? []);
  const boxContents = ((product as unknown as { boxContents?: string[] }).boxContents ?? product.whatsInTheBox ?? []);
  const videoUrl = (product as unknown as { videoUrl?: string }).videoUrl;
  const youtubeEmbed = videoUrl ? toYouTubeEmbed(videoUrl) : null;

  const discountPercent = product.originalPrice > product.sellPrice
    ? Math.max(1, Math.round(((product.originalPrice - product.sellPrice) / product.originalPrice) * 100))
    : 0;

  const savings = Math.max(0, product.originalPrice - product.sellPrice);

  useEffect(() => {
    const button = buyButtonRef.current;
    if (!button) return;
    const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), { threshold: 0.1 });
    observer.observe(button);
    return () => observer.disconnect();
  }, []);

  const checkoutHref = `/checkout?product=${encodeURIComponent(product.slug || product.id)}&quantity=${quantity}`;

  return (
    <>
      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        {/* Product Gallery */}
        <ProductGallery name={product.name} images={product.images} accent={product.accent ?? "from-cyan-100 to-blue-100"} />

        {/* Product Meta & Actions */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
              {product.productCode}
            </span>
            <span className="rounded-lg bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-stone-600 dark:bg-white/10 dark:text-slate-300">
              {product.category}
            </span>
          </div>

          <h1 className="mt-4 text-balance text-3xl sm:text-4xl font-black tracking-tight text-stone-950 dark:text-white">
            {product.name}
          </h1>

          <p className="mt-4 text-sm sm:text-base leading-7 text-stone-600 dark:text-slate-300">
            {product.description}
          </p>

          {/* Pricing Row */}
          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black text-stone-950 dark:text-white">
              ৳{product.sellPrice.toLocaleString("en-BD")}
            </span>
            {product.originalPrice > product.sellPrice && (
              <del className="text-lg text-stone-400 dark:text-slate-500">
                ৳{product.originalPrice.toLocaleString("en-BD")}
              </del>
            )}
            {discountPercent > 0 && (
              <span className="rounded-lg bg-amber-400 px-2.5 py-1 text-xs font-black text-slate-950">
                {discountPercent}% ছাড় (৳{savings} সাশ্রয়)
              </span>
            )}
          </div>

          <p className="mt-3 text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <Check size={16} /> স্টকে আছে ({product.stock} ইউনিট রেডি ফর শিপমেন্ট)
          </p>

          {/* Quantity & CTA Buttons */}
          <div className="mt-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-xl border border-stone-200 bg-white dark:border-white/10 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label="পরিমাণ কমান"
                  className="grid size-11 place-items-center text-stone-600 hover:text-cyan-600 dark:text-slate-300 transition-colors"
                >
                  <Minus size={15} />
                </button>
                <span className="w-10 text-center text-lg font-black text-stone-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(product.stock || 99, value + 1))}
                  aria-label="পরিমাণ বাড়ান"
                  className="grid size-11 place-items-center text-stone-600 hover:text-cyan-600 dark:text-slate-300 transition-colors"
                >
                  <Plus size={15} />
                </button>
              </div>

              <Link
                ref={buyButtonRef}
                href={checkoutHref}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:from-cyan-400 hover:to-cyan-500 active:scale-[0.98]"
              >
                <Zap size={16} className="fill-slate-950" />
                এখনই কিনুন · ৳{(product.sellPrice * quantity).toLocaleString("en-BD")}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => addItem(product, quantity)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-bold text-stone-800 transition hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-700 active:scale-[0.98] dark:border-white/15 dark:bg-slate-900 dark:text-white dark:hover:bg-cyan-950/30 dark:hover:text-cyan-300"
              >
                <ShoppingBag size={17} />
                কার্টে যোগ করুন
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-500/20 active:scale-[0.98] dark:text-emerald-300"
              >
                <MessageCircle size={17} />
                হোয়াটসঅ্যাপে অর্ডার
              </a>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {guarantees.map(({ icon: Icon, title, detail }) => (
              <div key={title} className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-[#fffdf9] p-4 dark:border-white/10 dark:bg-slate-900/50">
                <Icon size={20} className="mt-0.5 shrink-0 text-cyan-600 dark:text-cyan-400" />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white">{title}</p>
                  <p className="mt-0.5 text-xs text-stone-500 dark:text-slate-400">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specifications */}
      {specs.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-black text-stone-950 dark:text-white">বিস্তারিত স্পেসিফিকেশন</h2>
          <dl className="mt-6 grid gap-px overflow-hidden rounded-3xl border border-stone-200 bg-stone-200 dark:border-white/10 dark:bg-white/10 sm:grid-cols-2">
            {specs.map(([label, value]) => (
              <div key={label} className="bg-[#fffdf9] p-5 dark:bg-[#0B0F19]">
                <dt className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">{label}</dt>
                <dd className="mt-1 text-sm sm:text-base font-black text-stone-900 dark:text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Feature Highlights */}
      {featurePairs.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-black text-stone-950 dark:text-white">ফিচার হাইলাইটস</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {featurePairs.map(([label, value]) => (
              <div key={`feat-${label}`} className="rounded-2xl border border-stone-200 bg-[#fffdf9] p-5 dark:border-white/10 dark:bg-[#0B0F19]">
                <p className="text-sm font-black text-cyan-700 dark:text-cyan-300">{label}</p>
                <p className="mt-1 text-sm leading-6 text-stone-600 dark:text-slate-300">{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* What's In The Box */}
      {boxContents.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-black text-stone-950 dark:text-white">প্যাকেজে যা যা থাকছে</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {boxContents.map((item) => (
              <li key={item} className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-[#fffdf9] p-4 text-sm font-semibold text-stone-700 dark:border-white/10 dark:bg-[#0B0F19] dark:text-slate-200">
                <Check size={16} className="shrink-0 text-emerald-500" /> {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQs */}
      {faqList.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-black text-stone-950 dark:text-white">সাধারণ প্রশ্নোত্তর (FAQ)</h2>
          <div className="mt-6 space-y-3">
            {faqList.map(([question, answer], index) => (
              <details key={question} className="group rounded-2xl border border-stone-200 bg-[#fffdf9] p-5 dark:border-white/10 dark:bg-[#0B0F19]" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-black text-stone-900 dark:text-white">
                  <span>{question}</span>
                  <ChevronDown size={18} className="shrink-0 text-stone-400 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-slate-300">{answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Video */}
      {videoUrl && (
        <section className="mt-16">
          <h2 className="text-2xl font-black text-stone-950 dark:text-white">প্রোডাক্ট ভিডিও ওভারভিউ</h2>
          <div className="mt-6 aspect-video overflow-hidden rounded-3xl border border-stone-200 bg-black dark:border-white/10">
            {youtubeEmbed ? (
              <iframe src={youtubeEmbed} title={`${product.name} ভিডিও`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="size-full" />
            ) : (
              <video controls playsInline preload="metadata" className="size-full object-contain"><source src={videoUrl} /></video>
            )}
          </div>
        </section>
      )}

      {/* Sticky Bottom Bar on Mobile */}
      {showSticky && (
        <div className="fixed inset-x-0 bottom-16 z-40 mx-auto max-w-md px-4 md:hidden">
          <a
            href={checkoutHref}
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-6 text-sm font-black text-slate-950 shadow-xl shadow-cyan-500/30 active:scale-95"
          >
            <Zap size={16} className="fill-slate-950" />
            এখনই অর্ডার করুন · ৳{(product.sellPrice * quantity).toLocaleString("en-BD")}
          </a>
        </div>
      )}
    </>
  );
}
