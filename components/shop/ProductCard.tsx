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
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-[#11141b] shadow-sm hover:shadow-xl transition-all duration-300 hover:border-neutral-400 dark:hover:border-neutral-700"
    >
      {/* Clickable Overlay Link */}
      <Link
        href={`/product/${product.slug || product.id}`}
        aria-label={`View details for ${product.name}`}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-white"
      />

      {/* Product Visual Studio Frame */}
      <div className="relative flex aspect-[1/1] items-center justify-center overflow-hidden bg-neutral-50 dark:bg-[#0c0e14] p-5">
        <div className="relative h-full w-full flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105">
          <ImageOrIcon
            src={product.images[0] ?? product.icon}
            alt={product.name}
            sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 280px"
            className="size-full object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_12px_25px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* Minimal Category Tag */}
        <span className="absolute left-3 top-3 rounded-md bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.15em] text-neutral-600 dark:text-neutral-400 backdrop-blur-sm">
          {product.category}
        </span>

        {/* Dynamic Discount Tag */}
        {discountPercent > 0 && (
          <span className="absolute bottom-3 left-3 rounded-md bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-2 py-0.5 text-[10px] font-black tracking-tight shadow-sm">
            -{discountPercent}%
          </span>
        )}

        {/* Stock Alert Badge */}
        {product.stock > 0 && product.stock <= 15 ? (
          <span className="absolute bottom-3 right-3 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 text-[9px] font-bold">
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
          className={`absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-lg border transition-all duration-200 active:scale-95 ${
            isWishlisted
              ? "border-rose-500/40 bg-rose-50 dark:bg-rose-950/40 text-rose-500"
              : "border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 text-neutral-500 hover:text-rose-500"
          }`}
        >
          <Heart size={15} className={isWishlisted ? "fill-rose-500 text-rose-500" : ""} />
        </button>
      </div>

      {/* Product Content & Pricing */}
      <div className="relative z-10 flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between gap-2 text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
            <span>{product.productCode}</span>
            <span className="inline-flex items-center gap-1 font-sans text-emerald-600 dark:text-emerald-400 font-semibold">
              <Check size={11} /> {product.stock > 0 ? "স্টকে আছে" : "স্টক শেষ"}
            </span>
          </div>

          <h3 className="mt-2 line-clamp-2 text-sm sm:text-base font-bold text-neutral-900 dark:text-white leading-snug group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="mt-3 flex flex-wrap items-baseline gap-2">
            <span className="text-lg sm:text-xl font-black text-neutral-950 dark:text-white tracking-tight">
              ৳{product.sellPrice.toLocaleString("en-BD")}
            </span>
            {product.originalPrice > product.sellPrice && (
              <del className="text-xs font-semibold text-neutral-400">
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

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2">
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-3 py-2 text-xs sm:text-sm font-bold shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              <Zap size={14} className="fill-current" />
              এখনই কিনুন
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Order ${product.name} on WhatsApp`}
              onClick={(event) => event.stopPropagation()}
              className="flex size-10 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 transition-all duration-200 hover:bg-emerald-500 hover:text-white active:scale-[0.98]"
              title="হোয়াটসঅ্যাপে অর্ডার করুন"
            >
              <MessageCircle size={16} />
            </a>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-all duration-200 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900 active:scale-[0.98]"
          >
            <ShoppingBag size={13} />
            কার্টে যোগ করুন
          </button>
        </div>
      </div>
    </motion.article>
  );
}
