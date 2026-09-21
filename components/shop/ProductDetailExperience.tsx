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
  { icon: Truck, title: "ক্যাশ অন ডেলিভারি", detail: "পণ্য হাতে পেয়ে পেমেন্ট" },
  { icon: Zap, title: "২৪–৪৮ ঘণ্টায় ডেলিভারি", detail: "সারা দেশে দ্রুত ডেলিভারি" },
  { icon: RotateCcw, title: "৭ দিনের রিপ্লেসমেন্ট", detail: "সহজ এক্সচেঞ্জ সুবিধা" },
  { icon: ShieldCheck, title: "১০০% টেস্টেড ও অরিজিনাল", detail: "যাচাইকৃত কোয়ালিটি" },
];

const features = [
  ["🌪️", "৫-ব্লেড টার্বো এয়ারফ্লো", "শক্তিশালী ও তাৎক্ষণিক শীতল বাতাস"],
  ["🔋", "দীর্ঘস্থায়ী ব্যাটারি ব্যাকআপ", "Type-C ফাস্ট চার্জিংসহ ১০ ঘণ্টা পর্যন্ত ব্যবহার"],
  ["🔇", "শব্দহীন পারফরম্যান্স", "<25dB হুইস্পার-কোয়াইট মোটর"],
  ["🪶", "পকেট পোর্টেবল ডিজাইন", "মাত্র ১৮০ গ্রাম ওজনের কমপ্যাক্ট বডি"],
];

const boxItems = ["১x পকেট টার্বো মিনি ফ্যান", "১x টাইপ-সি চার্জিং ক্যাবল", "১x হ্যান্ডি রিস্ট ল্যানিয়ার্ড", "১x ইউজার গাইড ও ওয়ারেন্টি কার্ড"];
const faqs = [
  ["চার্জ হতে কত সময় লাগে?", "Type-C ফাস্ট চার্জিংয়ের মাধ্যমে প্রায় ২–৩ ঘণ্টায় সম্পূর্ণ চার্জ হয়। চার্জিংয়ের সময় ব্যবহার না করাই নিরাপদ।"],
  ["একবার চার্জে কতক্ষণ চলে?", "ব্যবহারের গতি অনুযায়ী ৪–১০ ঘণ্টা পর্যন্ত ব্যাকআপ পাওয়া যায়। কম স্পিডে ব্যাটারি আরও বেশি সময় চলে।"],
  ["ওয়ারেন্টি বা রিপ্লেসমেন্ট দাবি কীভাবে করব?", "অর্ডার নম্বরসহ আমাদের WhatsApp সাপোর্টে যোগাযোগ করুন। ৭ দিনের মধ্যে ত্রুটি জানালে দ্রুত রিপ্লেসমেন্টের ব্যবস্থা করা হবে।"],
];

export function ProductDetailExperience({ product, whatsappUrl }: Props) {
  const buyButtonRef = useRef<HTMLAnchorElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const button = buyButtonRef.current;
    if (!button) return;
    const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), { threshold: 0.1 });
    observer.observe(button);
    return () => observer.disconnect();
  }, []);

  const checkoutHref = `/checkout?product=${encodeURIComponent(product.id)}&quantity=${quantity}`;

  return (
    <>
      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <ProductGallery name={product.name} images={product.images} accent={product.accent} />
        <div>
          <p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-600">{product.productCode} · {product.category}</p>
          <h1 className="mt-3 text-balance text-4xl font-black tracking-tight text-stone-950 dark:text-white">{product.name}</h1>
          <p className="mt-6 leading-7 text-stone-600 dark:text-slate-300">{product.description}</p>
          <div className="mt-7 flex items-end gap-3"><span className="text-4xl font-black text-stone-950 dark:text-white">৳{product.sellPrice.toLocaleString("en-BD")}</span><del className="pb-1 text-stone-400">৳{product.originalPrice.toLocaleString("en-BD")}</del></div>
          <p className="mt-3 text-sm font-bold text-emerald-700 dark:text-emerald-400"><Check className="mr-1 inline" size={15} /> {product.stock} units available</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <div className="flex items-center rounded-xl border border-[#eae6df] bg-[#fffdf9] dark:border-white/10 dark:bg-slate-900">
              <button type="button" aria-label="পরিমাণ কমান" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid size-11 place-items-center rounded-l-xl transition hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:bg-white/10"><Minus size={15} /></button>
              <span className="w-8 text-center font-bold tabular-nums">{quantity}</span>
              <button type="button" aria-label="পরিমাণ বাড়ান" onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} className="grid size-11 place-items-center rounded-r-xl transition hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:bg-white/10"><Plus size={15} /></button>
            </div>
            <Link ref={buyButtonRef} href={checkoutHref} className="flex-1 rounded-xl bg-cyan-500 px-5 py-3.5 text-center text-sm font-black text-slate-950 transition hover:bg-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-500 active:scale-[0.97]">এখনই কিনুন · ৳{(product.sellPrice * quantity).toLocaleString("en-BD")}</Link>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3.5 text-sm font-black text-emerald-700 transition hover:bg-emerald-500/20 focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-emerald-300"><MessageCircle size={17} /> WhatsApp</a>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {guarantees.map(({ icon: Icon, title, detail }) => <div key={title} className="rounded-2xl border border-[#eae6df] bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.03]"><Icon aria-hidden="true" size={18} className="text-cyan-600" /><p className="mt-2 text-xs font-bold leading-4 text-stone-900 dark:text-white">{title}</p><p className="mt-1 text-[10px] leading-4 text-stone-500 dark:text-slate-400">{detail}</p></div>)}
          </div>
          <div className="mt-8 rounded-2xl border border-[#eae6df] bg-[#fffdf9] p-5 dark:border-white/10 dark:bg-slate-900/70"><h2 className="font-black text-stone-950 dark:text-white">Technical details</h2><dl className="mt-4 divide-y divide-stone-100 dark:divide-white/10">{Object.entries(product.specs).map(([key, value]) => <div key={key} className="flex justify-between gap-4 py-3 text-sm"><dt className="text-stone-500">{key}</dt><dd className="text-right font-bold text-stone-900 dark:text-white">{value}</dd></div>)}</dl></div>
        </div>
      </div>

      <section className="mt-20"><p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-600">Engineered for everyday</p><h2 className="mt-2 text-3xl font-black text-stone-950 dark:text-white">ছোট ডিভাইস, বড় পারফরম্যান্স</h2><div className="mt-7 grid gap-4 sm:grid-cols-2">
        {features.map(([emoji, title, detail], index) => <article key={title} className={`rounded-3xl border border-[#eae6df] bg-[#fffdf9] p-6 shadow-[0_8px_30px_rgba(60,50,40,0.04)] transition duration-200 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-[0_12px_32px_rgba(60,50,40,0.08)] dark:border-white/10 dark:bg-slate-900/70 ${index === 0 ? "sm:row-span-2 sm:flex sm:flex-col sm:justify-between" : ""}`}><span className="text-4xl" aria-hidden="true">{emoji}</span><div className="mt-8"><h3 className="text-xl font-black text-stone-950 dark:text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-stone-600 dark:text-slate-400">{detail}</p></div></article>)}
      </div></section>

      <section className="mt-16 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <div className="rounded-3xl border border-[#eae6df] bg-[#fffdf9] p-6 dark:border-white/10 dark:bg-slate-900/70"><div className="flex items-center gap-3"><ShoppingBag className="text-cyan-600" /><h2 className="text-2xl font-black text-stone-950 dark:text-white">বক্সে যা থাকছে</h2></div><ul className="mt-6 space-y-4">{boxItems.map((item) => <li key={item} className="flex items-center gap-3 text-sm font-semibold text-stone-700 dark:text-slate-300"><Check size={18} className="text-emerald-600" />{item}</li>)}</ul></div>
        <div className="rounded-3xl border border-[#eae6df] bg-[#fffdf9] p-6 dark:border-white/10 dark:bg-slate-900/70"><h2 className="text-2xl font-black text-stone-950 dark:text-white">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2><div className="mt-4 divide-y divide-stone-100 dark:divide-white/10">{faqs.map(([question, answer]) => <details key={question} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-white"><span>{question}</span><ChevronDown aria-hidden="true" size={18} className="shrink-0 transition-transform duration-200 group-open:rotate-180" /></summary><p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 dark:text-slate-400">{answer}</p></details>)}</div></div>
      </section>

      {showSticky && <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#eae6df] bg-[#fbf9f5]/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(60,50,40,0.12)] backdrop-blur-md md:hidden dark:border-white/10 dark:bg-[#080c14]/95"><div className="mx-auto flex max-w-xl items-center gap-3"><div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-cyan-100 p-1 text-2xl dark:bg-cyan-500/10"><ImageOrIcon src={product.images[0] ?? product.icon} alt="" sizes="44px" className="size-full object-contain" /></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-stone-700 dark:text-slate-300">{product.name}</p><p className="font-black text-stone-950 dark:text-white">৳{(product.sellPrice * quantity).toLocaleString("en-BD")}</p></div><Link href={checkoutHref} className="rounded-xl bg-cyan-500 px-4 py-3 text-sm font-black text-slate-950 shadow-[0_0_16px_rgba(6,182,212,0.25)] active:scale-[0.97]">এখনই কিনুন</Link></div></div>}
    </>
  );
}
