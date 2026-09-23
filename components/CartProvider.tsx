"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { CatalogProduct } from "@/lib/catalog";
import { useSafeLocalStorage } from "@/lib/useSafeLocalStorage";
import { useToast } from "@/components/ui/Toast";

export type CartItem = { productId: string; quantity: number };
export type WishlistState = Record<string, boolean>;

type CartContextValue = {
  items: CartItem[];
  wishlist: WishlistState;
  count: number;
  addItem: (product: CatalogProduct) => void;
  removeItem: (productId: string) => void;
  changeQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function sanitizeItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const cleaned: CartItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const candidate = entry as Partial<CartItem>;
    if (typeof candidate.productId !== "string" || !candidate.productId) continue;
    if (seen.has(candidate.productId)) continue;
    const qty = Number(candidate.quantity);
    if (!Number.isFinite(qty) || qty < 1) continue;
    seen.add(candidate.productId);
    cleaned.push({ productId: candidate.productId, quantity: Math.floor(qty) });
  }
  return cleaned;
}

function sanitizeWishlist(raw: unknown): WishlistState {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: WishlistState = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (value === true) out[key] = true;
  }
  return out;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useSafeLocalStorage<CartItem[]>("aloron-cart", []);
  const [wishlist, setWishlist] = useSafeLocalStorage<WishlistState>("aloron-wishlist", {});
  const [hydrated, setHydrated] = useState(false);
  const { showToast } = useToast();

  // Once mounted, scrub any stale/garbage data from localStorage so SSR + CSR agree.
  useMemo(() => {
    if (typeof window === "undefined") return;
    const cleanItems = sanitizeItems(items);
    const cleanWish = sanitizeWishlist(wishlist);
    if (JSON.stringify(cleanItems) !== JSON.stringify(items)) setItems(cleanItems);
    if (JSON.stringify(cleanWish) !== JSON.stringify(wishlist)) setWishlist(cleanWish);
    setHydrated(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addItem = useCallback((product: CatalogProduct) => {
    setItems((prev) => {
      const existing = prev.find((line) => line.productId === product.id);
      if (existing) return prev.map((line) => line.productId === product.id ? { ...line, quantity: line.quantity + 1 } : line);
      return [...prev, { productId: product.id, quantity: 1 }];
    });
    showToast({ type: "success", message: "কার্টে যোগ করা হয়েছে", action: { label: "কার্ট দেখুন", href: "/cart" } });
  }, [setItems, showToast]);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((line) => line.productId !== productId));
  }, [setItems]);

  const changeQuantity = useCallback((productId: string, delta: number) => {
    setItems((prev) => prev.flatMap((line) => {
      if (line.productId !== productId) return [line];
      const nextQty = line.quantity + delta;
      if (nextQty < 1) return [];
      return [{ ...line, quantity: nextQty }];
    }));
  }, [setItems]);

  const clearCart = useCallback(() => setItems([]), [setItems]);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const next = { ...prev };
      if (next[productId]) delete next[productId]; else next[productId] = true;
      return next;
    });
  }, [setWishlist]);

  const count = useMemo(() => hydrated ? items.reduce((sum, line) => sum + line.quantity, 0) : 0, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => ({
    items: hydrated ? items : [],
    wishlist: hydrated ? wishlist : {},
    count,
    addItem, removeItem, changeQuantity, clearCart, toggleWishlist,
  }), [items, wishlist, hydrated, count, addItem, removeItem, changeQuantity, clearCart, toggleWishlist]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}