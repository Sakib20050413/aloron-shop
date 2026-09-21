import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ProductDetailExperience } from "@/components/shop/ProductDetailExperience";
import { getStoreProduct } from "@/lib/catalog-server";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getStoreProduct(id);
  if (!product) return <><Navbar /><main className="mx-auto max-w-7xl px-5 py-24"><h1 className="text-3xl font-black">Product not found</h1><Link href="/products" className="mt-4 inline-block text-cyan-600">Back to shop</Link></main></>;

  const whatsappUrl = `https://wa.me/8801615869724?text=${encodeURIComponent(`হ্যালো আলোড়ন! আমি ${product.name} (কোড: ${product.productCode}, মূল্য: ৳${product.sellPrice.toLocaleString("en-BD")}) অর্ডার করতে চাই।`)}`;
  return <><Navbar /><main className="mx-auto max-w-7xl overflow-x-hidden px-5 py-12 pb-24 lg:px-8"><Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-stone-500 transition hover:text-cyan-700 focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:text-cyan-400"><ArrowLeft size={16} aria-hidden="true" /> শপে ফিরে যান</Link><ProductDetailExperience product={product} whatsappUrl={whatsappUrl} /><section className="mt-20 border-t border-[#eae6df] pt-12 dark:border-white/10"><h2 className="text-2xl font-black text-stone-950 dark:text-white">ক্রেতাদের মতামত</h2><div className="mt-6 grid gap-4 md:grid-cols-2">{[["Compact, useful, and the delivery was quick. Exactly as described.", "Nusrat A."], ["Good build quality and helpful support from Aloron.", "Rakib H."]].map(([quote, name]) => <blockquote key={name} className="rounded-2xl border border-[#eae6df] bg-[#fffdf9] p-5 dark:border-white/10 dark:bg-slate-900/70"><div className="flex text-amber-400" aria-label="৫ স্টার রেটিং">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={15} fill="currentColor" aria-hidden="true" />)}</div><p className="mt-3 text-sm leading-6 text-stone-600 dark:text-slate-300">“{quote}”</p><footer className="mt-4 text-xs font-bold text-stone-400">— {name}</footer></blockquote>)}</div></section></main></>;
}
