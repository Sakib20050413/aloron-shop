"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowLeft, LoaderCircle, ShieldCheck, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const phone = String(form.get("phone") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (password.length < 8) {
      setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: phone || undefined, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "অ্যাকাউন্ট তৈরি করা যায়নি।");
        setLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch {
      setError("সার্ভারে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।");
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-white px-4 py-12 text-neutral-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-white">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-white"
        >
          <ArrowLeft size={14} />
          <span>আলোড়নে ফিরে যান</span>
        </Link>
        <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm transition-colors duration-200 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-black text-sm">
              A
            </span>
            <div>
              <p className="font-bold text-neutral-950 dark:text-white">আলোড়ন অনলাইন শপিং</p>
              <p className="font-mono text-xs text-neutral-500">NEW CUSTOMER REGISTRATION</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                আপনার নাম
              </label>
              <input required name="name" type="text" className="field mt-1.5" placeholder="আপনার সম্পূর্ণ নাম…" />
            </div>
            <div>
              <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                ইমেইল এড্রেস
              </label>
              <input required name="email" autoComplete="email" type="email" spellCheck={false} className="field mt-1.5" placeholder="name@domain.com…" />
            </div>
            <div>
              <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                মোবাইল নম্বর (ঐচ্ছিক)
              </label>
              <input name="phone" inputMode="tel" type="tel" className="field mt-1.5" placeholder="০১XXXXXXXXX…" />
            </div>
            <div>
              <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)
              </label>
              <input required name="password" minLength={8} autoComplete="new-password" type="password" className="field mt-1.5" placeholder="••••••••" />
            </div>

            {error && (
              <p aria-live="polite" className="rounded-lg border border-rose-300 bg-rose-50 p-2.5 font-mono text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-neutral-800 active:scale-95 disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
            >
              {loading ? <LoaderCircle size={15} className="animate-spin" /> : <UserPlus size={15} />}
              <span>{loading ? "অ্যাকাউন্ট তৈরি হচ্ছে…" : "রেজিস্ট্রেশন করুন"}</span>
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-neutral-600 dark:text-neutral-400">
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}
            <Link href="/login" className="font-semibold text-neutral-900 underline-offset-4 hover:underline dark:text-white">
              লগইন করুন
            </Link>
          </div>

          <p className="mt-5 flex items-center justify-center gap-1.5 font-mono text-[11px] text-neutral-500">
            <ShieldCheck size={13} className="text-emerald-500" />
            <span>আপনার তথ্য শতভাগ সুরক্ষিত</span>
          </p>
        </section>
      </div>
    </main>
  );
}
