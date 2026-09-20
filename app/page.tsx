import Link from "next/link";
import { ArrowRight, Cable, Fan, Headphones, Monitor, Umbrella, Zap } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/shop/HeroBanner";
import { ProductCard } from "@/components/shop/ProductCard";
import { TrustSection } from "@/components/shop/TrustSection";
import { BentoGrid } from "@/components/shop/BentoGrid";
import { getStoreProducts } from "@/lib/catalog-server";
import { getSiteSettings } from "@/lib/settings";

const categoryStyles = [
  [Zap, "from-cyan-600 to-indigo-600"],
  [Fan, "from-cyan-500 to-teal-500"],
  [Cable, "from-violet-500 to-fuchsia-500"],
  [Headphones, "from-amber-500 to-orange-500"],
  [Monitor, "from-blue-600 to-violet-600"],
  [Umbrella, "from-fuchsia-500 to-rose-500"],
] as const;

export default async function Home() {
  const products = await getStoreProducts();
  const settings = await getSiteSettings();
  const categories = Array.from(new Set(products.map((product) => product.category)));
  return <><Navbar /><main><HeroBanner title={settings.heroTitle} subtitle={settings.heroSubtitle} /><BentoGrid /><section id="trending" className="mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-16 lg:px-8 lg:py-24"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-600">Fresh picks</p><h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">Trending right now</h2><p className="mt-3 text-slate-500 dark:text-slate-400">Small upgrades customers are loving this week.</p></div><Link href="/products" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-cyan-600 focus-visible:ring-2 focus-visible:ring-cyan-400">View all products <ArrowRight size={16} /></Link></div><div className="mt-6 flex flex-wrap gap-2">{categories.map((category) => <Link key={category} href={`/products?category=${encodeURIComponent(category)}`} className="inline-flex min-h-10 items-center rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-700 transition hover:bg-cyan-500 hover:text-slate-950 dark:text-cyan-200">{category}</Link>)}</div><div className="mt-7 grid grid-cols-2 gap-3 sm:mt-9 sm:gap-5 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div></section><section className="mx-auto max-w-7xl px-4 pb-12 sm:px-5 sm:pb-16 lg:px-8 lg:pb-24"><p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-600">Browse by need</p><h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Find your next favourite</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.map((name, index) => { const [Icon, gradient] = categoryStyles[index % categoryStyles.length]; return <Link key={name} href={`/products?category=${encodeURIComponent(name)}`} className={`group relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br ${gradient} p-5 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-3xl transition hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]`}><Icon className="mb-14 opacity-90" size={28} /><p className="text-lg font-black">{name}</p><p className="mt-1 text-sm text-white/75">Explore {name}</p><ArrowRight className="absolute bottom-5 right-5 transition group-hover:translate-x-1" size={18} /></Link>; })}</div></section><TrustSection /></main><Footer /></>;
}
