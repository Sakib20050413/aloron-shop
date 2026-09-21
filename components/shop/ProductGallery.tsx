"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ImageOrIcon } from "@/components/shop/ImageOrIcon";

export function ProductGallery({ name, images, accent }: { name: string; images: string[]; accent: string }) {
  const [selected, setSelected] = useState(0);
  return <div className="grid gap-4 sm:grid-cols-[88px_1fr]"><div className="order-2 flex gap-3 sm:order-1 sm:flex-col">{images.map((image, index) => <button key={image} onClick={() => setSelected(index)} aria-label={`View ${name} image ${index + 1}`} className={`grid size-16 place-items-center overflow-hidden rounded-xl border bg-white p-1 transition ${selected === index ? "border-cyan-500 ring-2 ring-cyan-500/20" : "border-[#eae6df] dark:border-white/10"}`}><ImageOrIcon src={image} alt="" sizes="64px" className="size-full object-contain text-3xl" /></button>)}</div><motion.div key={selected} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className={`flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-[#eae6df] bg-gradient-to-br ${accent} p-5 shadow-[0_8px_30px_rgba(60,50,40,0.08)] dark:border-white/10 dark:shadow-black/20`}><ImageOrIcon src={images[selected]} alt={name} sizes="(max-width: 640px) 90vw, 50vw" className="size-full object-contain drop-shadow-2xl" /></motion.div></div>;
}
