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
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="border-b border-neutral-200/80 pb-6 dark:border-neutral-800">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {category ? `CATEGORY // ${category.toUpperCase()}` : "CATALOG // ALL PRODUCTS"}
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
            {category ? `${category} গ্যাজেটস` : "প্রয়োজনীয় সব আধুনিক গ্যাজেটস"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            স্মার্টওয়াচ, ফাস্ট চার্জার, হাই-ফাই অডিও ও টেকসই ক্যাবল — সবই ১০০% অরিজিনাল ও দ্রুত সেন্ট্রাল ডেলিভারি সহ।
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => {
            const isSelected = (!category && c.value === "") || (category && category.toLowerCase() === c.value.toLowerCase());
            return (
              <Link
                key={c.value}
                href={c.value ? `/products?category=${encodeURIComponent(c.value)}` : "/products"}
                className={`rounded-lg px-3.5 py-1.5 font-mono text-xs font-semibold transition-all duration-150 ${
                  isSelected
                    ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900"
                    : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700"
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="my-16 rounded-2xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-800">
            <p className="font-mono text-xs uppercase tracking-wider text-neutral-500">
              এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
            </p>
            <Link
              href="/products"
              className="mt-4 inline-flex items-center rounded-lg bg-neutral-900 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-900"
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
