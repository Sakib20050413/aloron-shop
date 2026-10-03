"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowLeft, LoaderCircle, UserPlus, ShieldCheck } from "lucide-react";

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

      // Automatically sign in upon registration
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
    <main className="grid min-h-screen place-items-center bg-[#fbf9f5] px-5 py-12 text-stone-900 transition-colors duration-200 dark:bg-[#080C14] dark:text-white">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-stone-600 hover:text-cyan-700 dark:text-slate-400 dark:hover:text-cyan-300">
          <ArrowLeft size={16} /> আলোড়নে ফিরে যান
        </Link>
        <section className="rounded-3xl border border-[#eae6df] bg-[#fffdf9] p-7 shadow-[0_8px_30px_rgba(60,50,40,0.04)] transition-colors duration-200 dark:border-slate-800/80 dark:bg-[#0F172A]">
          <div className="mb-7 flex items-center gap-3">
            <Image src="/logo.png" alt="আলোড়ন অনলাইন শপিং" width={168} height={48} priority className="h-11 w-auto object-contain" />
            <div>
              <p className="font-black">আলোড়ন অনলাইন শপিং</p>
              <p className="text-xs text-slate-400">নতুন অ্যাকাউন্ট তৈরি করুন</p>
            </div>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-stone-700 dark:text-slate-300">
              আপনার নাম
              <input required name="name" type="text" className="field mt-2" placeholder="পুরো নাম লিখুন…" />
            </label>
            <label className="block text-sm font-semibold text-stone-700 dark:text-slate-300">
              ইমেইল
              <input required name="email" autoComplete="email" type="email" spellCheck={false} className="field mt-2" placeholder="আপনার ইমেইল…" />
            </label>
            <label className="block text-sm font-semibold text-stone-700 dark:text-slate-300">
              মোবাইল নম্বর (ঐচ্ছিক)
              <input name="phone" inputMode="tel" type="tel" className="field mt-2" placeholder="০১XXXXXXXXX…" />
            </label>
            <label className="block text-sm font-semibold text-stone-700 dark:text-slate-300">
              পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)
              <input required name="password" minLength={8} autoComplete="new-password" type="password" className="field mt-2" placeholder="একটি শক্তিশালী পাসওয়ার্ড…" />
            </label>

            {error && <p aria-live="polite" className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}

            <button
              disabled={loading}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/20 transition duration-150 hover:from-cyan-600 hover:to-cyan-700 active:scale-95 disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? <LoaderCircle size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে…" : "রেজিস্ট্রেশন করুন"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-stone-600 dark:text-slate-400">
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}
            <Link href="/login" className="font-bold text-cyan-600 underline-offset-4 hover:underline dark:text-cyan-400">
              লগইন করুন
            </Link>
          </div>

          <p className="mt-5 flex gap-2 text-xs leading-5 text-slate-400">
            <ShieldCheck size={15} className="shrink-0 text-cyan-400" /> আপনার তথ্য শতভাগ নিরাপদ থাকবে
          </p>
        </section>
      </div>
    </main>
  );
}
