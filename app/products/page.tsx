import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import { getStoreProducts } from "@/lib/catalog-server";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const allProducts = await getStoreProducts();
  const products = category
    ? allProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    : allProducts;

  const categories = [
    { label: "সব গ্যাজেটস", value: "" },
    { label: "স্মার্ট গ্যাজেট", value: "SMART GADGET" },
    { label: "ফাস্ট চার্জার", value: "CHARGER" },
    { label: "অডিও ও ইয়ারবাডস", value: "AUDIO" },
    { label: "ক্যাবল ও অ্যাক্সেসরিজ", value: "CABLE" },
  ];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-[.2em] text-cyan-600 dark:text-cyan-400">
          {category ? `${category} কালেকশন` : "আলোড়ন গ্যাজেট ক্যাটালগ"}
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">
          {category ? `${category} গ্যাজেটস` : "প্রয়োজনীয় সব আধুনিক গ্যাজেটস"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600 dark:text-slate-400">
          স্মার্টওয়াচ, ফাস্ট চার্জার, হাই-ফাই অডিও ও টেকসই ক্যাবল — সবই ১০০% অরিজিনাল ও দ্রুত ডেলিভারি সহ।
        </p>

        {/* Category Filter Pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => {
            const isSelected = (!category && c.value === "") || (category && category.toLowerCase() === c.value.toLowerCase());
            return (
              <Link
                key={c.value}
                href={c.value ? `/products?category=${encodeURIComponent(c.value)}` : "/products"}
                className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                  isSelected
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "border border-stone-200 bg-white text-stone-700 hover:border-cyan-400 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="my-16 rounded-3xl border border-dashed border-stone-300 p-12 text-center dark:border-white/10">
            <p className="text-base font-bold text-stone-600 dark:text-slate-400">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।</p>
            <Link
              href="/products"
              className="mt-4 inline-flex rounded-xl bg-cyan-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950"
            >
              সব পণ্য দেখুন
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
