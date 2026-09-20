"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function ProductGallery({ name, images, accent }: { name: string; images: string[]; accent: string }) {
  const [selected, setSelected] = useState(0);
  return <div className="grid gap-4 sm:grid-cols-[88px_1fr]"><div className="order-2 flex gap-3 sm:order-1 sm:flex-col">{images.map((image, index) => <button key={image} onClick={() => setSelected(index)} aria-label={`View ${name} image ${index + 1}`} className={`grid size-16 place-items-center rounded-xl border text-3xl transition ${selected === index ? "border-cyan-500 ring-2 ring-cyan-500/20" : "border-slate-200 dark:border-white/10"}`}>{image}</button>)}</div><motion.div key={selected} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className={`flex aspect-square items-center justify-center rounded-3xl bg-gradient-to-br ${accent} text-[10rem] shadow-xl shadow-slate-200/40 dark:shadow-black/20`}>{images[selected]}</motion.div></div>;
}
