import Link from "next/link";
import { Home, PackageSearch } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
          ERROR 404 // PAGE NOT FOUND
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-5xl dark:text-white">
          পেজটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="mt-3 max-w-md text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          আপনি যে ঠিকানাটি খুঁজছেন তা হয়তো সরানো হয়েছে অথবা লিংকটি পরিবর্তিত হয়েছে। আমাদের মূল ক্যাটালগ বা হোমপেজে ফিরে যেতে পারেন।
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
          >
            <Home size={15} />
            <span>হোমপেজে ফিরে যান</span>
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-900 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
          >
            <PackageSearch size={15} />
            <span>সব গ্যাজেট ব্রাউজ করুন</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
