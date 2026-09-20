import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#090d16] text-white">
      <div className="absolute -left-32 top-0 size-96 rounded-full bg-blue-600/25 blur-3xl" />
      <div className="absolute -right-20 bottom-0 size-96 rounded-full bg-teal-500/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-400/10 px-3 py-1.5 text-xs font-bold text-blue-200">
            <Sparkles size={14} /> প্রতিদিনের জন্য বাছাই করা প্রযুক্তি
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">ছোট গ্যাজেট।<br /><span className="text-cyan-400">বড় সুবিধা।</span></h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">আপনার প্রতিদিনের জীবন, কাজ ও চলার জন্য বাছাই করা স্মার্ট গ্যাজেট আবিষ্কার করুন।</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/products" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">কালেকশন দেখুন <ArrowUpRight size={17} /></Link>
            <Link href="#trending" className="rounded-xl border border-slate-700 px-5 py-3.5 text-sm font-bold text-slate-200 transition hover:border-cyan-400/50">ট্রেন্ডিং গ্যাজেট</Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-5 rounded-[2rem] bg-blue-600/30 blur-2xl" />
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-500 via-indigo-600 to-teal-500 p-7 shadow-2xl shadow-blue-950">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-white/20 bg-black/10 p-6 backdrop-blur-sm">
              <span className="text-sm font-bold text-blue-100">ALORON / 2026 DROP</span>
              <div><div className="text-8xl">🎧</div><p className="mt-4 text-2xl font-black">Better sound.<br />Less noise.</p></div>
              <div className="flex items-end justify-between text-sm text-blue-100"><span>Limited essentials</span><ArrowUpRight size={20} /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
