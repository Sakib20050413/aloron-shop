"use client";

import { useMemo, useState } from "react";
import type { CatalogProduct } from "@/lib/catalog";
import { CategoryBar } from "@/components/shop/CategoryBar";
import { ProductCard } from "@/components/shop/ProductCard";

export function StorefrontCatalog({ products }: { products: CatalogProduct[] }) {
  const [category, setCategory] = useState("");
  const filtered = useMemo(() => category ? products.filter((product) => product.category.toLowerCase() === category.toLowerCase()) : products, [category, products]);
  return <><CategoryBar active={category} onChange={setCategory} /><section id="trending" className="mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-16 lg:px-8 lg:py-24"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-600">নির্বাচিত কালেকশন</p><h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl dark:text-white">{category ? `${category} কালেকশন` : "ট্রেন্ডিং গ্যাজেট"}</h2><p className="mt-3 text-stone-500 dark:text-slate-400">আপনার প্রতিদিনের জন্য বেছে নেওয়া স্মার্ট আপগ্রেড।</p></div></div><div className="mt-7 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div>{filtered.length === 0 && <p className="py-16 text-center text-stone-500">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।</p>}</section></>;
}
