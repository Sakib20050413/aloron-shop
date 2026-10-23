"use client";

import { useMemo, useState } from "react";
import type { CatalogProduct } from "@/lib/catalog";
import { CategoryBar } from "@/components/shop/CategoryBar";
import { ProductCard } from "@/components/shop/ProductCard";

export function StorefrontCatalog({ products }: { products: CatalogProduct[] }) {
  const [category, setCategory] = useState("");

  const filtered = useMemo(() => {
    if (!category) return products;
    return products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }, [category, products]);

  return (
    <>
      <CategoryBar active={category} onChange={setCategory} />

      <section id="trending" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200/80 pb-6 dark:border-white/[0.08]">
          <div>
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              FEATURED INVENTORY
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
              {category ? `${category} কালেকশন` : "ট্রেন্ডিং স্মার্ট গ্যাজেট"}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              আপনার দৈনন্দিন লাইফস্টাইলের জন্য নির্বাচিত হাই-গ্রেড প্রযুক্তি।
            </p>
          </div>
          <div className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
            মোট {filtered.length}টি পণ্য উপলব্ধ
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="my-16 rounded-2xl border border-dashed border-neutral-300 dark:border-white/10 py-16 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-neutral-500">
              এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
            </p>
          </div>
        )}
      </section>
    </>
  );
}
