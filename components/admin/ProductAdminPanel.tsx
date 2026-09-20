/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, DragEvent, useState } from "react";
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
      setError(selectionError instanceof Error ? selectionError.message : "ছবি প্রসেস করা যায়নি।");
    }
  };
  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => void selectFile(event.target.files?.[0]);
  const onDrop = (event: DragEvent<HTMLLabelElement>) => { event.preventDefault(); void selectFile(event.dataTransfer.files[0]); };
  const submit = async (formData: FormData) => {
    if (!preview) { setError("প্রোডাক্টের একটি ছবি নির্বাচন করুন।"); return; }
    formData.set("imageData", preview);
    if (category === "অন্যান্য") {
      const customCategory = String(formData.get("customCategory") ?? "").trim();
      if (customCategory.length < 2) { setError("নতুন ক্যাটাগরির নাম লিখুন।"); return; }
      formData.set("category", customCategory);
    }
    setBusy("create"); setError("");
    const result = await createProduct(formData);
    if (result.success) { setOpen(false); setPreview(""); router.refresh(); } else setError(result.error);
    setBusy("");
  };
  const closeModal = () => { setOpen(false); setPreview(""); setCategory("মিনি ফ্যান"); setError(""); };

  return <section className="mt-8 rounded-3xl border border-slate-200 p-6 dark:border-white/10">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-black">ইনভেন্টরি ও প্রোডাক্ট তালিকা</h2><p className="mt-1 text-sm text-slate-500">স্টক, দৃশ্যমানতা ও ক্যাটালগ নিয়ন্ত্রণ করুন।</p></div><button type="button" onClick={() => setOpen(true)} className="rounded-xl bg-cyan-500 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300">+ নতুন প্রোডাক্ট যুক্ত করুন</button></div>
    <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="text-xs uppercase tracking-wider text-slate-400"><tr><th className="pb-3">Product</th><th className="pb-3">Price</th><th className="pb-3">Stock</th><th className="pb-3">Visibility</th><th className="pb-3">Featured</th><th className="pb-3">Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-t border-slate-100 dark:border-white/10"><td className="py-4"><p className="font-bold">{product.name}</p><p className="text-xs text-slate-400">{product.productCode} · {product.category}</p></td><td className="py-4">৳{product.sellPrice.toLocaleString("en-BD")}<span className="block text-xs text-slate-400">Cost ৳{product.buyPrice.toLocaleString("en-BD")}</span></td><td className="py-4"><div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-white/10"><button type="button" disabled={busy === product.id || product.stock === 0} onClick={() => void changeStock(product, -1)} className="px-3 py-2 font-black disabled:opacity-40">−</button>    <span className={`min-w-10 text-center font-bold ${product.stock < 5 ? "text-amber-500" : ""}`}>{product.stock}{product.stock < 5 && <span className="ml-2 inline-block animate-pulse rounded-full bg-amber-400/20 px-1.5 py-0.5 text-[10px] text-amber-600">স্টক কম</span>}</span><button type="button" disabled={busy === product.id} onClick={() => void changeStock(product, 1)} className="px-3 py-2 font-black disabled:opacity-40">+</button></div></td><td className="py-4"><button type="button" disabled={busy === product.id} onClick={() => void toggleActive(product)} className={`rounded-full px-3 py-1 text-xs font-bold ${product.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{product.isActive ? "Active" : "Inactive"}</button></td><td className="py-4"><button type="button" disabled={busy === product.id} onClick={() => void toggleFeatured(product)} className={`rounded-full px-3 py-1 text-xs font-bold ${product.isFeatured ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>{product.isFeatured ? "Featured" : "—"}</button></td><td className="py-4"><button type="button" disabled={busy === product.id} onClick={() => void remove(product)} className="text-xs font-bold text-rose-600 hover:text-rose-500 disabled:opacity-40">ডিলিট</button></td></tr>)}</tbody></table></div>
    {error && <p role="alert" className="mt-4 text-sm font-semibold text-rose-500">{error}</p>}
    {open && <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/70 p-5 backdrop-blur-sm"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/15 bg-[#080d1a]/95 p-6 text-white shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-2xl font-black">নতুন প্রোডাক্ট</h2><button type="button" aria-label="Close add product modal" onClick={closeModal} className="text-2xl text-slate-400 hover:text-white">×</button></div><form action={submit} className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold">প্রোডাক্টের নাম<input required name="name" className="field mt-2 bg-[#0B0F19] text-white" /></label><label className="text-sm font-bold">প্রোডাক্ট কোড<input required name="productCode" pattern="[A-Z0-9-]+" placeholder="GAD-FAN-05" className="field mt-2 bg-[#0B0F19] text-white" /></label><label className="text-sm font-bold">ক্যাটাগরি<select required name="category" value={category} onChange={(event) => setCategory(event.target.value)} className="field mt-2 border-slate-700 bg-[#111827] text-white"><option className="bg-[#111827] text-white">মিনি ফ্যান</option><option className="bg-[#111827] text-white">চার্জার</option><option className="bg-[#111827] text-white">ছাতা</option><option className="bg-[#111827] text-white">কেবল</option><option className="bg-[#111827] text-white">অডিও</option><option className="bg-[#111827] text-white">অন্যান্য</option></select></label>{category === "অন্যান্য" && <label className="text-sm font-bold">নতুন ক্যাটাগরির নাম<input required name="customCategory" placeholder="যেমন: মনিটর, মোবাইল ডিসপ্লে, স্মার্টওয়াচ" className="field mt-2 bg-[#0B0F19] text-white" /></label>}<label className="text-sm font-bold">পাইকারি কেনা দাম<input required name="buyPrice" type="number" min="0" step="0.01" className="field mt-2 bg-[#0B0F19] text-white" /></label><label className="text-sm font-bold">বিক্রয় মূল্য<input required name="sellPrice" type="number" min="0" step="0.01" className="field mt-2 bg-[#0B0F19] text-white" /></label><label className="text-sm font-bold">রেগুলার মূল্য<input required name="originalPrice" type="number" min="0" step="0.01" className="field mt-2 bg-[#0B0F19] text-white" /></label><label className="text-sm font-bold">স্টক পরিমাণ<input required name="stock" type="number" min="0" step="1" className="field mt-2 bg-[#0B0F19] text-white" /></label><label onDragOver={(event) => event.preventDefault()} onDrop={onDrop} className="cursor-pointer rounded-2xl border border-dashed border-cyan-300/40 bg-cyan-300/5 p-4 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/10 sm:col-span-2"><span>ছবি আপলোড করুন</span><span className="mt-1 block text-xs font-normal text-slate-400">আপনার কম্পিউটার থেকে ছবি সিলেক্ট করুন বা এখানে ড্র্যাগ করুন</span><input required={!preview} name="productImage" type="file" accept="image/*" onChange={onFileChange} className="sr-only" />{preview && <span className="mt-4 flex items-center gap-3"><img src={preview} width="96" height="96" alt="Selected product preview" className="size-24 rounded-xl object-cover" /><button type="button" onClick={(event) => { event.preventDefault(); setPreview(""); }} className="rounded-lg bg-rose-500/20 px-3 py-2 text-xs text-rose-200">ছবি সরান</button></span>}</label>    <label className="text-sm font-bold sm:col-span-2">বিস্তারিত বিবরণ<textarea required name="description" rows={4} className="field mt-2 bg-[#0B0F19] text-white" /></label><label className="flex items-center gap-3 text-sm font-bold sm:col-span-2"><input name="isFeatured" value="true" type="checkbox" className="size-4 accent-cyan-500" /> হোমপেজে ফিচার্ড হিসেবে দেখান</label><div className="flex justify-end gap-3 sm:col-span-2"><button type="button" onClick={closeModal} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold">বাতিল</button><button disabled={busy === "create"} className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-black text-slate-950">{busy === "create" ? "সংরক্ষণ হচ্ছে…" : "প্রোডাক্ট সংরক্ষণ করুন"}</button></div></form></div></div>}
  </section>;
}
