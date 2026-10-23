"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="border-b border-neutral-200/80 pb-6 dark:border-neutral-800">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            SAVED HARDWARE // WISHLIST
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
            আমার পছন্দের গ্যাজেট তালিকা
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            আপনার পছন্দের স্মার্ট গ্যাজেটগুলো পরবর্তীতে ক্রয়ের জন্য সংরক্ষিত।
          </p>
        </div>

        {loading ? (
          <div className="mt-10 rounded-2xl border border-neutral-200 p-12 text-center dark:border-neutral-800">
            <p className="font-mono text-xs uppercase tracking-wider text-neutral-500">লোড হচ্ছে…</p>
          </div>
        ) : items.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            <AnimatePresence>
              {items.map((product) => (
                <motion.div layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} key={product.id} className="relative flex flex-col justify-between">
                  <ProductCard product={product} />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className="grid size-9 shrink-0 place-items-center rounded-lg border border-neutral-200 bg-white text-rose-500 transition hover:bg-rose-50 dark:border-neutral-700 dark:bg-neutral-800"
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => addItem(product)}
                      className="min-h-9 flex-1 rounded-lg border border-neutral-900 bg-neutral-900 px-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-neutral-900"
                    >
                      কার্টে নিন
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 p-12 text-center text-neutral-500 dark:border-neutral-800">
            <p className="font-mono text-xs uppercase tracking-wider text-neutral-500">আপনার পছন্দের তালিকা বর্তমানে খালি</p>
            <p className="mt-1 text-xs text-neutral-400">পছন্দের পণ্য সংরক্ষণ করতে পণ্যের কার্ডে থাকা হার্ট আইকনে ট্যাপ করুন।</p>
            <Link
              href="/products"
              className="mt-6 inline-flex rounded-lg bg-neutral-900 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-900"
            >
              কালেকশন দেখুন
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
