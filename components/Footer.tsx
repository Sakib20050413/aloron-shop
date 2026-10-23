"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Globe2, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <>
      {/* Floating WhatsApp Quick Contact Button */}
      <a
        href="https://wa.me/8801615869724"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Aloron on WhatsApp"
        className="fixed bottom-6 right-5 z-50 flex items-center gap-2 rounded-full border border-neutral-800 bg-[#25d366] px-4 py-2.5 text-white shadow-xl shadow-black/20 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <span className="relative flex size-4 items-center justify-center">
          <MessageCircle size={18} fill="currentColor" />
        </span>
        <span className="hidden font-mono text-xs font-bold tracking-tight sm:inline">
          হোয়াটসঅ্যাপ সাপোর্ট
        </span>
      </a>

      <footer className="border-t border-neutral-200 bg-neutral-950 px-4 py-14 text-neutral-400 sm:px-6 lg:px-8 dark:border-neutral-800">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2.5">
              {!logoFailed ? (
                <Image
                  src="/logo.png"
                  alt="আলোড়ন অনলাইন শপিং"
                  width={150}
                  height={40}
                  className="h-8 w-auto object-contain brightness-0 invert"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded bg-white text-xs font-black text-neutral-950">
                    A
                  </span>
                  <span className="text-base font-bold tracking-tight text-white">
                    আলোড়ন শপ
                  </span>
                </div>
              )}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-neutral-400">
              &ldquo;Better Choice, Brighter You&rdquo; — প্রয়োজনীয় সব আধুনিক ও প্রিমিয়াম স্মার্ট গ্যাজেট, টেস্টেড কোয়ালিটি ও দ্রুততম সেন্ট্রাল হোম ডেলিভারি।
            </p>
            <div className="mt-5 inline-flex items-center gap-1.5 rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1 font-mono text-[11px] text-neutral-300">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>১০০% অথেনটিক কোয়ালিটি নিশ্চয়তা</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-200">
              ন্যাভিগেশন
            </p>
            <ul className="mt-4 space-y-2 font-mono text-xs text-neutral-400">
              <li>
                <Link href="/products" className="transition-colors hover:text-white">
                  সব স্মার্ট গ্যাজেটস
                </Link>
              </li>
              <li>
                <Link href="/#trending" className="transition-colors hover:text-white">
                  ট্রেন্ডিং ও অফারসমূহ
                </Link>
              </li>
              <li>
                <Link href="/track" className="transition-colors hover:text-white">
                  অর্ডার ট্র্যাক করুন
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="transition-colors hover:text-white">
                  পছন্দের তালিকা (Wishlist)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-white">
                  কাস্টমার ড্যাশবোর্ড
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Hub */}
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-200">
              যোগাযোগ ও সেন্ট্রাল হাব
            </p>
            <div className="mt-4 space-y-2.5 text-xs text-neutral-400">
              <p className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-neutral-400" />
                <span>সেন্ট্রাল ইনভেন্টরি হাব: ঢাকা, বাংলাদেশ (সারা দেশে ডেলিভারি)</span>
              </p>
              <a href="tel:01615869724" className="flex items-center gap-2 transition-colors hover:text-white">
                <Phone size={14} className="text-neutral-400" />
                <span className="font-mono">০১৬১৫৮৬৯৭২৪ (অফিসিয়াল হটলাইন)</span>
              </a>
              <a href="https://wa.me/8801615869724" target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-colors hover:text-white">
                <MessageCircle size={14} className="text-[#25d366]" />
                <span className="font-mono">WhatsApp: +8801615869724</span>
              </a>
              <p className="flex items-center gap-2">
                <Clock size={14} className="text-neutral-400" />
                <span>সাপোর্ট সময়: প্রতিদিন সকাল ১০টা – রাত ১০টা</span>
              </p>
            </div>
          </div>

          {/* Payment & Security */}
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-200">
              পেমেন্ট ও পলিসি
            </p>
            <p className="mt-4 text-xs leading-relaxed text-neutral-400">
              অর্ডার কনফার্মেশনের জন্য ৳২০০ বিকাশ অগ্রিম এবং অবশিষ্ট টাকা ক্যাশ অন ডেলিভারি (COD)।
            </p>
            <div className="mt-3.5 flex flex-wrap gap-2 font-mono text-[11px]">
              <span className="rounded border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-neutral-300">
                bKash: 01615869724
              </span>
              <span className="rounded border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-neutral-300">
                Cash on Delivery
              </span>
            </div>
            <a
              href="https://www.facebook.com/profile.php?id=61565439075732"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 font-mono text-xs text-neutral-300 transition-colors hover:border-neutral-700 hover:text-white"
            >
              <Globe2 size={14} />
              <span>অফিসিয়াল ফেসবুক পেজ</span>
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-neutral-900 pt-6 font-mono text-[11px] text-neutral-500">
          <div>
            © ২০২৬ আলোড়ন অনলাইন শপিং (Aloron Shop). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/products" className="transition-colors hover:text-neutral-300">শপ</Link>
            <Link href="/track" className="transition-colors hover:text-neutral-300">ট্র্যাকিং</Link>
            <Link href="/checkout" className="transition-colors hover:text-neutral-300">চেকআউট</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
