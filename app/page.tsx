import Link from "next/link";
import { ArrowRight, Cable, Fan, Headphones, Monitor, Umbrella, Zap } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/shop/HeroBanner";
import { StorefrontCatalog } from "@/components/shop/StorefrontCatalog";
import { TrustSection } from "@/components/shop/TrustSection";
import { BentoGrid } from "@/components/shop/BentoGrid";
import { getStoreProducts } from "@/lib/catalog-server";
import { prisma } from "@/lib/prisma";

const categoryStyles = [
  [Zap, "from-cyan-600 to-indigo-600"],
  [Fan, "from-cyan-500 to-teal-500"],
  [Cable, "from-violet-500 to-fuchsia-500"],
  [Headphones, "from-amber-500 to-orange-500"],
  [Monitor, "from-blue-600 to-violet-600"],
  [Umbrella, "from-fuchsia-500 to-rose-500"],
] as const;

export default async function Home() {
  const [products, cmsSlides] = await Promise.all([
    getStoreProducts(),
    prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }).catch((error) => { console.error("Hero slide read failed; using fallback:", error); return []; }),
  ]);
  const categories = Array.from(new Set(products.map((product) => product.category)));
  return <><Navbar /><main><HeroBanner cmsSlides={cmsSlides} /><StorefrontCatalog products={products} /><BentoGrid /><section className="mx-auto max-w-7xl px-4 pb-12 sm:px-5 sm:pb-16 lg:px-8 lg:pb-24"><p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-600">আপনার প্রয়োজন অনুযায়ী</p><h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950 dark:text-white">প্রতিদিনের স্মার্ট পছন্দ</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.map((name, index) => { const [Icon, gradient] = categoryStyles[index % categoryStyles.length]; return <Link key={name} href={`/products?category=${encodeURIComponent(name)}`} className={`group relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br ${gradient} p-5 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]`}><Icon className="mb-14 opacity-90" size={28} aria-hidden="true" /><p className="text-lg font-black">{name}</p><p className="mt-1 text-sm text-white/75">কালেকশন দেখুন</p><ArrowRight className="absolute bottom-5 right-5 transition group-hover:translate-x-1" size={18} aria-hidden="true" /></Link>; })}</div></section><TrustSection /></main><Footer /></>;
}
