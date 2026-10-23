"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ImageOrIcon } from "@/components/shop/ImageOrIcon";

export function ProductGallery({ name, images }: { name: string; images: string[]; accent?: string }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="grid gap-4 sm:grid-cols-[76px_1fr]">
      {/* Thumbnails */}
      <div className="order-2 flex gap-2.5 sm:order-1 sm:flex-col">
        {images.map((image, index) => (
          <button
            key={image}
            onClick={() => setSelected(index)}
            aria-label={`View ${name} image ${index + 1}`}
            className={`grid size-16 place-items-center overflow-hidden rounded-xl border bg-white p-1 transition-all ${
              selected === index
                ? "border-neutral-900 ring-2 ring-neutral-900/20 dark:border-white dark:ring-white/20"
                : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
            }`}
          >
            <ImageOrIcon src={image} alt="" sizes="64px" className="size-full object-contain text-3xl" />
          </button>
        ))}
      </div>

      {/* Main Showcase Stage */}
      <motion.div
        key={selected}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/40"
      >
        <ImageOrIcon
          src={images[selected]}
          alt={name}
          sizes="(max-width: 640px) 90vw, 50vw"
          className="size-full object-contain drop-shadow-xl"
        />
      </motion.div>
    </div>
  );
}
