"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a[href]");
      if (!link || link.getAttribute("target")) return;
      const href = link.getAttribute("href");
      if (!href) return;
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === pathname) {
        setLoading(false);
        if (url.hash) {
          window.requestAnimationFrame(() => document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" }));
        }
        return;
      }
      setLoading(true);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setLoading(false));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <>
      <div aria-hidden="true" className={`fixed inset-x-0 top-0 z-[200] h-0.5 origin-left bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] transition-transform duration-300 ${loading ? "scale-x-75 animate-pulse" : "scale-x-0"}`} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
