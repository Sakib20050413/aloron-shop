"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Clock3, PackageCheck, Search, Truck } from "lucide-react";
import { Navbar } from "@/components/Navbar";

type TrackedOrder = { orderNumber: string; orderStatus: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"; totalAmount: number; dueAmount: number; trackingNumber: string | null; createdAt: string; maskedPhone: string; maskedAddress: string };
const steps = [["PENDING", "অর্ডার গৃহীত হয়েছে", Check], ["CONFIRMED", "প্যাকেজিং চলছে", Clock3], ["SHIPPED", "কুরিয়ারে হস্তান্তর", Truck], ["DELIVERED", "ডেলিভারি সম্পন্ন", PackageCheck]] as const;

export default function TrackPage() {
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("orderId");
    if (value) window.requestAnimationFrame(() => setOrderId(value.toUpperCase()));
  }, []);
  const track = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const response = await fetch(`/api/orders/track?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`);
    const result = await response.json();
    setLoading(false);
    if (!response.ok) setError(result.error ?? "অর্ডার খুঁজে পাওয়া যায়নি।");
    else setOrders(result.orders);
  };
  return <><Navbar /><main className="mx-auto max-w-4xl px-5 py-16 lg:px-8"><div className="text-center"><p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-600">Privacy-first tracking</p><h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">অর্ডার ট্র্যাক করুন</h1><p className="mt-3 text-slate-500">নিরাপত্তার জন্য অর্ডার আইডি ও চেকআউটে দেওয়া মোবাইল নম্বর দুটিই দিন।</p></div><form onSubmit={track} className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-[1fr_1fr_auto]"><input required value={orderId} onChange={(event) => setOrderId(event.target.value.toUpperCase())} aria-label="Order ID" placeholder="ALR-xxxx…" className="field" /><input required value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" aria-label="Mobile number" placeholder="০১XXXXXXXXX…" className="field" /><button disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-black text-slate-950 disabled:opacity-60"><Search size={17} /> {loading ? "খোঁজা হচ্ছে…" : "ট্র্যাক করুন"}</button></form>{error && <p role="alert" className="mx-auto mt-4 max-w-xl rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}{orders.length === 0 && !error && <p className="mt-12 text-center text-slate-500">অর্ডার আইডি ও মোবাইল নম্বর যাচাই হলে স্ট্যাটাস এখানে দেখা যাবে।</p>}<div className="mt-10 space-y-5">{orders.map((order) => { const active = Math.max(0, steps.findIndex(([status]) => status === order.orderStatus)); return <article key={order.orderNumber} className="rounded-3xl border border-slate-200 p-6 dark:border-white/10"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-black">#{order.orderNumber}</h2><p className="mt-2 text-xs text-slate-500">মোবাইল: {order.maskedPhone} · এলাকা: {order.maskedAddress}</p></div><span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-700">{order.orderStatus}</span></div><div className="mt-8 grid gap-5 sm:grid-cols-4">{steps.map(([status, label, Icon], index) => <div key={status} className="text-center"><div className={`mx-auto grid size-10 place-items-center rounded-full ${index <= active ? "bg-cyan-500 text-slate-950" : "bg-slate-100 text-slate-400 dark:bg-white/10"}`}><Icon size={17} /></div><p className="mt-2 text-xs font-bold">{label}</p></div>)}</div><div className="mt-4 rounded-xl bg-cyan-50 p-3 text-sm dark:bg-cyan-950/20">কুরিয়ার ট্র্যাকিং: <strong>{order.trackingNumber ?? "কনফার্মেশনের পর দেওয়া হবে"}</strong></div><div className="mt-6 flex justify-between border-t border-slate-200 pt-4 text-sm dark:border-white/10"><span>মোট: ৳{order.totalAmount.toLocaleString("bn-BD")}</span><span>বাকি: ৳{order.dueAmount.toLocaleString("bn-BD")}</span></div></article>; })}</div></main></>;
}
