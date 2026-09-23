"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Copy, CreditCard, MapPin, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { getCatalogProduct, type CatalogProduct } from "@/lib/catalog";
import { ImageOrIcon } from "@/components/shop/ImageOrIcon";

const deliveryOptions = [
  { value: "ঢাকার ভেতরে", fee: 70, label: "ঢাকার ভেতরে — ৳৭০" },
  { value: "ঢাকার বাইরে (সারা বাংলাদেশ)", fee: 150, label: "ঢাকার বাইরে (সারা বাংলাদেশ) — ৳১৫০" },
];

function CheckoutForm() {
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderIdCopied, setOrderIdCopied] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState(deliveryOptions[0].value);
  const deliveryFee = deliveryOptions.find((option) => option.value === deliveryZone)?.fee ?? 70;
  const handleZoneChange = (zone: string) => setDeliveryZone(zone);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedProduct = params.get("product");
    const requestedQuantity = Number(params.get("quantity") ?? "1");
    let nextQuantity = 1;
    if (Number.isInteger(requestedQuantity) && requestedQuantity > 0) nextQuantity = Math.min(requestedQuantity, 20);
    setQuantity(nextQuantity);
    if (requestedProduct) {
      const resolved = getCatalogProduct(requestedProduct);
      setProduct(resolved ?? null);
    } else {
      setProduct(null);
    }
    setLoading(false);
  }, []);

  const subtotal = product ? product.sellPrice * quantity : 0;
  const total = Math.max(subtotal + deliveryFee - discount, 0);
  const due = Math.max(total - 200, 0);

  const applyCoupon = async () => {
    setCouponMessage("");
    const response = await fetch(`/api/coupons/validate?code=${encodeURIComponent(couponCode)}&amount=${subtotal + deliveryFee}`);
    const result = await response.json();
    if (!response.ok) { setDiscount(0); setCouponMessage(result.error ?? "কুপনটি প্রযোজ্য নয়।"); return; }
    setDiscount(result.discount);
    setCouponMessage(`কুপন প্রয়োগ হয়েছে: ৳${result.discount}`);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!product) { setError("প্রথমে একটি পণ্য নির্বাচন করুন।"); return; }
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        quantity,
        customerName: form.get("name"),
        customerPhone: form.get("phone"),
        shippingAddress: form.get("address"),
        deliveryZone: form.get("zone"),
        deliveryFee,
        couponCode: couponCode || undefined,
        bKashSender: form.get("bkashSender") || undefined,
        transactionId: form.get("transactionId") || undefined,
        notes: form.get("notes"),
      }),
    });
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setError(result?.error ?? "অর্ডার তৈরি করা যায়নি।");
      return;
    }
    const result = await response.json().catch(() => null);
    setOrderNumber(result?.orderNumber ?? "");
    setSubmitted(true);
  };

  const copyNumber = async () => { await navigator.clipboard.writeText("01615869724"); setCopied(true); window.setTimeout(() => setCopied(false), 1800); };
  const copyOrderId = async () => { if (!orderNumber) return; await navigator.clipboard.writeText(orderNumber); setOrderIdCopied(true); window.setTimeout(() => setOrderIdCopied(false), 1800); };

  if (loading) {
    return <div className="mt-10 animate-pulse rounded-3xl border border-slate-200 p-8 text-center dark:border-white/10"><p className="text-slate-500">লোড হচ্ছে…</p></div>;
  }

  if (!product && !submitted) {
    return (
      <div className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-500/20 dark:bg-amber-950/20">
        <h2 className="text-xl font-black text-amber-800 dark:text-amber-300">কোনো পণ্য নির্বাচিত হয়নি</h2>
        <p className="mt-3 text-amber-700 dark:text-amber-400">অনুগ্রহ করে আগে একটি পণ্য বেছে নিন অথবা কার্ট থেকে চেকআউটে আসুন।</p>
        <Link href="/products" className="mt-6 inline-flex rounded-xl bg-cyan-500 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-300">পণ্য দেখুন</Link>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-600">Secure checkout</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl dark:text-white">Complete your order</h1>
        <p className="mt-3 text-slate-500">লগইন ছাড়াই দ্রুত অর্ডার করুন। Pay ৳200 advance via bKash. The remaining amount is payable on delivery.</p>
        <p className="mt-2 text-sm text-slate-500">Already have an account? <Link href="/login?callbackUrl=/checkout" className="font-bold text-cyan-600 underline-offset-4 hover:underline">Login here</Link></p>
      </div>
      {submitted ? (
        <div className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-8 shadow-lg dark:border-emerald-500/20 dark:bg-emerald-950/20">
          <h2 className="text-2xl font-black text-emerald-800 dark:text-emerald-300">🎉 আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!</h2>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-xl bg-white px-4 py-3 text-lg font-black tracking-wide text-emerald-800 shadow-sm dark:bg-emerald-950/40 dark:text-emerald-200">#{orderNumber || "সংরক্ষিত"}</span>
            <button type="button" onClick={() => void copyOrderId()} className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-3 text-sm font-black text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-transparent dark:text-emerald-200"><Copy size={16} /> {orderIdCopied ? "কপি হয়েছে" : "📋 অর্ডার আইডি কপি করুন"}</button>
          </div>
          <p className="mt-4 text-emerald-700 dark:text-emerald-400">আমরা দ্রুত bKash TrxID যাচাই করে পার্সেল পাঠিয়ে দেব।</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/track?orderId=${encodeURIComponent(orderNumber)}`} className="inline-flex rounded-xl bg-cyan-500 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-300">🔍 অর্ডার ট্র্যাক করুন</Link>
            <Link href="/" className="inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-black text-white transition hover:bg-emerald-500">হোমপেজে ফিরে যান</Link>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{error}</p>}
            <section className="rounded-3xl border border-slate-200 p-6 dark:border-white/10">
              <h2 className="flex items-center gap-2 text-lg font-black text-slate-950 dark:text-white"><MapPin size={19} className="text-cyan-600" /> Delivery details</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <input required name="name" autoComplete="name" placeholder="Full name…" className="field" />
                <input required name="phone" inputMode="tel" autoComplete="tel" placeholder="Mobile number…" className="field" />
                <textarea required name="address" autoComplete="street-address" placeholder="Full delivery address…" rows={3} className="field sm:col-span-2" />
                <select required name="zone" aria-label="Delivery zone" value={deliveryZone} onChange={(event) => handleZoneChange(event.target.value)} className="field">
                  {deliveryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <input name="notes" placeholder="Order notes (optional)…" className="field" />
              </div>
            </section>
            <section className="rounded-3xl border border-slate-200 p-6 dark:border-white/10">
              <h2 className="flex items-center gap-2 text-lg font-black text-slate-950 dark:text-white"><CreditCard size={19} className="text-cyan-600" /> Advance payment</h2>
              <div className="mt-5 rounded-2xl bg-[#e2136e]/10 p-4 text-sm leading-6 text-slate-700 dark:text-slate-200">
                <div className="flex flex-wrap items-center gap-4">
                  <Image src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=01615869724" width={140} height={140} sizes="140px" alt="bKash payment QR code for 01615869724" className="rounded-xl bg-white p-2" unoptimized />
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-[#e2136e]">অর্ডার কনফার্ম করার জন্য ২০০ টাকা advance Send Money করুন: ০১৬৫৮৬৯৭২৪ (Personal)। ট্রানজেকশন যাচাইয়ের জন্য নিচের তথ্য দিন।</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-white px-3 py-2 font-black tracking-wide text-slate-900">01615869724</span>
                      <button type="button" title={copied ? "Number copied" : "Copy bKash number"} onClick={copyNumber} className="inline-flex items-center gap-1.5 rounded-lg bg-[#e2136e] px-3 py-2 text-xs font-bold text-white transition hover:opacity-90">{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy Number"}</button>
                    </div>
                  </div>
                </div>
                <p className="mt-3">আমাদের টিম TrxID ম্যানুয়ালি যাচাই করে অর্ডার নিশ্চিত করবে।</p>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input required name="bkashSender" inputMode="tel" pattern="01[3-9][0-9]{8}" title="সঠিক ১১ সংখ্যার বিকাশ নম্বর দিন" placeholder="বিকাশ নম্বর (০১XXXXXXXXX)…" className="field" />
                <input required name="transactionId" minLength={4} placeholder="বিকাশ TrxID…" className="field" />
              </div>
            </section>
          </div>
          <aside className="h-fit rounded-3xl border border-slate-200 p-6 dark:border-white/10">
            <h2 className="font-black text-slate-950 dark:text-white">Order summary</h2>
            {product && (
              <div className="mt-5 flex gap-3">
                <span className="grid size-14 place-items-center overflow-hidden rounded-xl bg-cyan-50 p-1 text-3xl">
                  <ImageOrIcon src={product.images[0] ?? product.icon} alt="" sizes="56px" className="size-full object-contain" />
                </span>
                <div><p className="font-bold">{product.name}</p><p className="text-sm text-slate-500">Qty {quantity}</p></div>
                <strong className="ml-auto">৳{subtotal.toLocaleString("en-BD")}</strong>
              </div>
            )}
            <div className="mt-5 flex gap-2">
              <input value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} placeholder="কুপন কোড" className="field min-w-0 flex-1" />
              <button type="button" onClick={() => void applyCoupon()} className="rounded-xl bg-violet-500 px-3 text-xs font-black text-white">প্রয়োগ</button>
            </div>
            {couponMessage && <p className="mt-2 text-xs font-bold text-emerald-600">{couponMessage}</p>}
            <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm dark:border-white/10">
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>৳{subtotal.toLocaleString("en-BD")}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Delivery fee</span><span>৳{deliveryFee}</span></div>
              <div className="flex justify-between text-lg font-black"><span>Total</span><span>৳{total}</span></div>
              <div className="flex justify-between text-cyan-700 dark:text-cyan-300"><span>Advance due now</span><span>৳200</span></div>
              <div className="flex justify-between font-bold"><span>Cash on delivery</span><span>৳{due}</span></div>
            </div>
            <button type="submit" disabled={!product} className="mt-6 w-full rounded-xl bg-cyan-500 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50">Place order for verification</button>
            <p className="mt-4 flex gap-2 text-xs leading-5 text-slate-500"><ShieldCheck size={15} className="shrink-0 text-emerald-600" /> Your payment details are used only to verify this order.</p>
          </aside>
        </form>
      )}
    </>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-12 lg:px-8">
        <Suspense fallback={<div className="mt-10 animate-pulse rounded-3xl border border-slate-200 p-8 text-center dark:border-white/10"><p className="text-slate-500">লোড হচ্ছে…</p></div>}>
          <CheckoutForm />
        </Suspense>
      </main>
    </>
  );
}