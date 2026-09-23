/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, DragEvent, FormEvent, useRef, useState } from "react";
import { createProduct, deleteProduct, updateProduct } from "@/actions/products";

type AdminProduct = { id: string; name: string; productCode: string; category: string; buyPrice: number; sellPrice: number; stock: number; isActive: boolean; isFeatured: boolean };

async function optimizeImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("শুধু ছবির ফাইল নির্বাচন করুন।");
  if (file.size > 10 * 1024 * 1024) throw new Error("ছবির আকার ১০ MB-এর কম হতে হবে।");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

export function ProductAdminPanel({ initialProducts }: { initialProducts: AdminProduct[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [products, setProducts] = useState(initialProducts);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [category, setCategory] = useState("মিনি ফ্যান");

  const refreshProduct = (id: string, patch: Partial<AdminProduct>) => setProducts((current) => current.map((product) => product.id === id ? { ...product, ...patch } : product));
  const changeStock = async (product: AdminProduct, delta: number) => {
    const stock = Math.max(0, product.stock + delta); setBusy(product.id); setError("");
    const result = await updateProduct(product.id, { stock });
    if (result.success) { refreshProduct(product.id, { stock }); router.refresh(); } else setError(result.error);
    setBusy("");
  };
  const toggleActive = async (product: AdminProduct) => {
    setBusy(product.id); setError("");
    const result = await updateProduct(product.id, { isActive: !product.isActive });
    if (result.success) { refreshProduct(product.id, { isActive: !product.isActive }); router.refresh(); } else setError(result.error);
    setBusy("");
  };
  const toggleFeatured = async (product: AdminProduct) => {
    setBusy(product.id); setError("");
    const result = await updateProduct(product.id, { isFeatured: !product.isFeatured });
    if (result.success) { refreshProduct(product.id, { isFeatured: !product.isFeatured }); router.refresh(); } else setError(result.error);
    setBusy("");
  };
  const remove = async (product: AdminProduct) => {
    if (!window.confirm(`"${product.name}" ডিলিট করতে চান?`)) return;
    setBusy(product.id); setError("");
    const result = await deleteProduct(product.id);
    if (result.success) { setProducts((current) => current.filter((item) => item.id !== product.id)); router.refresh(); } else setError(result.error);
    setBusy("");
  };
  const selectFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      setError("");
      setPreview(await optimizeImage(file));
    } catch (selectionError) {
      setPreview("");
      setError(selectionError instanceof Error ? selectionError.message : "ছবি প্রসেস করা যায়নি।");
    }
  };
  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => void selectFile(event.target.files?.[0]);
  const onDrop = (event: DragEvent<HTMLLabelElement>) => { event.preventDefault(); void selectFile(event.dataTransfer.files[0]); };
  const openModal = () => {
    formRef.current?.reset();
    setPreview("");
    setCategory("মিনি ফ্যান");
    setError("");
    setOpen(true);
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    if (!preview) { setError("প্রোডাক্টের একটি ছবি নির্বাচন করুন।"); return; }
    formData.set("imageData", preview);
    if (category === "অন্যান্য") {
      const customCategory = String(formData.get("customCategory") ?? "").trim();
      if (customCategory.length < 2) { setError("নতুন ক্যাটাগরির নাম লিখুন।"); return; }
      formData.set("category", customCategory);
    }
    setBusy("create"); setError("");
    const result = await createProduct(formData);
    if (result.success) { closeModal(); router.refresh(); } else setError(result.error);
    setBusy("");
  };
  const closeModal = () => {
    formRef.current?.reset();
    setOpen(false);
    setPreview("");
    setCategory("মিনি ফ্যান");
    setError("");
  };

  return <section className="mt-8 rounded-3xl border border-slate-200 p-6 dark:border-white/10">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-black text-slate-950 dark:text-white">প্রোডাক্ট তালিকা</h2>
      <button type="button" onClick={openModal} className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-cyan-300">+ নতুন প্রোডাক্ট</button>
    </div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{error}</p>}
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-white/10">
          <tr><th className="pb-3 pr-4">প্রোডাক্ট</th><th className="pb-3 pr-4">কোড</th><th className="pb-3 pr-4">ক্যাটাগরি</th><th className="pb-3 pr-4">ক্রয়মূল্য</th><th className="pb-3 pr-4">বিক্রয়মূল্য</th><th className="pb-3 pr-4">স্টক</th><th className="pb-3 pr-4">স্ট্যাটাস</th><th className="pb-3">অ্যাকশন</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {products.map((product) => (
            <tr key={product.id} className={!product.isActive ? "opacity-50" : ""}>
              <td className="py-3 pr-4 font-bold text-slate-900 dark:text-white">{product.name}</td>
              <td className="py-3 pr-4 font-mono text-xs">{product.productCode}</td>
              <td className="py-3 pr-4">{product.category}</td>
              <td className="py-3 pr-4">৳{product.buyPrice.toLocaleString("en-BD")}</td>
              <td className="py-3 pr-4">৳{product.sellPrice.toLocaleString("en-BD")}</td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <button type="button" disabled={busy === product.id} onClick={() => void changeStock(product, -1)} className="grid size-7 place-items-center rounded-lg border border-slate-200 text-sm font-black dark:border-white/10">−</button>
                  <span className="min-w-8 text-center font-bold">{product.stock}</span>
                  <button type="button" disabled={busy === product.id} onClick={() => void changeStock(product, 1)} className="grid size-7 place-items-center rounded-lg border border-slate-200 text-sm font-black dark:border-white/10">+</button>
                </div>
              </td>
              <td className="py-3 pr-4">
                <div className="flex flex-col gap-1">
                  <button type="button" disabled={busy === product.id} onClick={() => void toggleActive(product)} className={`rounded-lg px-2 py-1 text-xs font-bold ${product.isActive ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200" : "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300"}`}>{product.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}</button>
                  <button type="button" disabled={busy === product.id} onClick={() => void toggleFeatured(product)} className={`rounded-lg px-2 py-1 text-xs font-bold ${product.isFeatured ? "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200" : "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300"}`}>{product.isFeatured ? "ফিচার্ড" : "সাধারণ"}</button>
                </div>
              </td>
              <td className="py-3">
                <button type="button" disabled={busy === product.id} onClick={() => void remove(product)} className="rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300">ডিলিট</button>
              </td>
            </tr>
          ))}
          {products.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-slate-500">এখনো কোনো প্রোডাক্ট যোগ করা হয়নি।</td></tr>}
        </tbody>
      </table>
    </div>
    {open && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/15 bg-[#080d1a]/95 p-6 text-white shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-2xl font-black">নতুন প্রোডাক্ট</h2><button type="button" aria-label="Close add product modal" onClick={closeModal} className="text-2xl text-slate-400 hover:text-white">×</button></div><form ref={formRef} onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold">প্রোডাক্টের নাম<input required name="name" className="field mt-2 bg-[#0B0F19] text-white" /></label><label className="text-sm font-bold">প্রোডাক্ট কোড<input required name="productCode" pattern="[A-Z0-9-]+" placeholder="GAD-FAN-05" className="field mt-2 bg-[#0B0F19] text-white" /></label><label className="text-sm font-bold">ক্যাটাগরি<select required name="category" value={category} onChange={(event) => setCategory(event.target.value)} className="field mt-2 border-slate-700 bg-[#111827] text-white"><option className="bg-[#111827] text-white">মিনি ফ্যান</option><option className="bg-[#111827] text-white">চার্জার</option><option className="bg-[#111827] text-white">ছাতা</option><option className="bg-[#111827] text-white">কেবল</option><option className="bg-[#111827] text-white">অডিও</option><option className="bg-[#111827] text-white">অন্যান্য</option></select></label>{category === "অন্যান্য" && <label className="text-sm font-bold">নতুন ক্যাটাগরির নাম<input required name="customCategory" placeholder="যেমন: মনিটর, মোবাইল ডিসপ্লে, স্মার্টওয়াচ" className="field mt-2 bg-[#0B0F19] text-white" /></label>}<label className="text-sm font-bold">পাইকারি কেনা দাম<input required name="buyPrice" type="number" min="0" step="0.01" className="field mt-2 bg-[#0B0F19] text-white" /></label><label className="text-sm font-bold">বিক্রয় মূল্য<input required name="sellPrice" type="number" min="0" step="0.01" className="field mt-2 bg-[#0B0F19] text-white" /></label><label className="text-sm font-bold">রেগুলার মূল্য<input required name="originalPrice" type="number" min="0" step="0.01" className="field mt-2 bg-[#0B0F19] text-white" /></label><label className="text-sm font-bold">স্টক পরিমাণ<input required name="stock" type="number" min="0" step="1" defaultValue={0} className="field mt-2 bg-[#0B0F19] text-white" /></label><label onDragOver={(event) => event.preventDefault()} onDrop={onDrop} className="cursor-pointer rounded-2xl border border-dashed border-cyan-300/40 bg-cyan-300/5 p-4 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/10 sm:col-span-2"><span>ছবি আপলোড করুন</span><span className="mt-1 block text-xs font-normal text-slate-400">আপনার কম্পিউটার থেকে ছবি সিলেক্ট করুন বা এখানে ড্র্যাগ করুন</span><input required={!preview} name="productImage" type="file" accept="image/*" onChange={onFileChange} className="sr-only" />{preview && <span className="mt-4 flex items-center gap-3"><img src={preview} width="96" height="96" alt="Selected product preview" className="size-24 rounded-xl object-cover" /><button type="button" onClick={(clickEvent) => { clickEvent.preventDefault(); setPreview(""); }} className="rounded-lg bg-rose-500/20 px-3 py-2 text-xs text-rose-200">ছবি সরান</button></span>}</label>    <label className="text-sm font-bold sm:col-span-2">বিস্তারিত বিবরণ<textarea required name="description" rows={4} className="field mt-2 bg-[#0B0F19] text-white" /></label><label className="flex items-center gap-3 text-sm font-bold sm:col-span-2"><input name="isFeatured" value="true" type="checkbox" className="size-4 accent-cyan-500" /> হোমপেজে ফিচার্ড হিসেবে দেখান</label><div className="flex justify-end gap-3 sm:col-span-2"><button type="button" onClick={closeModal} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold">বাতিল</button><button type="submit" disabled={busy === "create"} className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-black text-slate-950">{busy === "create" ? "সংরক্ষণ হচ্ছে…" : "প্রোডাক্ট সংরক্ষণ করুন"}</button></div></form></div></div>}
  </section>;
}