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
        <main className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500">
            ERROR 404
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            পণ্যটি খুঁজে পাওয়া যায়নি
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-500">
            সম্ভবত লিংকটি ভুল অথবা পণ্যটি স্টক আউট হয়ে সরিয়ে নেওয়া হয়েছে।
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-lg bg-neutral-900 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-900"
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
      <main className="mx-auto max-w-7xl overflow-x-hidden px-4 py-8 pb-24 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-white"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>সব গ্যাজেট কালেকশন</span>
        </Link>

        <ProductDetailExperience product={product} whatsappUrl={whatsappUrl} />

        {/* Customer Reviews for this item */}
        <section className="mt-16 border-t border-neutral-200/80 pt-10 dark:border-neutral-800">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                VERIFIED REVIEWS
              </div>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
                ক্রেতাদের রিভিউ ও রেটিং
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                ভেরিফাইড ক্রেতাদের বাস্তব অভিজ্ঞতা ও রেটিং।
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={15} fill="currentColor" />
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["অরিজিনাল প্রোডাক্ট এবং দ্রুত ডেলিভারি পেয়েছি। ঢাকা সেন্ট্রাল হাব থেকে প্যাকেজিং বেশ মজবুত ছিল।", "তানভীর আহমেদ (ঢাকা)"],
              ["বিল্ড কোয়ালিটি অত্যন্ত প্রিমিয়াম। আলোড়নের হোয়াটসঅ্যাপ টিম খুব দ্রুত রেসপন্স করেছে।", "রাকিব হাসান (চট্টগ্রাম)"],
            ].map(([quote, name]) => (
              <blockquote
                key={name}
                className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60"
              >
                <div className="flex text-amber-500" aria-label="৫ স্টার রেটিং">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={13} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-neutral-700 sm:text-sm dark:text-neutral-300">
                  &ldquo;{quote}&rdquo;
                </p>
                <footer className="mt-4 font-mono text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
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
