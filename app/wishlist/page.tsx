"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/shop/ProductCard";
import { useCart } from "@/components/CartProvider";
import type { CatalogProduct } from "@/lib/catalog";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addItem } = useCart();
  const [allProducts, setAllProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: CatalogProduct[]) => setAllProducts(Array.isArray(data) ? data : []))
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const items = allProducts.filter((product) => wishlist[product.id]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-600">Saved for later</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">আমার উইশলিস্ট</h1>
        <p className="mt-3 text-slate-500">আপনার পছন্দের গ্যাজেটগুলো এক জায়গায়।</p>
        {loading ? (
          <div className="mt-10 animate-pulse rounded-3xl border border-slate-200 p-8 text-center dark:border-white/10">
            <p className="text-slate-500">লোড হচ্ছে…</p>
          </div>
        ) : items.length > 0 ? (
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence>
              {items.map((product) => (
                <motion.div layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} key={product.id} className="relative">
                  <ProductCard product={product} />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white/90 text-rose-500 shadow-sm transition hover:bg-rose-50"
                    aria-label={`Remove ${product.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => addItem(product)}
                    className="mt-3 w-full rounded-xl border border-cyan-500 px-4 py-3 text-sm font-black text-cyan-700 transition hover:bg-cyan-500 hover:text-slate-950 dark:text-cyan-300"
                  >
                    কার্টে যোগ করুন
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-white/10">
            <p className="text-lg font-bold">আপনার উইশলিস্ট খালি।</p>
            <p className="mt-2 text-sm text-slate-400">পছন্দের পণ্য সংরক্ষণ করতে পণ্যের কার্ডে থাকা হার্ট আইকনে ক্লিক করুন।</p>
            <Link href="/products" className="mt-6 inline-flex rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-400">
              কালেকশন দেখুন
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
