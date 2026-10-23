"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Copy, CreditCard, MapPin, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { CatalogProduct } from "@/lib/catalog";
import { ImageOrIcon } from "@/components/shop/ImageOrIcon";
import { useCart } from "@/components/CartProvider";

const deliveryOptions = [
  { value: "ঢাকার ভেতরে", fee: 70, label: "ঢাকার ভেতরে — ৳৭০" },
  { value: "ঢাকার বাইরে (সারা বাংলাদেশ)", fee: 150, label: "ঢাকার বাইরে (সারা বাংলাদেশ) — ৳১৫০" },
];

function CheckoutForm() {
  const { items: cartItems, clearCart } = useCart();
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
    const resolveProduct = async () => {
      const params = new URLSearchParams(window.location.search);
      const requestedProduct = params.get("product");
      const requestedQuantity = Number(params.get("quantity") ?? "1");
      if (Number.isInteger(requestedQuantity) && requestedQuantity > 0) {
        setQuantity(Math.min(requestedQuantity, 20));
      }

      try {
        if (requestedProduct) {
          const res = await fetch(`/api/products?lookup=${encodeURIComponent(requestedProduct)}`);
          if (res.ok) {
            const data = await res.json();
            if (data && !data.error && !Array.isArray(data)) {
              setProduct(data);
              return;
            }
          }
          const allRes = await fetch("/api/products");
          if (allRes.ok) {
            const list: CatalogProduct[] = await allRes.json();
            const found = list.find((p) => p.slug === requestedProduct || p.id === requestedProduct || p.productCode === requestedProduct);
            if (found) {
              setProduct(found);
              return;
            }
          }
        } else if (cartItems.length > 0) {
          const allRes = await fetch("/api/products");
          if (allRes.ok) {
            const list: CatalogProduct[] = await allRes.json();
            const found = list.find((p) => p.id === cartItems[0].productId);
            if (found) {
              setProduct(found);
              setQuantity(cartItems[0].quantity);
              return;
            }
          }
        }
        setProduct(null);
      } catch (err) {
        console.error("Failed to load checkout product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    void resolveProduct();
  }, [cartItems]);

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
    clearCart();
  };

  const copyNumber = async () => { await navigator.clipboard.writeText("01615869724"); setCopied(true); window.setTimeout(() => setCopied(false), 1800); };
  const copyOrderId = async () => { if (!orderNumber) return; await navigator.clipboard.writeText(orderNumber); setOrderIdCopied(true); window.setTimeout(() => setOrderIdCopied(false), 1800); };

  if (loading) {
    return (
      <div className="mt-10 rounded-2xl border border-neutral-200 p-12 text-center dark:border-neutral-800">
        <p className="font-mono text-xs uppercase tracking-wider text-neutral-500">লোড হচ্ছে…</p>
      </div>
    );
  }

  if (!product && !submitted) {
    return (
      <div className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900/40">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">কোনো পণ্য নির্বাচিত হয়নি</h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          অনুগ্রহ করে আগে একটি গ্যাজেট বেছে নিন অথবা কার্ট থেকে চেকআউটে আসুন।
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-lg bg-neutral-900 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-900"
        >
          গ্যাজেট ব্রাউজ করুন
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl border-b border-neutral-200/80 pb-6 dark:border-neutral-800">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          SECURE CHECKOUT // ADVANCE ৳200
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
          আপনার অর্ডার সম্পন্ন করুন
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          লগইন ছাড়াই দ্রুততম অর্ডার। বিকাশে ২০০ টাকা অগ্রিম পাঠিয়ে নিশ্চিত করুন, অবশিষ্ট মূল্য পণ্য হাতে পেয়ে পরিশোধ।
        </p>
      </div>

      {submitted ? (
        <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 dark:border-emerald-500/20 dark:bg-emerald-950/20">
          <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">ORDER RECEIVED</div>
          <h2 className="mt-1 text-xl font-bold text-neutral-950 dark:text-white">
            আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!
          </h2>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-lg border border-neutral-300 bg-white px-4 py-2 font-mono text-base font-bold text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
              #{orderNumber || "সংরক্ষিত"}
            </span>
            <button
              type="button"
              onClick={() => void copyOrderId()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-2 font-mono text-xs font-semibold text-neutral-800 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              <Copy size={13} />
              <span>{orderIdCopied ? "কপি হয়েছে" : "অর্ডার আইডি কপি"}</span>
            </button>
          </div>
          <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            আমাদের সেন্ট্রাল টিম দ্রুত bKash TrxID যাচাই করে পার্সেল সেন্ট্রাল ঢাকা হাব থেকে হ্যান্ডওভার করবে।
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/track?orderId=${encodeURIComponent(orderNumber)}`}
              className="inline-flex rounded-lg bg-neutral-900 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-900"
            >
              অর্ডার ট্র্যাক করুন
            </Link>
            <Link
              href="/"
              className="inline-flex rounded-lg border border-neutral-300 bg-white px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-900 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            >
              হোমপেজে ফিরে যান
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {error && (
              <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-3 font-mono text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
                {error}
              </p>
            )}

            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
              <h2 className="flex items-center gap-2 text-base font-bold text-neutral-950 dark:text-white">
                <MapPin size={17} className="text-neutral-700 dark:text-neutral-300" />
                <span>ডেলিভারি ঠিকানা ও তথ্য</span>
              </h2>
              <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
                <input required name="name" autoComplete="name" placeholder="আপনার সম্পূর্ণ নাম…" className="field" />
                <input required name="phone" inputMode="tel" autoComplete="tel" pattern="01[0-9]{9}" title="সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (যেমন: 01712345678)" placeholder="মোবাইল নম্বর (০১XXXXXXXXX)…" className="field" />
                <textarea required name="address" autoComplete="street-address" placeholder="বিস্তারিত ডেলিভারি ঠিকানা (বাসা/রোড/এলাকা/জেলা)…" rows={3} className="field sm:col-span-2" />
                <select required name="zone" aria-label="ডেলিভারি জোন" value={deliveryZone} onChange={(event) => handleZoneChange(event.target.value)} className="field">
                  {deliveryOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <input name="notes" placeholder="অর্ডার সংক্রান্ত বিশেষ কোনো নোট (অপশনাল)…" className="field" />
              </div>
            </section>

            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
              <h2 className="flex items-center gap-2 text-base font-bold text-neutral-950 dark:text-white">
                <CreditCard size={17} className="text-neutral-700 dark:text-neutral-300" />
                <span>বিকাশ ২০০ টাকা অগ্রিম পেমেন্ট</span>
              </h2>
              <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
                <div className="flex flex-wrap items-center gap-4">
                  <Image
                    src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=01615869724"
                    width={130}
                    height={130}
                    sizes="130px"
                    alt="bKash QR code for 01615869724"
                    className="rounded-lg border border-neutral-200 bg-white p-2 dark:border-neutral-700"
                    unoptimized
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold leading-relaxed text-neutral-800 dark:text-neutral-200">
                      অর্ডার নিশ্চিত করতে <strong>৳২০০</strong> টাকা Send Money করুন: <strong className="font-mono text-neutral-950 dark:text-white">01615869724</strong> (Personal bKash)।
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                        01615869724
                      </span>
                      <button
                        type="button"
                        onClick={copyNumber}
                        className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-2.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
                      >
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copied ? "কপি হয়েছে" : "নম্বর কপি করুন"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
                <input required name="bkashSender" inputMode="tel" pattern="01[3-9][0-9]{8}" title="সঠিক ১১ সংখ্যার বিকাশ নম্বর দিন (যেমন: 01712345678)" placeholder="যে নম্বর থেকে বিকাশ করেছেন (০১XXXXXXXXX)…" className="field" />
                <input required name="transactionId" minLength={4} pattern="[A-Za-z0-9]+" title="সঠিক বিকাশ TrxID দিন" placeholder="বিকাশ TrxID (যেমন: BL45K9X)…" className="field uppercase" />
              </div>
            </section>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              ORDER SUMMARY
            </h2>
            {product && (
              <div className="mt-4 flex gap-3 border-b border-neutral-100 pb-4 dark:border-neutral-800">
                <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                  <ImageOrIcon src={product.images[0] ?? product.icon} alt="" sizes="56px" className="size-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">{product.name}</p>
                  <p className="font-mono text-xs text-neutral-500">পরিমাণ: {quantity}</p>
                </div>
                <strong className="font-mono text-sm text-neutral-900 dark:text-white">
                  ৳{subtotal.toLocaleString("en-BD")}
                </strong>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <input value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} placeholder="কুপন কোড…" className="field min-w-0 flex-1 uppercase" />
              <button type="button" onClick={() => void applyCoupon()} className="rounded-lg bg-neutral-900 px-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900">
                প্রয়োগ
              </button>
            </div>
            {couponMessage && <p className="mt-2 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">{couponMessage}</p>}

            <div className="mt-5 space-y-2.5 border-t border-neutral-100 pt-4 font-mono text-xs dark:border-neutral-800">
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                <span>সাবটোটাল</span>
                <span className="text-neutral-900 dark:text-white">৳{subtotal.toLocaleString("en-BD")}</span>
              </div>
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                <span>ডেলিভারি ফি ({deliveryZone})</span>
                <span className="text-neutral-900 dark:text-white">৳{deliveryFee}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>ডিসকাউন্ট</span>
                  <span>-৳{discount}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-neutral-200 pt-2.5 text-sm font-bold text-neutral-950 dark:border-neutral-700 dark:text-white">
                <span>মোট মূল্য</span>
                <span>৳{total.toLocaleString("en-BD")}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-300 font-semibold">
                <span>বিকাশ অগ্রিম</span>
                <span>৳২০০</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white">
                <span>ক্যাশ অন ডেলিভারি</span>
                <span>৳{due.toLocaleString("en-BD")}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!product}
              className="mt-6 w-full rounded-xl bg-neutral-900 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
            >
              অর্ডার কনফার্ম করুন
            </button>
            <p className="mt-3 flex items-center gap-1.5 text-center justify-center font-mono text-[11px] text-neutral-500">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>নিরাপদ ও ম্যানুয়ালি ভেরিফাইড ট্রানজেকশন</span>
            </p>
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Suspense fallback={<div className="mt-10 rounded-2xl border border-neutral-200 p-12 text-center dark:border-neutral-800"><p className="font-mono text-xs uppercase tracking-wider text-neutral-500">লোড হচ্ছে…</p></div>}>
          <CheckoutForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
