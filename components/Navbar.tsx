"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { catalogProducts, type CatalogProduct } from "@/lib/catalog";
import { CartDrawer, type CartLine } from "@/components/shop/CartDrawer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { searchProducts } from "@/lib/product-search";
import { MobileDock } from "@/components/MobileDock";
import { useCart } from "@/components/CartProvider";

type SiteSettingsPreview = { noticeText: string; address: string; contactNumber: string };
const defaultSettings: SiteSettingsPreview = { noticeText: "ঢাকা থেকে সারাদেশে দ্রুততম হোম ডেলিভারি", address: "ঢাকা, বাংলাদেশ", contactNumber: "01615869724" };
let settingsRequest: Promise<SiteSettingsPreview | null> | undefined;
let productsRequest: Promise<CatalogProduct[]> | undefined;

function highlightMatch(text: string, query: string) {
  const terms = query.trim().split(/[\s-]+/).filter(Boolean).map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!terms.length) return text;
  return text.split(new RegExp(`(${terms.join("|")})`, "ig")).map((part, index) => terms.some((term) => new RegExp(`^${term}$`, "i").test(part)) ? <mark key={`${part}-${index}`} className="rounded bg-cyan-400/30 px-0.5 text-cyan-100">{part}</mark> : part);
}

function getCachedSettings() {
  settingsRequest ??= fetch("/api/settings", { cache: "force-cache" }).then((response) => response.ok ? response.json() as Promise<SiteSettingsPreview> : null).catch(() => null);
  return settingsRequest;
}

function getCachedProducts() {
  productsRequest ??= fetch("/api/products", { cache: "force-cache" }).then((response) => response.ok ? response.json() as Promise<CatalogProduct[]> : []).catch(() => []);
  return productsRequest;
}

export function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeResult, setActiveResult] = useState(0);
  const [products, setProducts] = useState<CatalogProduct[]>(catalogProducts);
  const [siteSettings, setSiteSettings] = useState(defaultSettings);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const productsRef = useRef(products);
  
  // Connect to unified cart provider
  const { items: cartItems, addItem, changeQuantity: updateCartQty, count: cartCount, wishlist } = useCart();
  const wishlistCount = Object.keys(wishlist || {}).length;

  useEffect(() => { productsRef.current = products; }, [products]);
  useEffect(() => {
    let active = true;
    void getCachedSettings().then((settings) => { if (active && settings) setSiteSettings(settings); });
    void getCachedProducts().then((liveProducts) => { if (active && liveProducts.length) setProducts(liveProducts); });
    
    const addToCartHandler = (event: Event) => {
      const productId = (event as CustomEvent<string>).detail;
      const product = productsRef.current.find((item) => item.id === productId);
      if (!product) return;
      addItem(product);
      setIsCartOpen(true);
    };
    
    window.addEventListener("aloron:add-to-cart", addToCartHandler);
    return () => { 
      active = false; 
      window.removeEventListener("aloron:add-to-cart", addToCartHandler); 
    };
  }, [addItem]);
  
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 180);
    return () => window.clearTimeout(timer);
  }, [search]);

  const results = useMemo(() => {
    return searchProducts(products, debouncedSearch).slice(0, 8);
  }, [products, debouncedSearch]);
  
  const openResult = (index: number) => {
    const product = results[index];
    if (!product) return;
    router.push(`/product/${product.slug || product.id}`);
    setIsSearchOpen(false);
  };
  
  const closeMenu = () => setIsMenuOpen(false);
  
  // Convert cart items to CartLine format for CartDrawer
  const cartLines: CartLine[] = useMemo(() => {
    return cartItems.map(item => {
      const product = products.find(p => p.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    }).filter((line): line is CartLine => line !== null);
  }, [cartItems, products]);
  
  const handleQuantityChange = (productId: string, delta: number) => {
    updateCartQty(productId, delta);
  };

  return (
    <>
      {/* Editorial Announcement Bar */}
      <div className="bg-neutral-950 dark:bg-black border-b border-neutral-800/80 px-4 py-2 text-center text-xs font-medium text-neutral-300 dark:text-neutral-400 tracking-wide">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
          <span>{siteSettings.noticeText || "ঢাকা থেকে সারাদেশে দ্রুততম হোম ডেলিভারি | হটলাইন: ০১৬১৫৮৬৯৭২৪"}</span>
        </div>
      </div>
      
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/80 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#06080d]/85 shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 tracking-tight group">
            <span className="grid size-9 place-items-center rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-black text-sm shadow-sm transition-transform group-hover:scale-105">
              A
            </span>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-neutral-950 dark:text-white leading-none">
                ALORON
              </span>
              <span className="text-[10px] font-bold text-neutral-500 tracking-wider">
                আলোড়ন শপ
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
            <Link href="/products" className="rounded-lg px-3 py-2 transition hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-white/10 dark:hover:text-white">সব গ্যাজেট</Link>
            <Link href="/#trending" className="rounded-lg px-3 py-2 transition hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-white/10 dark:hover:text-white">হিট কালেকশন</Link>
            <Link href="/track" className="rounded-lg px-3 py-2 transition hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-white/10 dark:hover:text-white">অর্ডার ট্র্যাক</Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="সার্চ করুন"
              className="h-10 w-10 flex items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300 transition-all"
            >
              <Search size={18} />
            </button>
            
            <Link
              href="/wishlist"
              aria-label="উইশলিস্ট"
              className="relative hidden md:flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300 transition-all"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="কার্ট দেখুন"
              className="relative h-10 px-3 flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-800 dark:text-neutral-200 transition-all"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-[10px] font-black">
                  {cartCount}
                </span>
              )}
            </button>
            
            {sessionStatus === "authenticated" ? (
              session.user?.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="hidden md:flex h-10 px-4 rounded-xl font-bold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 items-center gap-1.5 transition-all text-xs shadow-sm"
                >
                  🛡️ অ্যাডমিন
                </Link>
              ) : (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="h-10 px-3.5 flex items-center gap-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300 transition-all text-xs font-semibold"
                >
                  <UserRound size={18} />
                  <span className="hidden lg:inline max-w-[80px] truncate">{session.user?.name || "অ্যাকাউন্ট"}</span>
                </button>
              )
            ) : (
              <Link
                href="/login"
                className="hidden md:flex h-10 px-4 rounded-xl font-bold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 items-center transition-all text-xs shadow-sm"
              >
                লগইন / সাইন আপ
              </Link>
            )}
            
            <ThemeToggle />
            
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="মেনু খুলুন"
              className="md:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 transition-all hover:border-neutral-400 dark:hover:border-neutral-600"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
        
        {/* User Dropdown */}
        <AnimatePresence>
          {userMenuOpen && sessionStatus === "authenticated" && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-4 top-16 z-50 w-48 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
              <Link href="/dashboard" className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">আমার ড্যাশবোর্ড</Link>
              {session.user?.role === "ADMIN" && (
                <Link href="/admin" className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800">অ্যাডমিন প্যানেল</Link>
              )}
              <button onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }} className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20">লগআউট</button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMenu} aria-label="মেনু বন্ধ করুন" className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm md:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed left-0 top-0 z-[75] h-full w-72 border-r border-neutral-800 bg-neutral-950 p-6 shadow-2xl md:hidden">
              <div className="mb-6 flex items-center justify-between border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded bg-white text-xs font-black text-neutral-950">A</span>
                  <span className="text-base font-bold tracking-tight text-white">আলোড়ন শপ</span>
                </div>
                <button onClick={closeMenu} aria-label="মেনু বন্ধ করুন" className="text-neutral-400 hover:text-white"><X size={20} /></button>
              </div>
              <nav className="space-y-1">
                <Link onClick={closeMenu} href="/products" className="block rounded-lg px-3 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-200 transition hover:bg-white/10 hover:text-white">সব গ্যাজেট</Link>
                <Link onClick={closeMenu} href="/#trending" className="block rounded-lg px-3 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-200 transition hover:bg-white/10 hover:text-white">হিট কালেকশন</Link>
                <Link onClick={closeMenu} href="/track" className="block rounded-lg px-3 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-200 transition hover:bg-white/10 hover:text-white">অর্ডার ট্র্যাক</Link>
                <a onClick={closeMenu} href="https://wa.me/8801615869724" target="_blank" rel="noreferrer" className="block rounded-lg px-3 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400 transition hover:bg-emerald-500/10">হোয়াটসঅ্যাপ সাপোর্ট</a>
                
                {sessionStatus === "authenticated" ? (
                  <>
                    {session.user?.role === "ADMIN" && (
                      <Link onClick={closeMenu} href="/admin" className="block rounded-lg bg-white px-3 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-neutral-950">🛡️ অ্যাডমিন প্যানেল</Link>
                    )}
                    <Link onClick={closeMenu} href="/dashboard" className="block rounded-lg px-3 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-200 transition hover:bg-white/10">আমার ড্যাশবোর্ড</Link>
                  </>
                ) : (
                  <Link onClick={closeMenu} href="/login" className="block rounded-lg px-3 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-200 transition hover:bg-white/10">লগইন / রেজিস্টার</Link>
                )}
                
                <div className="pt-4">
                  <ThemeToggle mobile />
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      
      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} lines={cartLines} onChangeQuantity={handleQuantityChange} />
      
      {/* Mobile Dock with reactive cart count */}
      <MobileDock cartCount={cartCount} isAdmin={session?.user?.role === "ADMIN"} />
      
      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSearchOpen(false)} aria-label="সার্চ বন্ধ করুন" className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: -20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: .98 }} role="dialog" aria-label="গ্যাজেট সার্চ" className="fixed left-1/2 top-20 z-[90] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
              <div className="flex items-center gap-3 border-b border-neutral-100 pb-3 dark:border-neutral-800">
                <Search className="text-neutral-500" size={18} aria-hidden="true" />
                <input autoFocus value={search} onChange={(event) => { setSearch(event.target.value); setActiveResult(0); }} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setActiveResult((index) => Math.min(index + 1, results.length - 1)); } else if (event.key === "ArrowUp") { event.preventDefault(); setActiveResult((index) => Math.max(index - 1, 0)); } else if (event.key === "Enter") { event.preventDefault(); openResult(activeResult); } else if (event.key === "Escape") setIsSearchOpen(false); }} placeholder="গ্যাজেট সার্চ করুন (যেমন: QCY, GaN, টাইপ-সি)…" aria-controls="search-results" aria-activedescendant={results[activeResult] ? `search-result-${results[activeResult].id}` : undefined} className="flex-1 bg-transparent font-mono text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white" />
                <button type="button" onClick={() => setIsSearchOpen(false)} aria-label="সার্চ বন্ধ করুন" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white"><X size={18} /></button>
              </div>
              <div id="search-results" role="listbox" className="mt-3 max-h-80 space-y-1.5 overflow-y-auto">
                {results.length ? results.map((product, index) => (
                  <Link onMouseEnter={() => setActiveResult(index)} onClick={() => setIsSearchOpen(false)} id={`search-result-${product.id}`} role="option" aria-selected={activeResult === index} key={product.id} href={`/product/${product.slug || product.id}`} className={`flex items-center gap-3 rounded-xl p-2.5 transition ${activeResult === index ? "bg-neutral-100 dark:bg-neutral-900" : "hover:bg-neutral-50 dark:hover:bg-neutral-900/60"}`}>
                    <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-neutral-200 bg-white p-1 text-xl dark:border-neutral-700 dark:bg-neutral-800">
                      {product.images[0]?.startsWith("/") ? <Image src={product.images[0]} alt="" width={40} height={40} sizes="40px" className="size-full object-contain" /> : product.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-bold text-neutral-900 dark:text-white">{highlightMatch(product.name, debouncedSearch)}</span>
                      <span className="font-mono text-[10px] text-neutral-500">{product.productCode}</span>
                    </span>
                    <span className="text-right">
                      <span className="block font-mono text-xs font-bold text-neutral-900 dark:text-white">৳{product.sellPrice.toLocaleString("en-BD")}</span>
                      <span className={`font-mono text-[10px] ${product.stock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>{product.stock > 0 ? "স্টকে আছে" : "স্টক শেষ"}</span>
                    </span>
                  </Link>
                )) : <p className="p-4 text-center font-mono text-xs text-neutral-400">কোনো গ্যাজেট পাওয়া যায়নি</p>}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}