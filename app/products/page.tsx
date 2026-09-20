import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/shop/ProductCard";
import { getStoreProducts } from "@/lib/catalog-server";

export default async function ProductsPage() {
  const products = await getStoreProducts();
  return <><Navbar /><main className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-600">The collection</p><h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">Useful tech, thoughtfully chosen</h1><p className="mt-3 max-w-2xl text-slate-500">Chargers, audio, cables, and mini gadgets made for everyday life.</p><div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div></main></>;
}
