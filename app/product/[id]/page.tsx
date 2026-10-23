import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductDetailExperience } from "@/components/shop/ProductDetailExperience";
import { getStoreProduct } from "@/lib/catalog-server";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getStoreProduct(id);

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-7xl px-5 py-24 text-center">
          <h1 className="text-3xl font-black text-stone-900 dark:text-white">পণ্যটি খুঁজে পাওয়া যায়নি</h1>
          <p className="mt-3 text-sm text-stone-500">সম্ভবত লিংকটি ভুল অথবা পণ্যটি সরিয়ে নেওয়া হয়েছে।</p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-xl bg-cyan-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            শপে ফিরে যান
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const whatsappUrl = `https://wa.me/8801615869724?text=${encodeURIComponent(
    `হ্যালো আলোড়ন! আমি ${product.name} (কোড: ${product.productCode}, মূল্য: ৳${product.sellPrice.toLocaleString("en-BD")}) অর্ডার করতে চাই।`
  )}`;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl overflow-x-hidden px-5 py-10 pb-24 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-stone-500 transition hover:text-cyan-700 focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:text-cyan-400"
        >
          <ArrowLeft size={16} aria-hidden="true" /> সব গ্যাজেট কালেকশনে ফিরে যান
        </Link>

        <ProductDetailExperience product={product} whatsappUrl={whatsappUrl} />

        {/* Customer Reviews for this item */}
        <section className="mt-20 border-t border-[#eae6df] pt-12 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-stone-950 dark:text-white">ক্রেতাদের রিভিউ ও রেটিং</h2>
              <p className="mt-1 text-sm text-stone-500">ভেরিফাইড ক্রেতাদের বাস্তব অভিজ্ঞতা।</p>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={18} fill="currentColor" />
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["অরিজিনাল প্রোডাক্ট এবং দ্রুত ডেলিভারি পেয়েছি। ঢাকা থেকে প্যাকেজিং বেশ মজবুত ছিল।", "তানভীর আহমেদ (ঢাকা)"],
              ["বিল্ড কোয়ালিটি অত্যন্ত প্রিমিয়াম। আলোড়নের হোয়াটসঅ্যাপ টিম খুব দ্রুত রেসপন্স করেছে।", "রাকিব হাসান (চট্টগ্রাম)"],
            ].map(([quote, name]) => (
              <blockquote
                key={name}
                className="rounded-3xl border border-[#eae6df] bg-[#fffdf9] p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/70"
              >
                <div className="flex text-amber-400" aria-label="৫ স্টার রেটিং">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={15} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-700 dark:text-slate-300">
                  &ldquo;{quote}&rdquo;
                </p>
                <footer className="mt-4 text-xs font-bold text-cyan-700 dark:text-cyan-400">
                  — {name}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
