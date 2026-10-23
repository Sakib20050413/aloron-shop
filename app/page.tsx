import Link from "next/link";
import { ArrowRight, ArrowUpRight, Cable, Headphones, Package, Watch, Zap } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/shop/HeroBanner";
import { StorefrontCatalog } from "@/components/shop/StorefrontCatalog";
import { BentoGrid } from "@/components/shop/BentoGrid";
import { CustomerReviews } from "@/components/shop/CustomerReviews";
import { TrustSection } from "@/components/shop/TrustSection";
import { getStoreProducts } from "@/lib/catalog-server";
import { prisma } from "@/lib/prisma";

const categoryMeta: Record<string, { icon: typeof Zap; sku: string; labelBn: string }> = {
  "SMART GADGET": { icon: Watch, sku: "CAT // WCH", labelBn: "স্মার্ট গ্যাজেট" },
  "CHARGER": { icon: Zap, sku: "CAT // CHG", labelBn: "ফাস্ট চার্জার" },
  "AUDIO": { icon: Headphones, sku: "CAT // AUD", labelBn: "অডিও ও ইয়ারবাডস" },
  "CABLE": { icon: Cable, sku: "CAT // CBL", labelBn: "ক্যাবল ও অ্যাক্সেসরিজ" },
};

export default async function Home() {
  const [products, cmsSlides] = await Promise.all([
    getStoreProducts(),
    prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }).catch((error) => {
      console.error("Hero slide read failed; using fallback:", error);
      return [];
    }),
  ]);

  const categories = Array.from(new Set(products.map((product) => product.category)));

  return (
    <>
      <Navbar />
      <main className="relative z-10">
        {/* 60fps GPU Hero Slider */}
        <HeroBanner cmsSlides={cmsSlides} />

        {/* Dynamic Catalog & Category Filter */}
        <StorefrontCatalog products={products} />

        {/* Bento Grid Editorial Showcase */}
        <BentoGrid />

        {/* Category Explorer Grid */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6 dark:border-white/[0.08]">
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                DISCOVER BY HARDWARE CATEGORY
              </div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
                ক্যাটাগরি অনুযায়ী গ্যাজেট বেছে নিন
              </h2>
            </div>
            <Link
              href="/products"
              className="group inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-900 transition-colors hover:text-indigo-600 dark:text-neutral-100 dark:hover:text-indigo-400"
            >
              <span>সব কালেকশন এক্সপ্লোর করুন</span>
              <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((name) => {
              const meta = categoryMeta[name] ?? {
                icon: Package,
                sku: "CAT // GEN",
                labelBn: name,
              };
              const Icon = meta.icon;
              const count = products.filter((p) => p.category === name).length;

              return (
                <Link
                  key={name}
                  href={`/products?category=${encodeURIComponent(name)}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/90 dark:border-white/[0.08] bg-white/90 dark:bg-[#0c0f18]/80 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-neutral-400 dark:hover:border-indigo-500/40 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="grid size-11 place-items-center rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/5 text-neutral-900 transition-colors group-hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 shadow-inner">
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <span className="font-mono text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">
                      {count} ITEMS
                    </span>
                  </div>

                  <div className="mt-8">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                      {meta.sku}
                    </span>
                    <p className="mt-1 text-base font-bold text-neutral-950 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                      {meta.labelBn}
                    </p>
                    <p className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-600 transition-colors group-hover:text-neutral-950 dark:text-neutral-400 dark:group-hover:text-white">
                      <span>কালেকশন ভিউ</span>
                      <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Customer Testimonials & Verified Social Proof */}
        <CustomerReviews />

        {/* Trust & Guarantee Section */}
        <TrustSection />
      </main>
      <Footer />
    </>
  );
}
