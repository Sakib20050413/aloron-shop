"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { ArrowLeft, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";

export default function LoginForm({ googleConfigured }: { googleConfigured: boolean }) {
  const [role, setRole] = useState<"customer" | "admin">("customer");
  const [error, setError] = useState("");
  const [googleUnavailable, setGoogleUnavailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const ownerEmails = [
    "mdnajmussakib2003@gmail.com",
    "md.najmus.sakib.rahatul.2005@gmail.com",
    "rakibtoha47@gmail.com",
  ];

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const isOwnerAdmin = ownerEmails.includes(email);
    const result = await signIn("credentials", {
      email,
      password: form.get("password"),
      redirect: false,
      callbackUrl: isOwnerAdmin || role === "admin" ? "/admin" : "/dashboard",
    });
    if (result?.error) {
      setError("ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।");
      setLoading(false);
    } else if (result?.url) {
      window.location.href = result.url;
    }
  };

  const googleLogin = () => {
    if (!googleConfigured) {
      setGoogleUnavailable(true);
      return;
    }
    void signIn("google", { callbackUrl: role === "admin" ? "/admin" : "/dashboard" });
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
              <p className="font-mono text-xs text-neutral-500">SECURE PORTAL LOGIN</p>
            </div>
          </div>

          <div className="grid grid-cols-2 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`rounded-md px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition duration-150 ${
                role === "customer"
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              কাস্টমার
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`rounded-md px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition duration-150 ${
                role === "admin"
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              অ্যাডমিন
            </button>
          </div>

          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                ইমেইল এড্রেস
              </label>
              <input required name="email" autoComplete="email" type="email" spellCheck={false} className="field mt-1.5" placeholder="name@domain.com…" />
            </div>
            <div>
              <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                পাসওয়ার্ড
              </label>
              <input required name="password" autoComplete="current-password" type="password" className="field mt-1.5" placeholder="••••••••" />
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
              {loading ? <LoaderCircle size={15} className="animate-spin" /> : <LockKeyhole size={15} />}
              <span>{loading ? "লগইন হচ্ছে…" : "লগইন করুন"}</span>
            </button>
          </form>

          <button
            disabled={loading}
            onClick={googleLogin}
            className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-2.5 font-mono text-xs font-semibold text-neutral-800 shadow-sm transition hover:bg-neutral-50 active:scale-95 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            <span aria-hidden="true" className="text-base font-black text-[#4285F4]">G</span>
            <span>গুগল দিয়ে সাইন ইন</span>
          </button>
          {googleUnavailable && (
            <p aria-live="polite" className="mt-3 rounded-lg border border-amber-300/40 bg-amber-50 p-2.5 text-xs text-amber-800 dark:border-amber-300/20 dark:bg-amber-950/20 dark:text-amber-200">
              গুগল লগইন চালুর জন্য গুগল ক্লাউড কনসোল থেকে Client ID কনফিগার করুন।
            </p>
          )}

          <div className="mt-5 text-center text-xs text-neutral-600 dark:text-neutral-400">
            নতুন কাস্টমার?{" "}
            <Link href="/register" className="font-semibold text-neutral-900 underline-offset-4 hover:underline dark:text-white">
              নতুন অ্যাকাউন্ট তৈরি করুন
            </Link>
          </div>
          <p className="mt-5 flex items-center justify-center gap-1.5 font-mono text-[11px] text-neutral-500">
            <ShieldCheck size={13} className="text-emerald-500" />
            <span>নিরাপদ এনক্রিপ্টেড সেশন</span>
          </p>
        </section>
      </div>
    </main>
  );
}
