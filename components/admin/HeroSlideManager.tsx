"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import { createHeroSlide, deleteHeroSlide, updateHeroSlide } from "@/actions/hero-slides";

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  discountTag: string;
  priceText: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
};

const empty = {
  title: "",
  subtitle: "",
  badgeText: "২০২৬ ফ্ল্যাগশিপ গ্যাজেট কালেকশন",
  discountTag: "১৫% ছাড়",
  priceText: "৳২,৯৯০",
  ctaText: "কালেকশন দেখুন",
  ctaLink: "/products",
  imageUrl: "",
  order: 0,
  isActive: true,
};

export function HeroSlideManager({ initialSlides }: { initialSlides: Slide[] }) {
  const router = useRouter();
  const [slides, setSlides] = useState(initialSlides);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const setField = (key: keyof typeof empty, value: string | boolean | number) =>
    setForm((current) => ({ ...current, [key]: value }));

  const openEdit = (slide: Slide) => {
    setEditing(slide.id);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle,
      badgeText: slide.badgeText,
      discountTag: slide.discountTag,
      priceText: slide.priceText,
      ctaText: slide.ctaText,
      ctaLink: slide.ctaLink,
      imageUrl: slide.imageUrl,
      order: slide.order,
      isActive: slide.isActive,
    });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const result = editing
      ? await updateHeroSlide(editing, form)
      : await createHeroSlide(new FormData(event.currentTarget as HTMLFormElement));
    if (result.success) {
      setMessage("স্লাইড সফলভাবে সংরক্ষিত হয়েছে।");
      setEditing(null);
      setForm(empty);
      router.refresh();
    } else setMessage(result.error);
    setBusy(false);
  };

  const toggle = async (slide: Slide) => {
    const result = await updateHeroSlide(slide.id, { isActive: !slide.isActive });
    if (result.success)
      setSlides((current) =>
        current.map((item) => (item.id === slide.id ? { ...item, isActive: !item.isActive } : item))
      );
  };

  const remove = async (slide: Slide) => {
    if (!window.confirm("এই স্লাইডটি ডিলিট করতে চান?")) return;
    const result = await deleteHeroSlide(slide.id);
    if (result.success) setSlides((current) => current.filter((item) => item.id !== slide.id));
  };

  return (
    <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4 dark:border-neutral-800">
        <div>
          <h2 className="text-lg font-bold text-neutral-950 dark:text-white">হিরো ব্যানার স্লাইডার কন্ট্রোল</h2>
          <p className="mt-1 text-xs text-neutral-500">
            হোমপেজের স্লাইডার ইমেজ, ডিসকাউন্ট অফার ও অ্যাকশন বাটন ম্যানেজ করুন।
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setForm(empty);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
        >
          <Plus size={13} />
          <span>নতুন স্লাইড তৈরি করুন</span>
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slides.map((slide) => (
          <article
            key={slide.id}
            className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-800">
              {slide.imageUrl ? (
                <Image
                  src={slide.imageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center font-mono text-xs text-neutral-400">
                  ইমেজ নেই
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="font-bold text-neutral-900 dark:text-white">{slide.title}</p>
              <p className="font-mono text-xs text-neutral-500">
                {slide.priceText} · {slide.discountTag}
              </p>
              <div className="mt-4 flex gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => openEdit(slide)}
                  className="rounded border border-neutral-300 bg-white px-2.5 py-1 font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                >
                  এডিট
                </button>
                <button
                  type="button"
                  onClick={() => void toggle(slide)}
                  className="rounded border border-neutral-300 bg-white px-2.5 py-1 font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                >
                  {slide.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </button>
                <button
                  type="button"
                  onClick={() => void remove(slide)}
                  className="rounded px-2.5 py-1 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
                >
                  ডিলিট
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {(editing !== null || form.title === "") && (
        <form
          onSubmit={submit}
          className="mt-6 grid gap-4 rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900/40 sm:grid-cols-2"
        >
          <Field name="title" label="শিরোনাম (Title)" value={form.title} onChange={(value) => setField("title", value)} />
          <Field name="subtitle" label="সাবটাইটেল" value={form.subtitle} onChange={(value) => setField("subtitle", value)} />
          <Field name="badgeText" label="টপ ব্যাজ" value={form.badgeText} onChange={(value) => setField("badgeText", value)} />
          <Field name="discountTag" label="ডিসকাউন্ট ট্যাগ" value={form.discountTag} onChange={(value) => setField("discountTag", value)} />
          <Field name="priceText" label="প্রাইজ ট্যাগ" value={form.priceText} onChange={(value) => setField("priceText", value)} />
          <Field name="ctaText" label="বাটন টেক্সট" value={form.ctaText} onChange={(value) => setField("ctaText", value)} />
          <Field name="imageUrl" label="ইমেজ URL" value={form.imageUrl} onChange={(value) => setField("imageUrl", value)} />
          <Field name="ctaLink" label="বাটন লিংক" value={form.ctaLink} onChange={(value) => setField("ctaLink", value)} />
          <Field name="order" label="ডিসপ্লে অর্ডার" value={String(form.order)} onChange={(value) => setField("order", Number(value))} type="number" />
          <input type="hidden" name="isActive" value={String(form.isActive)} />

          <div className="flex items-center gap-2 pt-4">
            <input
              type="checkbox"
              id="isActiveSlide"
              checked={form.isActive}
              onChange={(event) => setField("isActive", event.target.checked)}
              className="size-4 rounded accent-neutral-900"
            />
            <label htmlFor="isActiveSlide" className="font-semibold text-neutral-800 dark:text-neutral-200">
              হোমপেজে স্লাইড সক্রিয় থাকবে
            </label>
          </div>

          <div className="flex gap-2 sm:col-span-2 pt-2">
            <button
              disabled={busy}
              className="rounded-lg bg-neutral-900 px-5 py-2.5 font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
            >
              {busy ? "সংরক্ষণ হচ্ছে…" : "স্লাইড সংরক্ষণ করুন"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border border-neutral-300 px-4 py-2 font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300"
              >
                বাতিল
              </button>
            )}
          </div>
        </form>
      )}

      {message && <p aria-live="polite" className="mt-3 font-mono text-xs text-emerald-600 dark:text-emerald-400">{message}</p>}
    </section>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block font-semibold text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <input
        name={name}
        required={label !== "ডিসকাউন্ট ট্যাগ"}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field mt-1"
      />
    </div>
  );
}
