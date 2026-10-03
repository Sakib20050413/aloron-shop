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
  const [logoFailed, setLogoFailed] = useState(false);
  const [products, setProducts] = useState<CatalogProduct[]>(catalogProducts);
  const [siteSettings, setSiteSettings] = useState(defaultSettings);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const productsRef = useRef(products);
  
  // Connect to unified cart provider
  const { items: cartItems, addItem, changeQuantity: updateCartQty, count: cartCount } = useCart();

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
      <div className="sr-only" aria-live="polite">{siteSettings.noticeText}</div>
      
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 border-b border-[#eae6df] bg-[#fbf9f5]/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#080c14]/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-black tracking-tight text-stone-900 dark:text-white">
            {!logoFailed ? (
              <Image src="/logo.png" alt="Aloron Shop" width={32} height={32} onError={() => setLogoFailed(true)} />
            ) : (
              <ShoppingBag size={24} className="text-cyan-600" />
            )}
            <span className="hidden sm:inline">Aloron</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-bold text-stone-700 dark:text-slate-300">
            <Link href="/products" className="rounded-lg px-3 py-2 transition hover:bg-stone-100 hover:text-cyan-700 dark:hover:bg-white/10">শপ ও ক্যাটাগরি</Link>
            <Link href="/#trending" className="rounded-lg px-3 py-2 transition hover:bg-stone-100 hover:text-cyan-700 dark:hover:bg-white/10">ট্রেন্ডিং গেজেট</Link>
            <Link href="/track" className="rounded-lg px-3 py-2 transition hover:bg-stone-100 hover:text-cyan-700 dark:hover:bg-white/10">অর্ডার ট্র্যাক করুন</Link>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setIsSearchOpen(true)} aria-label="সার্চ করুন" className="grid size-10 place-items-center rounded-full text-stone-700 transition hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-white/10">
              <Search size={20} />
            </button>
            
            <Link href="/wishlist" aria-label="উইশলিস্ট" className="relative hidden md:block grid size-10 place-items-center rounded-full text-stone-700 transition hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-white/10">
              <Heart size={20} />
            </Link>
            
            <button onClick={() => setIsCartOpen(true)} aria-label="কার্ট দেখুন" className="relative grid size-10 place-items-center rounded-full text-stone-700 transition hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-white/10">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-cyan-500 text-[10px] font-black text-slate-950">
                  {cartCount}
                </span>
              )}
            </button>
            
            {sessionStatus === "authenticated" ? (
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="grid size-10 place-items-center rounded-full text-stone-700 transition hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-white/10">
                <UserRound size={20} />
              </button>
            ) : (
              <Link href="/login" className="hidden md:flex items-center gap-1 rounded-full bg-cyan-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-400">
                লগইন / অ্যাকাউন্ট
              </Link>
            )}
            
            <ThemeToggle />
            
            <button onClick={() => setIsMenuOpen(true)} aria-label="মেনু খুলুন" className="md:hidden grid size-10 place-items-center rounded-full text-stone-700 transition hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-white/10">
              <Menu size={20} />
            </button>
          </div>
        </div>
        
        {/* User Dropdown */}
        <AnimatePresence>
          {userMenuOpen && sessionStatus === "authenticated" && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-4 top-16 z-50 w-48 rounded-xl border border-stone-200 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-[#0b0f19]">
              <Link href="/dashboard" className="block rounded-lg px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-white/10">আমার ড্যাশবোর্ড</Link>
              {session.user?.role === "ADMIN" && (
                <Link href="/admin" className="block rounded-lg px-3 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-900/20">অ্যাডমিন প্যানেল</Link>
              )}
              <button onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }} className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20">লগআউট</button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMenu} aria-label="মেনু বন্ধ করুন" className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-sm md:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed left-0 top-0 z-[75] h-full w-72 bg-slate-900 p-6 shadow-2xl md:hidden">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-black text-white">Aloron</h2>
                <button onClick={closeMenu} aria-label="মেনু বন্ধ করুন"><X size={24} className="text-white" /></button>
              </div>
              <nav className="space-y-1">
                <Link onClick={closeMenu} href="/products" className="block rounded-xl px-4 py-3.5 text-base font-bold text-white transition hover:bg-white/10">শপ ও ক্যাটাগরি</Link>
                <Link onClick={closeMenu} href="/#trending" className="block rounded-xl px-4 py-3.5 text-base font-bold text-white transition hover:bg-white/10">ট্রেন্ডিং গেজেট</Link>
                <Link onClick={closeMenu} href="/track" className="block rounded-xl px-4 py-3.5 text-base font-bold text-white transition hover:bg-white/10">অর্ডার ট্র্যাক করুন</Link>
                <a onClick={closeMenu} href="https://wa.me/8801615869724" target="_blank" rel="noreferrer" className="block rounded-xl px-4 py-3.5 text-base font-bold text-emerald-300 transition hover:bg-emerald-500/10">হোয়াটসঅ্যাপ সাপোর্ট</a>
                
                {sessionStatus === "authenticated" ? (
                  <>
                    {session.user?.role === "ADMIN" && (
                      <Link onClick={closeMenu} href="/admin" className="block rounded-xl bg-cyan-500 px-4 py-3.5 text-base font-black text-slate-950">🛡️ অ্যাডমিন প্যানেল (Admin Panel)</Link>
                    )}
                    <Link onClick={closeMenu} href="/dashboard" className="block rounded-xl px-4 py-3.5 text-base font-bold text-cyan-300 transition hover:bg-cyan-500/10">আমার ড্যাশবোর্ড</Link>
                  </>
                ) : (
                  <Link onClick={closeMenu} href="/login" className="block rounded-xl px-4 py-3.5 text-base font-bold text-cyan-300 transition hover:bg-cyan-500/10">লগইন / অ্যাকাউন্ট</Link>
                )}
                
                <ThemeToggle mobile />
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
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSearchOpen(false)} aria-label="সার্চ বন্ধ করুন" className="fixed inset-0 z-[80] bg-slate-950/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: -20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: .98 }} role="dialog" aria-label="গেজেট সার্চ" className="fixed left-1/2 top-24 z-[90] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-2xl dark:bg-[#0b0f19]">
              <div className="flex items-center gap-3">
                <Search className="text-cyan-400" size={20} aria-hidden="true" />
                <input autoFocus value={search} onChange={(event) => { setSearch(event.target.value); setActiveResult(0); }} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setActiveResult((index) => Math.min(index + 1, results.length - 1)); } else if (event.key === "ArrowUp") { event.preventDefault(); setActiveResult((index) => Math.max(index - 1, 0)); } else if (event.key === "Enter") { event.preventDefault(); openResult(activeResult); } else if (event.key === "Escape") setIsSearchOpen(false); }} placeholder="গেজেট খুঁজুন…" aria-controls="search-results" aria-activedescendant={results[activeResult] ? `search-result-${results[activeResult].id}` : undefined} className="flex-1 bg-transparent text-white outline-none" />
                <button type="button" onClick={() => setIsSearchOpen(false)} aria-label="সার্চ বন্ধ করুন"><X size={18} className="text-slate-400" /></button>
              </div>
              <div id="search-results" role="listbox" className="mt-4 max-h-80 space-y-2 overflow-y-auto">
                {results.length ? results.map((product, index) => (
                  <Link onMouseEnter={() => setActiveResult(index)} onClick={() => setIsSearchOpen(false)} id={`search-result-${product.id}`} role="option" aria-selected={activeResult === index} key={product.id} href={`/product/${product.slug || product.id}`} className={`flex items-center gap-3 rounded-xl p-3 text-white transition hover:bg-slate-800 ${activeResult === index ? "bg-slate-800" : ""}`}>
                    <span className={`grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-gradient-to-br ${product.accent} text-2xl`}>
                      {product.images[0]?.startsWith("/") ? <Image src={product.images[0]} alt="" width={44} height={44} sizes="44px" /> : product.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold">{highlightMatch(product.name, debouncedSearch)}</span>
                      <span className="mt-1 inline-flex rounded-full bg-cyan-400/15 px-2 py-0.5 text-[10px] font-bold text-cyan-300">{product.productCode}</span>
                    </span>
                    <span className="text-right">
                      <span className="block font-bold">৳{product.sellPrice.toLocaleString("bn-BD")}</span>
                      <span className={`text-[10px] font-semibold ${product.stock > 0 ? "text-emerald-300" : "text-rose-300"}`}>{product.stock > 0 ? "স্টকে আছে" : "স্টক শেষ"}</span>
                    </span>
                  </Link>
                )) : <p className="p-4 text-sm text-slate-400">কোনো গেজেট পাওয়া যায়নি</p>}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}