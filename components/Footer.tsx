"use client";

import Image from "next/image";
import { Globe2, MapPin, MessageCircle, Phone, Sparkles } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [logoFailed, setLogoFailed] = useState(false);
  return (
    <>
      <a href="https://wa.me/8801615869724" target="_blank" rel="noreferrer" aria-label="Chat with Aloron on WhatsApp" className="fixed bottom-6 right-6 z-50 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-xl shadow-emerald-950/30 transition hover:scale-105 hover:bg-[#20bd5a]">
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25d366]/50" />
        <MessageCircle size={27} fill="currentColor" />
      </a>
      <footer className="bg-[#030712] px-5 py-12 text-slate-400">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-3">
          <div>
            {logoFailed ? <span className="font-black text-white">আলোড়ন অনলাইন শপিং</span> : <Image src="/logo.png" alt="আলোড়ন অনলাইন শপিং" width={190} height={54} className="h-11 w-auto object-contain" onError={() => setLogoFailed(true)} />}
            <p className="mt-4 max-w-sm text-sm leading-6">Useful tech and mini gadgets, thoughtfully chosen for everyday Bangladesh.</p>
          </div>
          <div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Contact</p><div className="mt-4 space-y-3 text-sm"><p className="flex items-center gap-2"><MapPin size={16} className="text-cyan-400" /> কুমিল্লা, বাংলাদেশ</p><a href="tel:01615869724" className="flex items-center gap-2 transition hover:text-white"><Phone size={16} className="text-cyan-400" /> 01615869724</a><a href="https://wa.me/8801615869724" target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-white"><MessageCircle size={16} className="text-[#25d366]" /> WhatsApp support</a></div></div>
          <div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Stay connected</p><a href="https://www.facebook.com/profile.php?id=61565439075732" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white transition hover:border-cyan-400/50 hover:text-cyan-300"><Globe2 size={17} /> Official Facebook page</a></div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl items-center gap-2 border-t border-white/10 pt-6 text-xs lg:px-3"><Sparkles size={14} className="text-amber-400" /> © 2026 আলোড়ন অনলাইন শপিং. All rights reserved.</div>
      </footer>
    </>
  );
}
