import Link from "next/link";
import { ArrowRight, Cable, Headphones, Package, Watch, Zap } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/shop/HeroBanner";
import { StorefrontCatalog } from "@/components/shop/StorefrontCatalog";
import { BentoGrid } from "@/components/shop/BentoGrid";
import { CustomerReviews } from "@/components/shop/CustomerReviews";
import { TrustSection } from "@/components/shop/TrustSection";
import { getStoreProducts } from "@/lib/catalog-server";
import { prisma } from "@/lib/prisma";

const categoryMeta: Record<string, { icon: typeof Zap; gradient: string; labelBn: string }> = {
  "SMART GADGET": { icon: Watch, gradient: "from-cyan-600 via-sky-600 to-blue-600", labelBn: "স্মার্ট গ্যাজেট" },
  "CHARGER": { icon: Zap, gradient: "from-amber-500 via-orange-500 to-rose-500", labelBn: "ফাস্ট চার্জার" },
  "AUDIO": { icon: Headphones, gradient: "from-teal-600 via-emerald-600 to-green-600", labelBn: "অডিও ও ইয়ারবাডস" },
  "CABLE": { icon: Cable, gradient: "from-violet-600 via-purple-600 to-fuchsia-600", labelBn: "ক্যাবল ও অ্যাক্সেসরিজ" },
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
      <main>
        {/* 60fps GPU Hero Slider */}
        <HeroBanner cmsSlides={cmsSlides} />

        {/* Dynamic Catalog & Category Filter */}
        <StorefrontCatalog products={products} />

        {/* Bento Grid Editorial Showcase */}
        <BentoGrid />

        {/* Category Explorer Grid */}
        <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8 lg:pb-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[.2em] text-cyan-600 dark:text-cyan-400">
                আপনার প্রয়োজন অনুযায়ী
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl dark:text-white">
                ক্যাটাগরি অনুযায়ী গ্যাজেট বেছে নিন
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-bold text-cyan-700 hover:text-cyan-600 dark:text-cyan-400"
            >
              সব ক্যাটাগরি দেখুন →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((name) => {
              const meta = categoryMeta[name] ?? {
                icon: Package,
                gradient: "from-blue-600 to-cyan-600",
                labelBn: name,
              };
              const Icon = meta.icon;
              const count = products.filter((p) => p.category === name).length;

              return (
                <Link
                  key={name}
                  href={`/products?category=${encodeURIComponent(name)}`}
                  className={`group relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br ${meta.gradient} p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-500/20`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="opacity-90 transition-transform duration-300 group-hover:scale-110" size={32} aria-hidden="true" />
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                      {count}টি পণ্য
                    </span>
                  </div>
                  <div className="mt-12">
                    <p className="text-xl font-black">{meta.labelBn}</p>
                    <p className="mt-1 text-xs text-white/80 flex items-center gap-1 font-semibold">
                      কালেকশন দেখুন <ArrowRight className="transition-transform group-hover:translate-x-1" size={14} aria-hidden="true" />
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
