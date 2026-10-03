import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/shop/ProductCard";
import { getStoreProducts } from "@/lib/catalog-server";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const allProducts = await getStoreProducts();
  const products = category
    ? allProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    : allProducts;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-600">
          {category ? `${category} Collection` : "The collection"}
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">
          {category ? `${category} গ্যাজেটস` : "Useful tech, thoughtfully chosen"}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-500">
          Chargers, audio, cables, and mini gadgets made for everyday life.
        </p>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length === 0 && (
          <p className="py-16 text-center text-slate-500">কোনো পণ্য পাওয়া যায়নি।</p>
        )}
      </main>
    </>
  );
}
