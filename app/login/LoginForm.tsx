"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { ArrowLeft, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";

export default function LoginForm({ googleConfigured }: { googleConfigured: boolean }) {
  const [role, setRole] = useState<"customer" | "admin">("customer");
  const [error, setError] = useState("");
  const [googleUnavailable, setGoogleUnavailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const ownerEmails = ["mdnajmussakib2003@gmail.com", "md.najmus.sakib.rahatul.2005@gmail.com"];

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
      setError("Email or password is incorrect.");
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
    <main className="grid min-h-screen place-items-center bg-[#fbf9f5] px-5 py-12 text-stone-900 transition-colors duration-200 dark:bg-[#080C14] dark:text-white">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-stone-600 hover:text-cyan-700 dark:text-slate-400 dark:hover:text-cyan-300">
          <ArrowLeft size={16} /> আলোড়নে ফিরে যান
        </Link>
        <section className="rounded-3xl border border-[#eae6df] bg-[#fffdf9] p-7 shadow-[0_8px_30px_rgba(60,50,40,0.04)] transition-colors duration-200 dark:border-slate-800/80 dark:bg-[#0F172A]">
          <div className="mb-7 flex items-center gap-3">
            <Image src="/logo.png" alt="আলোড়ন অনলাইন শপিং" width={168} height={48} priority className="h-11 w-auto object-contain" />
            <div><p className="font-black">আলোড়ন অনলাইন শপিং</p><p className="text-xs text-slate-400">নিরাপদ অ্যাকাউন্ট প্রবেশ</p></div>
          </div>
          <div className="grid grid-cols-2 rounded-xl bg-[#efebe3] p-1 dark:bg-black/20">
            <button type="button" onClick={() => setRole("customer")} className={`rounded-lg px-3 py-2 text-sm font-semibold transition duration-150 active:scale-95 ${role === "customer" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700 dark:text-slate-400 dark:hover:text-slate-200"}`}>কাস্টমার</button>
            <button type="button" onClick={() => setRole("admin")} className={`rounded-lg px-3 py-2 text-sm font-semibold transition duration-150 active:scale-95 ${role === "admin" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700 dark:text-slate-400 dark:hover:text-slate-200"}`}>অ্যাডমিন</button>
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-stone-700 dark:text-slate-300">ইমেইল
              <input required name="email" autoComplete="email" type="email" spellCheck={false} className="field mt-2" placeholder="আপনার ইমেইল…" />
            </label>
            <label className="block text-sm font-semibold text-stone-700 dark:text-slate-300">পাসওয়ার্ড
              <input required name="password" autoComplete="current-password" type="password" className="field mt-2" placeholder="পাসওয়ার্ড লিখুন…" />
            </label>
            {error && <p aria-live="polite" className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}
            <button disabled={loading} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/20 transition duration-150 hover:from-cyan-600 hover:to-cyan-700 active:scale-95 disabled:cursor-wait disabled:opacity-60">{loading ? <LoaderCircle size={16} className="animate-spin" /> : <LockKeyhole size={16} />} {loading ? "লগইন হচ্ছে…" : "লগইন করুন"}</button>
          </form>
          <button disabled={loading} onClick={googleLogin} className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-700 shadow-sm transition duration-150 hover:bg-stone-50 active:scale-95 disabled:opacity-60 dark:border-slate-700/80 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"><span aria-hidden="true" className="text-base font-black text-[#4285F4]">G</span> গুগল দিয়ে সাইন ইন</button>
          {googleUnavailable && <p aria-live="polite" className="mt-3 rounded-xl border border-amber-300/40 bg-amber-50 p-3 text-sm leading-6 text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">গুগল লগইন চালুর জন্য গুগল ক্লাউড কনসোল থেকে Client ID কনফিগার করুন।</p>}
          <p className="mt-5 flex gap-2 text-xs leading-5 text-slate-400"><ShieldCheck size={15} className="shrink-0 text-cyan-400" /> নিরাপদ লগইন · অনুমোদিত অ্যাকাউন্টের জন্য সীমিত অ্যাক্সেস</p>
        </section>
      </div>
    </main>
  );
}
