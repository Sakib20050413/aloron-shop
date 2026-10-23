"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog";
import { ImageOrIcon } from "@/components/shop/ImageOrIcon";

export type CartLine = { product: CatalogProduct; quantity: number };

export function CartDrawer({
  isOpen,
  onClose,
  lines,
  onChangeQuantity,
}: {
  isOpen: boolean;
  onClose: () => void;
  lines: CartLine[];
  onChangeQuantity: (productId: string, delta: number) => void;
}) {
  const subtotal = lines.reduce((sum, line) => sum + line.product.sellPrice * line.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close cart overlay"
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-5 dark:border-neutral-800">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  SHOPPING BAG // {lines.length} ITEMS
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
                  আপনার শপিং ব্যাগ
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="grid size-9 place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-6 flex-1 space-y-3 overflow-y-auto">
              {lines.length > 0 ? (
                lines.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3.5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60"
                  >
                    <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                      <ImageOrIcon
                        src={product.images[0] ?? product.icon}
                        alt=""
                        sizes="56px"
                        className="size-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-neutral-900 dark:text-white sm:text-sm">
                        {product.name}
                      </p>
                      <p className="font-mono text-xs text-neutral-500">
                        ৳{product.sellPrice.toLocaleString("en-BD")}
                      </p>
                      <div className="mt-2 inline-flex items-center rounded-md border border-neutral-200 dark:border-neutral-700">
                        <button
                          type="button"
                          onClick={() => onChangeQuantity(product.id, -1)}
                          className="grid size-6 place-items-center text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-6 text-center font-mono text-xs font-bold text-neutral-900 dark:text-white">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onChangeQuantity(product.id, 1)}
                          className="grid size-6 place-items-center text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>
                    <p className="font-mono text-xs font-bold text-neutral-900 sm:text-sm dark:text-white">
                      ৳{(product.sellPrice * quantity).toLocaleString("en-BD")}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="grid size-12 place-items-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900">
                    <ShoppingBag size={20} />
                  </div>
                  <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    আপনার ব্যাগ বর্তমানে খালি
                  </p>
                  <Link
                    onClick={onClose}
                    href="/products"
                    className="mt-5 rounded-lg bg-neutral-900 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
                  >
                    গ্যাজেট ব্রাউজ করুন
                  </Link>
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-neutral-100 pt-5 dark:border-neutral-800">
                <div className="mb-4 flex justify-between font-mono text-sm font-bold text-neutral-900 dark:text-white">
                  <span>সাবটোটাল</span>
                  <span>৳{subtotal.toLocaleString("en-BD")}</span>
                </div>
                <Link
                  onClick={onClose}
                  href="/checkout"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                >
                  <span>চেকআউট করুন</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
