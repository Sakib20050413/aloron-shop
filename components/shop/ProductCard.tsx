"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import type { CatalogProduct } from "@/lib/catalog";
import { ImageOrIcon } from "@/components/shop/ImageOrIcon";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const [remaining, setRemaining] = useState(2 * 60 * 60 + 47 * 60);
  useEffect(() => {
    const interval = window.setInterval(() => setRemaining((value) => (value > 0 ? value - 1 : 2 * 60 * 60 + 47 * 60)), 1000);
    return () => window.clearInterval(interval);
  }, []);
  const hours = Math.floor(remaining / 3600).toString().padStart(2, "0");
  const minutes = Math.floor((remaining % 3600) / 60).toString().padStart(2, "0");
  const seconds = (remaining % 60).toString().padStart(2, "0");
  const whatsappText = `আসসালামু আলাইকুম, আমি আলোড়ন অনলাইন শপিং থেকে ${product.name} (Code: ${product.productCode}) অর্ডার করতে চাই। ডেলিভারি ডিটেইলস...`;
  const whatsappUrl = `https://wa.me/8801615869724?text=${encodeURIComponent(whatsappText)}`;
  return (
    <motion.article whileHover={{ scale: 1.03, y: -6 }} whileTap={{ scale: 0.94 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} style={{ perspective: 1000 }} className="group overflow-hidden rounded-2xl border border-[#eae6df] bg-[#fffdf9]/90 shadow-[0_8px_30px_rgba(60,50,40,0.04)] backdrop-blur-md transition hover:border-cyan-400/60 hover:shadow-[0_12px_32px_rgba(60,50,40,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-sm">
      <div className={`relative flex aspect-[1.15] items-center justify-center bg-gradient-to-br ${product.accent}`}>
        <motion.div whileHover={{ scale: 1.05, rotate: 2 }} className="h-[78%] w-[78%]"><ImageOrIcon src={product.images[0] ?? product.icon} alt={product.name} sizes="(max-width: 640px) 42vw, 260px" className="size-full object-contain drop-shadow-2xl" /></motion.div>
        <span className="absolute left-4 top-4 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700">{product.category}</span>
        {product.id === "pocket-turbo-mini-fan" && <span className="absolute right-4 top-4 rounded-full bg-[#030712]/85 px-2.5 py-1 text-[10px] font-black text-cyan-200">আজকের লিমিটেড ডিল · {hours}:{minutes}:{seconds}</span>}
        <motion.span animate={{ boxShadow: ["0 0 0 0 rgba(245,158,11,.35)", "0 0 0 7px rgba(245,158,11,0)", "0 0 0 0 rgba(245,158,11,0)"] }} transition={{ duration: 2.2, repeat: Infinity }} className="absolute bottom-3 left-3 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black text-slate-950">১০% ছাড়</motion.span>
        {product.stock < 20 && <motion.span animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.4, repeat: Infinity }} className="absolute bottom-3 right-3 rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-black text-white">স্টক সীমিত</motion.span>}
        <button aria-label={`Add ${product.name} to wishlist`} className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-slate-950/80 text-slate-200 transition duration-150 hover:text-cyan-300 hover:shadow-[0_0_16px_rgba(6,182,212,0.25)] active:scale-[0.97]"><Heart size={17} /></button>
      </div>
      <div className="p-3 sm:p-5">
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-slate-400">{product.productCode}</p>
        <Link href={`/product/${product.id}`} className="mt-1 block line-clamp-2 text-sm font-bold text-stone-900 transition hover:text-cyan-700 sm:text-lg dark:text-white">{product.name}</Link>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="min-w-0"><div className="flex flex-wrap items-center gap-1.5"><p className="text-base font-black text-stone-900 sm:text-lg dark:text-white">৳{product.sellPrice.toLocaleString("en-BD")}</p><del className="text-[10px] text-stone-500 sm:text-xs">৳{product.originalPrice.toLocaleString("en-BD")}</del></div><p className={`text-[10px] font-semibold sm:text-xs ${product.stock > 0 ? "text-emerald-700" : "text-rose-600"}`}>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p><span className="mt-1 inline-flex rounded-full bg-cyan-500/10 px-2 py-0.5 text-[9px] font-bold text-cyan-700 dark:text-cyan-300">২৪–৪৮ ঘণ্টা</span></div>
          <div className="flex items-center gap-2">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label={`Order ${product.name} on WhatsApp`} className="grid size-10 place-items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 transition hover:bg-emerald-500/20"><span className="text-sm font-black">WA</span></a>
            <Link href={`/checkout?product=${product.id}`} aria-label={`Buy ${product.name}`} className="grid size-11 place-items-center rounded-xl bg-cyan-500 text-slate-950 transition duration-150 hover:bg-cyan-300 hover:shadow-[0_0_16px_rgba(6,182,212,0.25)] active:scale-[0.97]"><ShoppingBag size={17} /></Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
