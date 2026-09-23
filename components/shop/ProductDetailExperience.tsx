"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, MessageCircle, Minus, Plus, ShieldCheck, ShoppingBag, Truck, Zap, RotateCcw } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ImageOrIcon } from "@/components/shop/ImageOrIcon";

type Props = {
  product: CatalogProduct;
  whatsappUrl: string;
};

const guarantees = [
  { icon: Truck, title: "ক্যাশ অন ডেলিভারি", detail: "পণ্য হাতে পেয়ে পেমেন্ট" },
  { icon: Zap, title: "২৪–৪৮ ঘণ্টায় ডেলিভারি", detail: "সারা দেশে দ্রুত ডেলিভারি" },
  { icon: RotateCcw, title: "৭ দিনের রিপ্লেসমেন্ট", detail: "সহজ এক্সচেঞ্জ সুবিধা" },
  { icon: ShieldCheck, title: "১০০% টেস্টেড ও অরিজিনাল", detail: "যাচাইকৃত কোয়ালিটি" },
];

function toYouTubeEmbed(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  return yt ? `https://www.youtube.com/embed/${yt[1]}` : null;
}

export function ProductDetailExperience({ product, whatsappUrl }: Props) {
  const buyButtonRef = useRef<HTMLAnchorElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSticky, setShowSticky] = useState(false);
  const specs = Object.entries(product.specs ?? {});
  const featurePairs = specs.slice(0, 4);
  const faqList = ((product as unknown as { faqs?: [string, string][] }).faqs ?? []);
  const boxContents = ((product as unknown as { boxContents?: string[] }).boxContents ?? []);
  const videoUrl = (product as unknown as { videoUrl?: string }).videoUrl;
  const youtubeEmbed = videoUrl ? toYouTubeEmbed(videoUrl) : null;

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
        <ProductGallery name={product.name} images={product.images} accent={product.accent} />
        <div>
          <p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-600">{product.productCode} · {product.category}</p>
          <h1 className="mt-3 text-balance text-4xl font-black tracking-tight text-stone-950 dark:text-white">{product.name}</h1>
          <p className="mt-6 leading-7 text-stone-600 dark:text-slate-300">{product.description}</p>
          <div className="mt-7 flex items-end gap-3"><span className="text-4xl font-black text-stone-950 dark:text-white">৳{product.sellPrice.toLocaleString("en-BD")}</span>{product.originalPrice > product.sellPrice && <del className="pb-1 text-stone-400">৳{product.originalPrice.toLocaleString("en-BD")}</del>}</div>
          <p className="mt-3 text-sm font-bold text-emerald-700 dark:text-emerald-400"><Check className="mr-1 inline" size={15} /> স্টকে আছে ({product.stock} ইউনিট)</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-xl border border-stone-200 dark:border-white/10">
              <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="পরিমাণ কমান" className="grid size-11 place-items-center"><Minus size={15} /></button>
              <span className="w-10 text-center text-lg font-black">{quantity}</span>
              <button onClick={() => setQuantity((value) => Math.min(product.stock || 99, value + 1))} aria-label="পরিমাণ বাড়ান" className="grid size-11 place-items-center"><Plus size={15} /></button>
            </div>
            <Link ref={buyButtonRef} href={checkoutHref} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300"><ShoppingBag size={17} /> এখনই কিনুন</Link>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-500/20 dark:text-emerald-300"><MessageCircle size={17} /> হোয়াটসঅ্যাপে অর্ডার করুন</a>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">{guarantees.map(({ icon: Icon, title, detail }) => <div key={title} className="flex items-start gap-3 rounded-2xl border border-stone-200 p-4 dark:border-white/10"><Icon size={20} className="mt-0.5 shrink-0 text-cyan-600" /><div><p className="text-sm font-bold text-stone-900 dark:text-white">{title}</p><p className="mt-0.5 text-xs text-stone-500">{detail}</p></div></div>)}</div>
        </div>
      </div>
      {specs.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-black text-stone-950 dark:text-white">বিস্তারিত স্পেকস</h2>
          <dl className="mt-6 grid gap-px overflow-hidden rounded-3xl border border-stone-200 bg-stone-200 dark:border-white/10 dark:bg-white/10 sm:grid-cols-2">
            {specs.map(([label, value]) => <div key={label} className="bg-[#fffdf9] p-5 dark:bg-[#0B0F19]"><dt className="text-xs font-bold uppercase tracking-wider text-stone-500">{label}</dt><dd className="mt-1 text-base font-black text-stone-900 dark:text-white">{value}</dd></div>)}
          </dl>
        </section>
      )}
      {featurePairs.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-black text-stone-950 dark:text-white">ফিচার হাইলাইট</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">{featurePairs.map(([label, value]) => <div key={`feat-${label}`} className="rounded-2xl border border-stone-200 bg-[#fffdf9] p-5 dark:border-white/10 dark:bg-[#0B0F19]"><p className="text-sm font-black text-cyan-700 dark:text-cyan-300">{label}</p><p className="mt-1 text-sm leading-6 text-stone-600 dark:text-slate-300">{value}</p></div>)}</div>
        </section>
      )}
      {boxContents.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-black text-stone-950 dark:text-white">প্যাকেজে যা থাকছে</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">{boxContents.map((item) => <li key={item} className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-[#fffdf9] p-4 text-sm font-semibold text-stone-700 dark:border-white/10 dark:bg-[#0B0F19] dark:text-slate-200"><Check size={16} className="shrink-0 text-emerald-500" /> {item}</li>)}</ul>
        </section>
      )}
      {faqList.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-black text-stone-950 dark:text-white">সাধারণ প্রশ্নোত্তর</h2>
          <div className="mt-6 space-y-3">{faqList.map(([question, answer], index) => <details key={question} className="group rounded-2xl border border-stone-200 bg-[#fffdf9] p-5 dark:border-white/10 dark:bg-[#0B0F19]" open={index === 0}><summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-black text-stone-900 dark:text-white"><span>{question}</span><ChevronDown size={18} className="shrink-0 text-stone-400 transition group-open:rotate-180" /></summary><p className="mt-3 text-sm leading-6 text-stone-600 dark:text-slate-300">{answer}</p></details>)}</div>
        </section>
      )}
      {videoUrl && (
        <section className="mt-16">
          <h2 className="text-2xl font-black text-stone-950 dark:text-white">প্রোডাক্ট ভিডিও</h2>
          <div className="mt-6 aspect-video overflow-hidden rounded-3xl border border-stone-200 bg-black dark:border-white/10">
            {youtubeEmbed ? (
              <iframe src={youtubeEmbed} title={`${product.name} ভিডিও`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="size-full" />
            ) : (
              <video controls playsInline preload="metadata" className="size-full object-contain"><source src={videoUrl} /></video>
            )}
          </div>
        </section>
      )}
      {showSticky && (
        <div className="fixed inset-x-0 bottom-16 z-40 mx-auto max-w-md px-4 md:hidden"><a href={checkoutHref} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-6 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/30"><ShoppingBag size={16} /> এখনই কিনুন · ৳{(product.sellPrice * quantity).toLocaleString("en-BD")}</a></div>
      )}
    </>
  );
}