"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Heart, MessageCircle, ShoppingBag, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import type { CatalogProduct } from "@/lib/catalog";
import { ImageOrIcon } from "@/components/shop/ImageOrIcon";
import { useCart } from "@/components/CartProvider";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const router = useRouter();
  const { wishlist, toggleWishlist, addItem } = useCart();
  const isWishlisted = Boolean(wishlist[product.id]);

  const discountPercent = product.originalPrice > product.sellPrice
    ? Math.max(1, Math.round(((product.originalPrice - product.sellPrice) / product.originalPrice) * 100))
    : 0;

  const savings = Math.max(0, product.originalPrice - product.sellPrice);

  const whatsappText = `আসসালামু আলাইকুম, আমি আলোড়ন অনলাইন শপিং থেকে ${product.name} (কোড: ${product.productCode}, মূল্য: ৳${product.sellPrice.toLocaleString("en-BD")}) অর্ডার করতে চাই।`;
  const whatsappUrl = `https://wa.me/8801615869724?text=${encodeURIComponent(whatsappText)}`;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/checkout?product=${encodeURIComponent(product.slug || product.id)}&quantity=1`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addItem(product);
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#eae6df] bg-[#fffdf9]/95 shadow-[0_8px_30px_rgba(60,50,40,0.04)] backdrop-blur-md transition-all duration-300 hover:border-cyan-500/60 hover:shadow-[0_16px_36px_rgba(6,182,212,0.12)] dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-none"
    >
      {/* Clickable Card Overlay */}
      <Link
        href={`/product/${product.slug || product.id}`}
        aria-label={`View details for ${product.name}`}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
      />

      {/* Top Media Container */}
      <div className={`relative flex aspect-square sm:aspect-[1.1] items-center justify-center overflow-hidden bg-gradient-to-br ${product.accent || "from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900"} p-4`}>
        <div className="relative h-full w-full flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105">
          <ImageOrIcon
            src={product.images[0] ?? product.icon}
            alt={product.name}
            sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 280px"
            className="size-full object-contain drop-shadow-xl"
          />
        </div>

        {/* Category Badge */}
        <span className="absolute left-3 top-3 rounded-lg border border-stone-200/80 bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-700 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-800/90 dark:text-cyan-400">
          {product.category}
        </span>

        {/* Dynamic Discount Pill */}
        {discountPercent > 0 && (
          <span className="absolute bottom-3 left-3 rounded-lg bg-amber-400 px-2.5 py-1 text-[10px] font-black text-slate-950 shadow-sm">
            {discountPercent}% ছাড়
          </span>
        )}

        {/* Stock Alert */}
        {product.stock > 0 && product.stock <= 15 ? (
          <span className="absolute bottom-3 right-3 rounded-lg bg-rose-500/90 px-2 py-0.5 text-[9px] font-black text-white backdrop-blur-sm">
            সীমিত স্টক
          </span>
        ) : null}

        {/* Wishlist Button */}
        <button
          type="button"
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-xl border transition-all duration-200 active:scale-95 ${
            isWishlisted
              ? "border-rose-500/50 bg-rose-500/10 text-rose-500"
              : "border-stone-200/80 bg-white/90 text-stone-600 hover:text-rose-500 hover:border-rose-400/50 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-300"
          }`}
        >
          <Heart size={16} className={isWishlisted ? "fill-rose-500 text-rose-500" : ""} />
        </button>
      </div>

      {/* Content & Details */}
      <div className="relative z-10 flex flex-1 flex-col justify-between p-3.5 sm:p-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[.18em] text-cyan-700 dark:text-cyan-400">
              {product.productCode}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <Check size={12} /> {product.stock > 0 ? "স্টকে আছে" : "স্টক শেষ"}
            </span>
          </div>

          <h3 className="mt-1.5 line-clamp-2 text-sm sm:text-base font-black text-stone-900 group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-400 transition-colors">
            {product.name}
          </h3>

          {/* Pricing Box */}
          <div className="mt-3 flex flex-wrap items-baseline gap-2">
            <span className="text-lg sm:text-xl font-black text-stone-950 dark:text-white">
              ৳{product.sellPrice.toLocaleString("en-BD")}
            </span>
            {product.originalPrice > product.sellPrice && (
              <del className="text-xs font-semibold text-stone-400 dark:text-slate-500">
                ৳{product.originalPrice.toLocaleString("en-BD")}
              </del>
            )}
            {savings > 0 && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                (৳{savings} সাশ্রয়)
              </span>
            )}
          </div>
        </div>

        {/* Action Button Row */}
        <div className="mt-4 pt-3 border-t border-[#eae6df] dark:border-white/10 space-y-2">
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-3 py-2 text-xs sm:text-sm font-black text-slate-950 shadow-md shadow-cyan-500/20 transition-all duration-200 hover:from-cyan-400 hover:to-cyan-500 active:scale-[0.97]"
            >
              <Zap size={14} className="fill-slate-950" />
              এখনই কিনুন
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Order ${product.name} on WhatsApp`}
              onClick={(event) => event.stopPropagation()}
              className="flex size-10 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 transition-all duration-200 hover:bg-emerald-500 hover:text-white active:scale-[0.97] dark:text-emerald-400"
              title="হোয়াটসঅ্যাপে সরাসরি অর্ডার করুন"
            >
              <MessageCircle size={17} />
            </a>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-stone-300/80 bg-white/80 py-1.5 text-xs font-bold text-stone-700 transition-all duration-200 hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-700 active:scale-[0.98] dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-cyan-950/30 dark:hover:text-cyan-300"
          >
            <ShoppingBag size={14} />
            কার্টে যোগ করুন
          </button>
        </div>
      </div>
    </motion.article>
  );
}
