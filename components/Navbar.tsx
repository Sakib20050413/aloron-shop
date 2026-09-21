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

type SiteSettingsPreview = { noticeText: string; address: string; contactNumber: string };
const defaultSettings: SiteSettingsPreview = { noticeText: "কুমিল্লাসহ সারাদেশে দ্রুততম হোম ডেলিভারি", address: "কুমিল্লা, বাংলাদেশ", contactNumber: "01615869724" };
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
  const [cartLines, setCartLines] = useState<CartLine[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const productsRef = useRef(products);

  useEffect(() => { productsRef.current = products; }, [products]);
  useEffect(() => {
    let active = true;
    void getCachedSettings().then((settings) => { if (active && settings) setSiteSettings(settings); });
    void getCachedProducts().then((liveProducts) => { if (active && liveProducts.length) setProducts(liveProducts); });
    const addToCart = (event: Event) => {
      const product = productsRef.current.find((item) => item.id === (event as CustomEvent<string>).detail);
      if (!product) return;
      setCartLines((lines) => lines.some((line) => line.product.id === product.id)
        ? lines.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
        : [...lines, { product, quantity: 1 }]);
      setIsCartOpen(true);
    };
    window.addEventListener("aloron:add-to-cart", addToCart);
    return () => { active = false; window.removeEventListener("aloron:add-to-cart", addToCart); };
  }, []);
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
  const cartCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const closeMenu = () => setIsMenuOpen(false);
  const changeQuantity = (productId: string, delta: number) => setCartLines((lines) => lines
    .flatMap((line) => line.product.id === productId ? [{ ...line, quantity: Math.max(0, line.quantity + delta) }] : [line])
    .filter((line) => line.quantity > 0));

  return (
    <>
      <div className="sr-only" aria-live="polite">{siteSettings.noticeText}</div>
      <div className="bg-slate-900 px-5 py-2 text-xs text-slate-300 dark:bg-[#030712]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-5 gap-y-1 lg:px-8">
          <span>কুমিল্লা, বাংলাদেশ</span>
          <div className="flex items-center gap-4"><Link href="/track" className="font-semibold text-cyan-300">অর্ডার ট্র্যাক করুন</Link><a href="tel:01615869724" className="font-semibold text-cyan-300">কল: ০১৬১৫৮৬৯৭২৪</a></div>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-[#eae6df] bg-[#fbf9f5]/85 text-stone-800 shadow-sm backdrop-blur-md transition-colors duration-200 dark:border-slate-800/80 dark:bg-[#080c14]/85 dark:text-slate-200">
        <div className="mx-auto flex h-18 max-w-7xl items-center gap-3 px-4 sm:gap-5 sm:px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="আলোড়ন অনলাইন শপিং হোম">
            {logoFailed ? <span className="font-black text-stone-900 dark:text-white">আলোড়ন অনলাইন শপিং</span> : <Image src="/logo.png" alt="আলোড়ন অনলাইন শপিং" width={168} height={48} priority sizes="168px" className="h-10 w-auto object-contain" onError={() => setLogoFailed(true)} />}
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-stone-600 md:flex dark:text-slate-300">
            <Link href="/#trending" className="transition hover:text-cyan-600">শপ</Link>
            <Link href="/#trending" className="transition hover:text-cyan-600">ট্রেন্ডিং</Link>
            <Link href="/#trust-section" className="transition hover:text-cyan-600">কেন আলোড়ন</Link>
          </nav>
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <button type="button" onClick={() => setIsSearchOpen(true)} aria-label="সার্চ" className="grid size-11 place-items-center rounded-xl text-stone-600 transition hover:bg-[#f0ece1] hover:text-cyan-700 focus-visible:ring-2 focus-visible:ring-cyan-400 dark:text-slate-300 dark:hover:bg-white/10"><Search size={19} /></button>
            <Link href="/wishlist" aria-label="উইশলিস্ট" className="hidden size-11 place-items-center rounded-xl text-stone-600 transition hover:bg-[#f0ece1] hover:text-cyan-700 focus-visible:ring-2 focus-visible:ring-cyan-400 sm:grid dark:text-slate-300 dark:hover:bg-white/10"><Heart size={19} /></Link>
            <button type="button" onClick={() => setIsCartOpen(true)} aria-label="কার্ট খুলুন" className="relative grid size-11 place-items-center rounded-xl text-stone-600 transition hover:bg-[#f0ece1] hover:text-cyan-700 focus-visible:ring-2 focus-visible:ring-cyan-400 dark:text-slate-300 dark:hover:bg-white/10"><ShoppingBag size={19} /><span className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-cyan-400 text-[10px] font-bold text-slate-950">{cartCount}</span></button>
            {sessionStatus === "authenticated" && session?.user ? <div className="relative hidden sm:block"><button type="button" onClick={() => setUserMenuOpen((open) => !open)} aria-expanded={userMenuOpen} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-slate-950"><span className="grid size-7 place-items-center rounded-full bg-cyan-400 text-xs font-black text-slate-950">{session.user.name?.slice(0, 1) ?? "আ"}</span>{session.user.name ?? "প্রোফাইল"}</button><AnimatePresence>{userMenuOpen && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 top-12 z-[70] w-64 rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-2xl dark:bg-[#0b0f19]"><Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-bold text-white hover:bg-slate-800">আমার ড্যাশবোর্ড</Link>{session.user.role === "ADMIN" && <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="block rounded-xl bg-cyan-500 px-3 py-2.5 text-sm font-black text-slate-950 hover:bg-cyan-300">🛡️ অ্যাডমিন প্যানেল (Admin Panel)</Link>}<button type="button" onClick={() => void signOut({ callbackUrl: "/login" })} className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-bold text-rose-300 hover:bg-rose-500/10">লগআউট</button></motion.div>}</AnimatePresence></div> : sessionStatus !== "loading" && <Link href="/login" className="hidden items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-bold text-slate-950 sm:flex"><UserRound size={16} /> লগইন</Link>}
            <button type="button" aria-label={isMenuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)} className="grid size-11 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-cyan-400 dark:text-slate-300 dark:hover:bg-white/10 md:hidden">{isMenuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
      </header>
      <AnimatePresence>{isMenuOpen && <><motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMenu} aria-label="মোবাইল মেনু বন্ধ করুন" className="fixed inset-0 z-[80] bg-slate-950/60 backdrop-blur-sm md:hidden" /><motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }} className="fixed right-0 top-0 z-[90] flex h-full w-[min(88vw,22rem)] flex-col overscroll-contain bg-slate-900 p-5 shadow-2xl md:hidden dark:bg-[#080d1a]" aria-label="মোবাইল নেভিগেশন"><div className="flex items-center justify-between"><p className="text-lg font-black text-white">মেনু</p><button type="button" onClick={closeMenu} aria-label="মোবাইল মেনু বন্ধ করুন" className="grid size-11 place-items-center rounded-xl bg-white/10 text-white focus-visible:ring-2 focus-visible:ring-cyan-400"><X size={20} /></button></div><nav className="mt-8 grid gap-2"><Link onClick={closeMenu} href="/#trending" className="rounded-xl px-4 py-3.5 text-base font-bold text-white transition hover:bg-white/10">শপ ও ক্যাটাগরি</Link><Link onClick={closeMenu} href="/#trending" className="rounded-xl px-4 py-3.5 text-base font-bold text-white transition hover:bg-white/10">ট্রেন্ডিং গ্যাজেট</Link><Link onClick={closeMenu} href="/track" className="rounded-xl px-4 py-3.5 text-base font-bold text-white transition hover:bg-white/10">অর্ডার ট্র্যাক করুন</Link><a onClick={closeMenu} href="https://wa.me/8801615869724" target="_blank" rel="noreferrer" className="rounded-xl px-4 py-3.5 text-base font-bold text-emerald-300 transition hover:bg-emerald-500/10">হোয়াটসঅ্যাপ সাপোর্ট</a>{sessionStatus === "authenticated" ? <>{session.user?.role === "ADMIN" && <Link onClick={closeMenu} href="/admin" className="rounded-xl bg-cyan-500 px-4 py-3.5 text-base font-black text-slate-950">🛡️ অ্যাডমিন প্যানেল (Admin Panel)</Link>}<Link onClick={closeMenu} href="/dashboard" className="rounded-xl px-4 py-3.5 text-base font-bold text-cyan-300 transition hover:bg-cyan-500/10">আমার ড্যাশবোর্ড</Link></> : <Link onClick={closeMenu} href="/login" className="rounded-xl px-4 py-3.5 text-base font-bold text-cyan-300 transition hover:bg-cyan-500/10">লগইন / অ্যাকাউন্ট</Link>}<ThemeToggle mobile /></nav></motion.aside></>}</AnimatePresence>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} lines={cartLines} onChangeQuantity={changeQuantity} />
      <MobileDock cartCount={cartCount} isAdmin={session?.user?.role === "ADMIN"} />
      <AnimatePresence>{isSearchOpen && <><motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSearchOpen(false)} aria-label="সার্চ বন্ধ করুন" className="fixed inset-0 z-[80] bg-slate-950/60 backdrop-blur-sm" /><motion.div initial={{ opacity: 0, y: -20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: .98 }} role="dialog" aria-label="গ্যাজেট সার্চ" className="fixed left-1/2 top-24 z-[90] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-2xl dark:bg-[#0b0f19]"><div className="flex items-center gap-3"><Search className="text-cyan-400" size={20} aria-hidden="true" /><input autoFocus value={search} onChange={(event) => { setSearch(event.target.value); setActiveResult(0); }} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setActiveResult((index) => Math.min(index + 1, results.length - 1)); } else if (event.key === "ArrowUp") { event.preventDefault(); setActiveResult((index) => Math.max(index - 1, 0)); } else if (event.key === "Enter") { event.preventDefault(); openResult(activeResult); } else if (event.key === "Escape") setIsSearchOpen(false); }} placeholder="গ্যাজেট খুঁজুন…" aria-controls="search-results" aria-activedescendant={results[activeResult] ? `search-result-${results[activeResult].id}` : undefined} className="flex-1 bg-transparent text-white outline-none" /><button type="button" onClick={() => setIsSearchOpen(false)} aria-label="সার্চ বন্ধ করুন"><X size={18} className="text-slate-400" /></button></div><div id="search-results" role="listbox" className="mt-4 max-h-80 space-y-2 overflow-y-auto">{results.length ? results.map((product, index) => <Link onMouseEnter={() => setActiveResult(index)} onClick={() => setIsSearchOpen(false)} id={`search-result-${product.id}`} role="option" aria-selected={activeResult === index} key={product.id} href={`/product/${product.slug || product.id}`} className={`flex items-center gap-3 rounded-xl p-3 text-white transition hover:bg-slate-800 ${activeResult === index ? "bg-slate-800" : ""}`}><span className={`grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-gradient-to-br ${product.accent} text-2xl`}>{product.images[0]?.startsWith("/") ? <Image src={product.images[0]} alt="" width={44} height={44} sizes="44px" /> : product.icon}</span><span className="min-w-0 flex-1">      <span className="block truncate font-bold">{highlightMatch(product.name, debouncedSearch)}</span><span className="mt-1 inline-flex rounded-full bg-cyan-400/15 px-2 py-0.5 text-[10px] font-bold text-cyan-300">{product.productCode}</span></span><span className="text-right"><span className="block font-bold">৳{product.sellPrice.toLocaleString("bn-BD")}</span><span className={`text-[10px] font-semibold ${product.stock > 0 ? "text-emerald-300" : "text-rose-300"}`}>{product.stock > 0 ? "স্টকে আছে" : "স্টক শেষ"}</span></span></Link>) : <p className="p-4 text-sm text-slate-400">কোনো গ্যাজেট পাওয়া যায়নি</p>}</div></motion.div></>}</AnimatePresence>
    </>
  );
}
