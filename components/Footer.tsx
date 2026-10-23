"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Globe2, MapPin, MessageCircle, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <>
      {/* Floating WhatsApp Support Button */}
      <a
        href="https://wa.me/8801615869724"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Aloron on WhatsApp"
        className="fixed bottom-20 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-3 text-white shadow-2xl shadow-emerald-950/40 transition-all duration-300 hover:scale-105 hover:bg-[#20bd5a] active:scale-95"
      >
        <span className="relative flex size-6 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-40" />
          <MessageCircle size={24} fill="currentColor" />
        </span>
        <span className="hidden sm:inline text-xs font-black tracking-wide">হোয়াটসঅ্যাপ সাপোর্ট</span>
      </a>

      <footer className="border-t border-[#eae6df] bg-[#030712] px-5 py-14 text-slate-400 dark:border-white/10">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-4">
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-2.5">
              {!logoFailed ? (
                <Image
                  src="/logo.png"
                  alt="আলোড়ন অনলাইন শপিং"
                  width={160}
                  height={45}
                  className="h-10 w-auto object-contain"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <span className="text-xl font-black text-white">আলোড়ন অনলাইন শপিং</span>
              )}
            </div>
            <p className="mt-4 text-xs sm:text-sm leading-6 text-slate-400">
              &ldquo;Better Choice, Brighter You&rdquo; — প্রয়োজনীয় সব আধুনিক ও প্রিমিয়াম স্মার্ট গ্যাজেট, টেস্টেড কোয়ালিটি ও দ্রুততম ক্যাশ অন ডেলিভারি।
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 text-xs font-bold text-cyan-300 border border-white/10">
              <ShieldCheck size={15} /> অথেনটিক গ্যারান্টি
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-400">ন্যাভিগেশন</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/products" className="transition hover:text-white">
                  সব স্মার্ট গ্যাজেটস
                </Link>
              </li>
              <li>
                <Link href="/#trending" className="transition hover:text-white">
                  ট্রেন্ডিং ও অফারসমূহ
                </Link>
              </li>
              <li>
                <Link href="/track" className="transition hover:text-white">
                  অর্ডার ট্র্যাক করুন
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="transition hover:text-white">
                  আমার পছন্দের তালিকা (Wishlist)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition hover:text-white">
                  কাস্টমার ড্যাশবোর্ড
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Hub */}
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-400">যোগাযোগ ও হাব</p>
            <div className="mt-4 space-y-3 text-sm">
              <p className="flex items-start gap-2.5">
                <MapPin size={17} className="mt-0.5 shrink-0 text-cyan-400" />
                <span>সেন্ট্রাল ইনভেন্টরি হাব: ঢাকা, বাংলাদেশ (সারা দেশে হোম ডেলিভারি)</span>
              </p>
              <a href="tel:01615869724" className="flex items-center gap-2.5 transition hover:text-white">
                <Phone size={16} className="text-cyan-400" />
                <span>০১৬১৫৮৬৯৭২৪ (হটলাইন)</span>
              </a>
              <a href="https://wa.me/8801615869724" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 transition hover:text-white">
                <MessageCircle size={16} className="text-[#25d366]" />
                <span>WhatsApp: +8801615869724</span>
              </a>
              <p className="flex items-center gap-2.5">
                <Clock size={16} className="text-cyan-400" />
                <span>সাপোর্ট সময়: প্রতিদিন সকাল ১০টা – রাত ১০টা</span>
              </p>
            </div>
          </div>

          {/* Payment & Security */}
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-400">নিরাপদ পেমেন্ট ও সোশাল</p>
            <p className="mt-4 text-xs leading-6 text-slate-400">
              বিকাশ (bKash) ও ক্যাশ অন ডেলিভারি (COD) পেমেন্ট সুবিধা।
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-lg bg-pink-950/60 border border-pink-500/40 px-3 py-1.5 text-xs font-bold text-pink-300">
                বিকাশ (bKash)
              </span>
              <span className="rounded-lg bg-amber-950/60 border border-amber-500/40 px-3 py-1.5 text-xs font-bold text-amber-300">
                ক্যাশ অন ডেলিভারি
              </span>
            </div>
            <a
              href="https://www.facebook.com/profile.php?id=61565439075732"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-white transition hover:border-cyan-400 hover:text-cyan-300"
            >
              <Globe2 size={16} /> অফিসিয়াল ফেসবুক পেজ
            </a>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 lg:px-4">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-400" />
            <span>© ২০২৬ আলোড়ন অনলাইন শপিং (Aloron Shop). সর্বস্বত্ব সংরক্ষিত।</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/products" className="hover:text-slate-300">শপ</Link>
            <Link href="/track" className="hover:text-slate-300">ট্র্যাকিং</Link>
            <Link href="/checkout" className="hover:text-slate-300">চেকআউট</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
