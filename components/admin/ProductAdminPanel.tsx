/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, DragEvent, FormEvent, useRef, useState } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { createProduct, deleteProduct, updateProduct } from "@/actions/products";

type AdminProduct = {
  id: string;
  name: string;
  productCode: string;
  category: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
};

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

const CATEGORY_OPTIONS = [
  { value: "SMART GADGET", label: "স্মার্ট গ্যাজেট (SMART GADGET)" },
  { value: "CHARGER", label: "ফাস্ট চার্জার (CHARGER)" },
  { value: "AUDIO", label: "অডিও ও ইয়ারবাডস (AUDIO)" },
  { value: "CABLE", label: "ক্যাবল ও অ্যাক্সেসরিজ (CABLE)" },
  { value: "অন্যান্য", label: "অন্যান্য (নতুন ক্যাটাগরি লিখুন)" },
];

export function ProductAdminPanel({ initialProducts }: { initialProducts: AdminProduct[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [products, setProducts] = useState(initialProducts);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [category, setCategory] = useState("SMART GADGET");

  const refreshProduct = (id: string, patch: Partial<AdminProduct>) =>
    setProducts((current) =>
      current.map((product) => (product.id === id ? { ...product, ...patch } : product))
    );

  const changeStock = async (product: AdminProduct, delta: number) => {
    const stock = Math.max(0, product.stock + delta);
    setBusy(product.id);
    setError("");
    const result = await updateProduct(product.id, { stock });
    if (result.success) {
      refreshProduct(product.id, { stock });
      router.refresh();
    } else setError(result.error);
    setBusy("");
  };

  const toggleActive = async (product: AdminProduct) => {
    setBusy(product.id);
    setError("");
    const result = await updateProduct(product.id, { isActive: !product.isActive });
    if (result.success) {
      refreshProduct(product.id, { isActive: !product.isActive });
      router.refresh();
    } else setError(result.error);
    setBusy("");
  };

  const toggleFeatured = async (product: AdminProduct) => {
    setBusy(product.id);
    setError("");
    const result = await updateProduct(product.id, { isFeatured: !product.isFeatured });
    if (result.success) {
      refreshProduct(product.id, { isFeatured: !product.isFeatured });
      router.refresh();
    } else setError(result.error);
    setBusy("");
  };

  const remove = async (product: AdminProduct) => {
    if (!window.confirm(`"${product.name}" ডিলিট করতে চান?`)) return;
    setBusy(product.id);
    setError("");
    const result = await deleteProduct(product.id);
    if (result.success) {
      setProducts((current) => current.filter((item) => item.id !== product.id));
      router.refresh();
    } else setError(result.error);
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
  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    void selectFile(event.dataTransfer.files[0]);
  };

  const openModal = () => {
    formRef.current?.reset();
    setPreview("");
    setCategory("SMART GADGET");
    setError("");
    setOpen(true);
  };

  const closeModal = () => {
    formRef.current?.reset();
    setOpen(false);
    setPreview("");
    setCategory("SMART GADGET");
    setError("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    if (!preview) {
      setError("প্রোডাক্টের একটি ছবি নির্বাচন করুন।");
      return;
    }
    formData.set("imageData", preview);
    if (category === "অন্যান্য") {
      const customCategory = String(formData.get("customCategory") ?? "").trim();
      if (customCategory.length < 2) {
        setError("নতুন ক্যাটাগরির নাম লিখুন।");
        return;
      }
      formData.set("category", customCategory);
    }
    setBusy("create");
    setError("");
    const result = await createProduct(formData);
    if (result.success) {
      closeModal();
      router.refresh();
    } else setError(result.error);
    setBusy("");
  };

  return (
    <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4 dark:border-neutral-800">
        <div>
          <h2 className="text-lg font-bold text-neutral-950 dark:text-white">প্রোডাক্ট ইনভেন্টরি ক্যাটালগ</h2>
          <p className="mt-1 text-xs text-neutral-500">
            স্টোরফ্রন্টের সকল সক্রিয় গ্যাজেট, দাম ও স্টক নিয়ন্ত্রণ করুন।
          </p>
        </div>
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
        >
          <Plus size={14} />
          <span>নতুন প্রোডাক্ট যোগ করুন</span>
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-rose-300 bg-rose-50 p-3 font-mono text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300"
        >
          {error}
        </p>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm font-mono text-xs">
          <thead className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800">
            <tr>
              <th className="pb-3 pr-4 uppercase">প্রোডাক্ট</th>
              <th className="pb-3 pr-4 uppercase">কোড</th>
              <th className="pb-3 pr-4 uppercase">ক্যাটাগরি</th>
              <th className="pb-3 pr-4 uppercase">ক্রয়মূল্য</th>
              <th className="pb-3 pr-4 uppercase">বিক্রয়মূল্য</th>
              <th className="pb-3 pr-4 uppercase">স্টক</th>
              <th className="pb-3 pr-4 uppercase">স্ট্যাটাস</th>
              <th className="pb-3 uppercase">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {products.map((product) => (
              <tr key={product.id} className={!product.isActive ? "opacity-50" : ""}>
                <td className="py-3.5 pr-4 font-sans font-bold text-neutral-900 dark:text-white">
                  {product.name}
                </td>
                <td className="py-3.5 pr-4 text-neutral-500">{product.productCode}</td>
                <td className="py-3.5 pr-4">{product.category}</td>
                <td className="py-3.5 pr-4">৳{product.buyPrice.toLocaleString("en-BD")}</td>
                <td className="py-3.5 pr-4 font-bold text-neutral-900 dark:text-white">৳{product.sellPrice.toLocaleString("en-BD")}</td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={busy === product.id}
                      onClick={() => void changeStock(product, -1)}
                      className="grid size-6 place-items-center rounded border border-neutral-200 text-xs font-bold transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center font-bold text-neutral-900 dark:text-white">
                      {product.stock}
                    </span>
                    <button
                      type="button"
                      disabled={busy === product.id}
                      onClick={() => void changeStock(product, 1)}
                      className="grid size-6 place-items-center rounded border border-neutral-200 text-xs font-bold transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={busy === product.id}
                      onClick={() => void toggleActive(product)}
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        product.isActive
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                          : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      {product.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                    </button>
                    <button
                      type="button"
                      disabled={busy === product.id}
                      onClick={() => void toggleFeatured(product)}
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        product.isFeatured
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                          : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      {product.isFeatured ? "ফিচার্ড" : "সাধারণ"}
                    </button>
                  </div>
                </td>
                <td className="py-3.5">
                  <button
                    type="button"
                    disabled={busy === product.id}
                    onClick={() => void remove(product)}
                    className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
                  >
                    <Trash2 size={13} />
                    <span>ডিলিট</span>
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-neutral-400">
                  এখনো কোনো প্রোডাক্ট যোগ করা হয়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
              <h2 className="text-lg font-bold text-neutral-950 dark:text-white">নতুন প্রোডাক্ট যোগ করুন</h2>
              <button
                type="button"
                aria-label="Close modal"
                onClick={closeModal}
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form ref={formRef} onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  প্রোডাক্টের নাম
                </label>
                <input required name="name" className="field mt-1.5" placeholder="যেমন: QCY GT2 Smart Watch…" />
              </div>
              <div>
                <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  প্রোডাক্ট কোড (SKU)
                </label>
                <input
                  required
                  name="productCode"
                  pattern="[A-Z0-9-]+"
                  placeholder="GAD-WCH-01"
                  className="field mt-1.5 uppercase font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  ক্যাটাগরি
                </label>
                <select
                  required
                  name="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="field mt-1.5"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {category === "অন্যান্য" && (
                <div>
                  <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    নতুন ক্যাটাগরির নাম
                  </label>
                  <input
                    required
                    name="customCategory"
                    placeholder="যেমন: স্মার্ট রিং, পাওয়ার ব্যাংক…"
                    className="field mt-1.5"
                  />
                </div>
              )}

              <div>
                <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  পাইকারি কেনা দাম (Cost BDT)
                </label>
                <input required name="buyPrice" type="number" min="0" step="0.01" className="field mt-1.5 font-mono" />
              </div>
              <div>
                <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  বিক্রয় মূল্য (Offer Price BDT)
                </label>
                <input required name="sellPrice" type="number" min="0" step="0.01" className="field mt-1.5 font-mono" />
              </div>
              <div>
                <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  রেগুলার মূল্য (Original BDT)
                </label>
                <input required name="originalPrice" type="number" min="0" step="0.01" className="field mt-1.5 font-mono" />
              </div>
              <div>
                <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  প্রাথমিক স্টক পরিমাণ
                </label>
                <input required name="stock" type="number" min="0" step="1" defaultValue={10} className="field mt-1.5 font-mono" />
              </div>

              <div className="sm:col-span-2">
                <label
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={onDrop}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center transition hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <Upload size={20} className="text-neutral-500" />
                  <span className="mt-2 font-mono text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-200">
                    প্রোডাক্টের ছবি আপলোড করুন
                  </span>
                  <span className="mt-0.5 text-[11px] text-neutral-400">
                    কম্পিউটার থেকে ছবি ড্র্যাগ করুন অথবা ক্লিক করে ফাইল সিলেক্ট করুন
                  </span>
                  <input
                    required={!preview}
                    name="productImage"
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="sr-only"
                  />
                  {preview && (
                    <div className="mt-4 flex items-center gap-3">
                      <img
                        src={preview}
                        width="80"
                        height="80"
                        alt="Preview"
                        className="size-20 rounded-lg border border-neutral-200 object-cover dark:border-neutral-700"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPreview("");
                        }}
                        className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs text-rose-500 dark:border-neutral-700 dark:bg-neutral-800"
                      >
                        ছবি সরান
                      </button>
                    </div>
                  )}
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  বিস্তারিত বিবরণ
                </label>
                <textarea required name="description" rows={3} className="field mt-1.5" />
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  <input name="isFeatured" value="true" type="checkbox" className="size-4 rounded accent-neutral-900" />
                  <span>হোমপেজের ফিচার্ড কালেকশনে প্রদর্শন করুন</span>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 sm:col-span-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-neutral-300 px-4 py-2 font-mono text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={busy === "create"}
                  className="rounded-lg bg-neutral-900 px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                >
                  {busy === "create" ? "সংরক্ষণ হচ্ছে…" : "প্রোডাক্ট সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
