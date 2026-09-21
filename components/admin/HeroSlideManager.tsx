"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createHeroSlide, deleteHeroSlide, updateHeroSlide } from "@/actions/hero-slides";

type Slide = { id: string; title: string; subtitle: string; badgeText: string; discountTag: string; priceText: string; ctaText: string; ctaLink: string; imageUrl: string; order: number; isActive: boolean };
const empty = { title: "", subtitle: "", badgeText: "২০২৬ সামার গ্যাজেট কালেকশন", discountTag: "১০% ছাড়", priceText: "৳৬৯৯", ctaText: "কালেকশন দেখুন", ctaLink: "/products", imageUrl: "", order: 0, isActive: true };

export function HeroSlideManager({ initialSlides }: { initialSlides: Slide[] }) {
  const router = useRouter();
  const [slides, setSlides] = useState(initialSlides);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const setField = (key: keyof typeof empty, value: string | boolean | number) => setForm((current) => ({ ...current, [key]: value }));
  const openEdit = (slide: Slide) => { setEditing(slide.id); setForm({ title: slide.title, subtitle: slide.subtitle, badgeText: slide.badgeText, discountTag: slide.discountTag, priceText: slide.priceText, ctaText: slide.ctaText, ctaLink: slide.ctaLink, imageUrl: slide.imageUrl, order: slide.order, isActive: slide.isActive }); };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage("");
    const result = editing ? await updateHeroSlide(editing, form) : await createHeroSlide(new FormData(event.currentTarget as HTMLFormElement));
    if (result.success) { setMessage("স্লাইড সংরক্ষণ হয়েছে।"); setEditing(null); setForm(empty); router.refresh(); } else setMessage(result.error);
    setBusy(false);
  };
  const toggle = async (slide: Slide) => { const result = await updateHeroSlide(slide.id, { isActive: !slide.isActive }); if (result.success) setSlides((current) => current.map((item) => item.id === slide.id ? { ...item, isActive: !item.isActive } : item)); };
  const remove = async (slide: Slide) => { if (!window.confirm("এই স্লাইডটি ডিলিট করবেন?")) return; const result = await deleteHeroSlide(slide.id); if (result.success) setSlides((current) => current.filter((item) => item.id !== slide.id)); };
  return <section className="mt-6 rounded-3xl border border-slate-200 p-6 dark:border-white/10">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-black">হিরো স্লাইডার ম্যানেজার</h2><p className="mt-1 text-sm text-slate-500">হোমপেজের ব্যানার, অফার ও CTA ডাটাবেস থেকে নিয়ন্ত্রণ করুন।</p></div><button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="rounded-xl bg-cyan-500 px-4 py-3 text-sm font-black text-slate-950">+ নতুন স্লাইড</button></div>
    <div className="mt-5 grid gap-4 lg:grid-cols-3">{slides.map((slide) => <article key={slide.id} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10"><div className="relative aspect-video bg-slate-100 dark:bg-slate-800"><Image src={slide.imageUrl} alt="" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" /></div><div className="p-4"><p className="font-black">{slide.title}</p><p className="mt-1 text-xs text-slate-500">{slide.priceText} · {slide.discountTag}</p><div className="mt-4 flex gap-2"><button type="button" onClick={() => openEdit(slide)} className="rounded-lg bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950">এডিট</button><button type="button" onClick={() => void toggle(slide)} className="rounded-lg border px-3 py-2 text-xs font-bold">{slide.isActive ? "Active" : "Inactive"}</button><button type="button" onClick={() => void remove(slide)} className="rounded-lg px-3 py-2 text-xs font-bold text-rose-600">ডিলিট</button></div></div></article>)}</div>
    {(editing !== null || form.title === "") && <form onSubmit={submit} className="mt-6 grid gap-4 rounded-2xl bg-slate-50 p-5 dark:bg-white/[0.03] sm:grid-cols-2"><Field name="title" label="শিরোনাম" value={form.title} onChange={(value) => setField("title", value)} /><Field name="subtitle" label="সাবটাইটেল" value={form.subtitle} onChange={(value) => setField("subtitle", value)} /><Field name="badgeText" label="ব্যাজ" value={form.badgeText} onChange={(value) => setField("badgeText", value)} /><Field name="discountTag" label="ডিসকাউন্ট" value={form.discountTag} onChange={(value) => setField("discountTag", value)} /><Field name="priceText" label="দাম" value={form.priceText} onChange={(value) => setField("priceText", value)} /><Field name="ctaText" label="CTA টেক্সট" value={form.ctaText} onChange={(value) => setField("ctaText", value)} /><Field name="imageUrl" label="ইমেজ URL" value={form.imageUrl} onChange={(value) => setField("imageUrl", value)} /><Field name="ctaLink" label="CTA লিংক" value={form.ctaLink} onChange={(value) => setField("ctaLink", value)} /><Field name="order" label="অর্ডার" value={String(form.order)} onChange={(value) => setField("order", Number(value))} type="number" /><input type="hidden" name="isActive" value={String(form.isActive)} /><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.isActive} onChange={(event) => setField("isActive", event.target.checked)} /> সক্রিয়</label><div className="flex gap-2 sm:col-span-2"><button disabled={busy} className="rounded-xl bg-cyan-500 px-5 py-3 font-black text-slate-950">{busy ? "সংরক্ষণ হচ্ছে…" : "সংরক্ষণ করুন"}</button>{editing && <button type="button" onClick={() => setEditing(null)} className="rounded-xl border px-5 py-3 font-bold">বাতিল</button>}</div></form>}
    {message && <p aria-live="polite" className="mt-3 text-sm font-bold text-emerald-600">{message}</p>}
  </section>;
}
function Field({ label, name, value, onChange, type = "text" }: { label: string; name: string; value: string; onChange: (value: string) => void; type?: string }) { return <label className="text-sm font-bold">{label}<input name={name} required={label !== "ডিসকাউন্ট"} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="field mt-2" /></label>; }
