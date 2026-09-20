"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/shop/ProductCard";
import { catalogProducts } from "@/lib/catalog";

export default function WishlistPage() {
  const [items, setItems] = useState(catalogProducts.slice(0, 2));
  return <><Navbar /><main className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-600">Saved for later</p><h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">আমার উইশলিস্ট</h1><p className="mt-3 text-slate-500">আপনার পছন্দের গ্যাজেটগুলো এক জায়গায়।</p>{items.length ? <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><AnimatePresence>{items.map((product) => <motion.div layout initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .8 }} key={product.id} className="relative"><ProductCard product={product} /><button onClick={() => setItems((current) => current.filter((item) => item.id !== product.id))} className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white/90 text-rose-500 shadow-sm" aria-label={`Remove ${product.name}`}><Trash2 size={16} /></button><button onClick={() => window.dispatchEvent(new CustomEvent("aloron:add-to-cart", { detail: product.id }))} className="mt-3 w-full rounded-xl border border-cyan-500 px-4 py-3 text-sm font-black text-cyan-700 transition hover:bg-cyan-500 hover:text-slate-950 dark:text-cyan-300">কার্টে যোগ করুন</button></motion.div>)}</AnimatePresence></div> : <div className="mt-10 rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-white/10">আপনার উইশলিস্ট এখনো খালি।</div>}</main></>;
}
