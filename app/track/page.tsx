"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Clock3, PackageCheck, Search, Truck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type TrackedOrder = {
  orderNumber: string;
  orderStatus: "PENDING" | "CONFIRMED" | "PACKAGING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  dueAmount: number;
  trackingNumber: string | null;
  createdAt: string;
  maskedPhone: string;
  maskedAddress: string;
};

const steps = [
  ["PENDING", "অর্ডার গৃহীত হয়েছে", Check],
  ["CONFIRMED", "প্যাকেজিং চলছে", Clock3],
  ["SHIPPED", "কুরিয়ারে হস্তান্তর", Truck],
  ["DELIVERED", "ডেলিভারি সম্পন্ন", PackageCheck],
] as const;

function getActiveStep(status: string) {
  if (status === "DELIVERED") return 3;
  if (status === "SHIPPED") return 2;
  if (status === "CONFIRMED" || status === "PACKAGING") return 1;
  return 0;
}

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

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
        <div className="text-center">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[.2em] text-cyan-600 dark:text-cyan-400">
            Privacy-first tracking
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">
            অর্ডার ট্র্যাক করুন
          </h1>
          <p className="mt-2 text-sm text-stone-600 dark:text-slate-400">
            নিরাপত্তার জন্য চেকআউটের অর্ডার আইডি এবং ১১ ডিজিটের মোবাইল নম্বর দুটিই দিন।
          </p>
        </div>

        <form onSubmit={track} className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input
            required
            value={orderId}
            onChange={(event) => setOrderId(event.target.value.toUpperCase())}
            aria-label="Order ID"
            placeholder="ALR-YYMM-XXXX…"
            className="field"
          />
          <input
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            inputMode="tel"
            aria-label="Mobile number"
            placeholder="০১XXXXXXXXX…"
            className="field"
          />
          <button
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
          >
            <Search size={17} /> {loading ? "খোঁজা হচ্ছে…" : "ট্র্যাক"}
          </button>
        </form>

        {error && (
          <p role="alert" className="mx-auto mt-4 max-w-xl rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </p>
        )}

        {orders.length === 0 && !error && (
          <p className="mt-12 text-center text-sm text-slate-400">
            অর্ডার আইডি ও মোবাইল নম্বর প্রদান করলে বর্তমান ডেলিভারি স্ট্যাটাস দেখা যাবে।
          </p>
        )}

        <div className="mt-10 space-y-6">
          {orders.map((order) => {
            const active = getActiveStep(order.orderStatus);
            return (
              <article key={order.orderNumber} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black text-stone-900 dark:text-white">#{order.orderNumber}</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      মোবাইল: {order.maskedPhone} · এলাকা: {order.maskedAddress}
                    </p>
                  </div>
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                    {order.orderStatus}
                  </span>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-4">
                  {steps.map(([status, label, Icon], index) => (
                    <div key={status} className="text-center">
                      <div className={`mx-auto grid size-11 place-items-center rounded-2xl ${index <= active ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20" : "bg-slate-100 text-slate-400 dark:bg-white/10"}`}>
                        <Icon size={18} />
                      </div>
                      <p className="mt-2 text-xs font-bold text-stone-800 dark:text-slate-300">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-cyan-500/5 p-4 text-xs sm:text-sm dark:bg-cyan-950/20 border border-cyan-500/15">
                  কুরিয়ার পার্সেল ট্র্যাকিং নম্বর: <strong>{order.trackingNumber ?? "কনফার্মেশন ও শিপমেন্টের পর আপডেট করা হবে"}</strong>
                </div>

                <div className="mt-6 flex justify-between border-t border-slate-200 pt-4 text-sm font-bold dark:border-white/10">
                  <span>মোট বিল: ৳{order.totalAmount.toLocaleString("bn-BD")}</span>
                  <span className="text-cyan-700 dark:text-cyan-400">বাকি ক্যাশ অন ডেলিভারি: ৳{order.dueAmount.toLocaleString("bn-BD")}</span>
                </div>
              </article>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
