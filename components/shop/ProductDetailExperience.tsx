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
  { icon: Zap, title: "দ্রুততম সেন্ট্রাল হোম ডেলিভারি", detail: "ঢাকা সিটিতে ২৪ ঘণ্টায়, সারাদেশে ৪৮–৭২ ঘণ্টায়" },
  { icon: RotateCcw, title: "৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি", detail: "কোনো সমস্যা থাকলে দ্রুত সমাধান ও এক্সচেঞ্জ" },
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
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Product Gallery */}
        <ProductGallery name={product.name} images={product.images} accent={product.accent ?? "from-neutral-100 to-neutral-200"} />

        {/* Product Meta & Actions */}
        <div className="flex flex-col justify-start">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-neutral-200 bg-neutral-100 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              SKU // {product.productCode}
            </span>
            <span className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              {product.category}
            </span>
          </div>

          <h1 className="mt-4 text-balance text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl lg:text-4xl dark:text-white">
            {product.name}
          </h1>

          <p className="mt-3 text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-400">
            {product.description}
          </p>

          {/* Pricing Row */}
          <div className="mt-6 flex flex-wrap items-baseline gap-3 border-y border-neutral-100 py-4 dark:border-neutral-800">
            <span className="font-mono text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl dark:text-white">
              ৳{product.sellPrice.toLocaleString("en-BD")}
            </span>
            {product.originalPrice > product.sellPrice && (
              <del className="font-mono text-base text-neutral-400 dark:text-neutral-500">
                ৳{product.originalPrice.toLocaleString("en-BD")}
              </del>
            )}
            {discountPercent > 0 && (
              <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                -{discountPercent}% (৳{savings} সাশ্রয়)
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ইন স্টক ({product.stock} ইউনিট রেডি ফর সেন্ট্রাল শিপমেন্ট)</span>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="mt-8 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-xl border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label="পরিমাণ কমান"
                  className="grid size-11 place-items-center text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-mono text-base font-bold text-neutral-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(product.stock || 99, value + 1))}
                  aria-label="পরিমাণ বাড়ান"
                  className="grid size-11 place-items-center text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                >
                  <Plus size={14} />
                </button>
              </div>

              <Link
                ref={buyButtonRef}
                href={checkoutHref}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all duration-150 hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                <Zap size={15} />
                <span>এখনই কিনুন · ৳{(product.sellPrice * quantity).toLocaleString("en-BD")}</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => addItem(product, quantity)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-900 transition-all hover:border-neutral-500 hover:bg-neutral-50 active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
              >
                <ShoppingBag size={15} />
                <span>কার্টে যোগ করুন</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-700 transition-all hover:bg-emerald-500/20 active:scale-[0.98] dark:text-emerald-400"
              >
                <MessageCircle size={15} />
                <span>হোয়াটসঅ্যাপে অর্ডার</span>
              </a>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {guarantees.map(({ icon: Icon, title, detail }) => (
              <div key={title} className="flex items-start gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50/60 p-3.5 dark:border-neutral-800 dark:bg-neutral-900/40">
                <Icon size={17} className="mt-0.5 shrink-0 text-neutral-700 dark:text-neutral-300" />
                <div>
                  <p className="text-xs font-bold text-neutral-900 dark:text-white">{title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specifications */}
      {specs.length > 0 && (
        <section className="mt-16 border-t border-neutral-200/80 pt-10 dark:border-neutral-800">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            TECHNICAL SPECIFICATIONS
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
            বিস্তারিত স্পেসিফিকেশন
          </h2>
          <dl className="mt-6 grid gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 dark:border-neutral-800 dark:bg-neutral-800">
            {specs.map(([label, value]) => (
              <div key={label} className="bg-white p-4 dark:bg-neutral-900">
                <dt className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{label}</dt>
                <dd className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Feature Highlights */}
      {featurePairs.length > 0 && (
        <section className="mt-12">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            ENGINEERING HIGHLIGHTS
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
            ফিচার হাইলাইটস
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {featurePairs.map(([label, value]) => (
              <div key={`feat-${label}`} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900/60">
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">{label}</p>
                <p className="mt-1 text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-400">{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* What's In The Box */}
      {boxContents.length > 0 && (
        <section className="mt-12">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            PACKAGE UNBOXING
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
            প্যাকেজে যা যা থাকছে
          </h2>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {boxContents.map((item) => (
              <li key={item} className="flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-white p-3.5 text-xs font-semibold text-neutral-800 sm:text-sm dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-200">
                <Check size={15} className="shrink-0 text-emerald-500" /> {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQs */}
      {faqList.length > 0 && (
        <section className="mt-12">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            CUSTOMER QUESTIONS
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
            সাধারণ প্রশ্নোত্তর (FAQ)
          </h2>
          <div className="mt-6 space-y-2.5">
            {faqList.map(([question, answer], index) => (
              <details key={question} className="group rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900/60" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-neutral-900 dark:text-white">
                  <span>{question}</span>
                  <ChevronDown size={16} className="shrink-0 text-neutral-400 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-400">{answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Video */}
      {videoUrl && (
        <section className="mt-12">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            VIDEO PREVIEW
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
            প্রোডাক্ট ভিডিও ওভারভিউ
          </h2>
          <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-neutral-200 bg-black dark:border-neutral-800">
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
        <div className="fixed inset-x-0 bottom-4 z-40 mx-auto max-w-md px-4 md:hidden">
          <a
            href={checkoutHref}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-xl active:scale-95 dark:bg-white dark:text-neutral-900"
          >
            <Zap size={14} />
            <span>এখনই অর্ডার করুন · ৳{(product.sellPrice * quantity).toLocaleString("en-BD")}</span>
          </a>
        </div>
      )}
    </>
  );
}
