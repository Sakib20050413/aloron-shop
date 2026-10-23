import Link from "next/link";
import { ArrowLeft, Lock, ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-4 py-16 text-center text-neutral-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-white">
      <div className="w-full max-w-md">
        <div className="mx-auto grid size-12 place-items-center rounded-2xl border border-neutral-200 bg-neutral-100 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white">
          <Lock size={20} />
        </div>
        <div className="mt-6 font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
          RESTRICTED // ERROR 403
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
          অ্যাক্সেস অনুমোদিত নয়
        </h1>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          এই বিভাগটি শুধুমাত্র অনুমোদিত অ্যাডমিন এবং টিম সদস্যদের জন্য সংরক্ষিত। আপনার অ্যাকাউন্টে পর্যাপ্ত অনুমতি নেই।
        </p>

        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
          >
            <ArrowLeft size={14} />
            <span>হোমে ফিরে যান</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-900 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
          >
            <span>ভিন্ন অ্যাকাউন্টে লগইন</span>
          </Link>
        </div>

        <p className="mt-8 flex items-center justify-center gap-1.5 font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
          <ShieldAlert size={13} className="text-amber-500" />
          <span>আলোড়ন সিকিউরিটি সিস্টেম দ্বারা সুরক্ষিত</span>
        </p>
      </div>
    </main>
  );
}
