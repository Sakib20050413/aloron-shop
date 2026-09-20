import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

export type ProductCardData = {
  productCode: string;
  name: string;
  slug: string;
  category: string;
  sellPrice: number;
  stock: number;
  icon: string;
  accent: string;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900 dark:hover:shadow-black/20">
      <div className={`relative flex aspect-[1.15] items-center justify-center bg-gradient-to-br ${product.accent}`}>
        <span className="text-7xl transition duration-500 group-hover:scale-110">{product.icon}</span>
        <span className="absolute left-4 top-4 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700">{product.category}</span>
        <button aria-label={`Add ${product.name} to wishlist`} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/85 text-slate-700 transition hover:bg-white hover:text-rose-500"><Heart size={17} /></button>
      </div>
      <div className="p-5">
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-slate-400">{product.productCode}</p>
        <Link href={`/products/${product.slug}`} className="mt-1 block text-lg font-bold text-slate-950 transition hover:text-blue-600 dark:text-white">{product.name}</Link>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div><p className="text-lg font-black text-slate-950 dark:text-white">৳{product.sellPrice.toLocaleString("en-BD")}</p><p className={`text-xs font-semibold ${product.stock > 0 ? "text-emerald-600" : "text-rose-500"}`}>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p></div>
          <Link href={`/products/${product.slug}`} aria-label={`Buy ${product.name}`} className="grid size-10 place-items-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-500"><ShoppingBag size={17} /></Link>
        </div>
      </div>
    </article>
  );
}
