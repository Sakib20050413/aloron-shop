"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, PackageSearch, ShoppingBag, UserRound } from "lucide-react";

export function MobileDock({ cartCount, isAdmin }: { cartCount: number; isAdmin: boolean }) {
  const pathname = usePathname();

  const handleCategoriesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      document.getElementById("trending")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav
      aria-label="মোবাইল নেভিগেশন"
      className="fixed inset-x-0 bottom-0 z-[55] border-t border-neutral-200/90 bg-white/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur-xl md:hidden dark:border-neutral-800 dark:bg-neutral-950/95"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        <Link
          href="/"
          className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition-colors ${
            isActive("/") && pathname === "/"
              ? "text-neutral-950 dark:text-white"
              : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          }`}
        >
          <Home size={17} aria-hidden="true" />
          <span>হোম</span>
        </Link>
        <Link
          href="/#trending"
          onClick={handleCategoriesClick}
          className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold text-neutral-500 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
        >
          <LayoutGrid size={17} aria-hidden="true" />
          <span>ক্যাটাগরি</span>
        </Link>
        <Link
          href="/checkout"
          className={`relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition-colors ${
            isActive("/checkout")
              ? "text-neutral-950 dark:text-white"
              : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          }`}
        >
          <ShoppingBag size={17} aria-hidden="true" />
          <span>ব্যাগ</span>
          {cartCount > 0 && (
            <span className="absolute right-4 top-1 grid size-4 place-items-center rounded-full bg-neutral-900 font-mono text-[9px] font-bold text-white dark:bg-white dark:text-neutral-900">
              {cartCount}
            </span>
          )}
        </Link>
        <Link
          href="/track"
          className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition-colors ${
            isActive("/track")
              ? "text-neutral-950 dark:text-white"
              : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          }`}
        >
          <PackageSearch size={17} aria-hidden="true" />
          <span>ট্র্যাক</span>
        </Link>
        <Link
          href={isAdmin ? "/admin" : "/dashboard"}
          className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition-colors ${
            isActive(isAdmin ? "/admin" : "/dashboard")
              ? "text-neutral-950 dark:text-white"
              : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          }`}
        >
          <UserRound size={17} aria-hidden="true" />
          <span>{isAdmin ? "অ্যাডমিন" : "অ্যাকাউন্ট"}</span>
        </Link>
      </div>
    </nav>
  );
}
