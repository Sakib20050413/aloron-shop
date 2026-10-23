"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Clock, PackageCheck, Search, Truck } from "lucide-react";
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
  ["PENDING", "অর্ডার গৃহীত", Check],
  ["CONFIRMED", "প্যাকেজিং চলছে", Clock],
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
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="border-b border-neutral-200/80 pb-6 text-center dark:border-neutral-800">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            PRIVACY-FIRST DISPATCH AUDIT
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
            অর্ডার ট্র্যাক করুন
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            নিরাপত্তার স্বার্থে চেকআউটের অর্ডার আইডি এবং গ্রাহকের ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন।
          </p>
        </div>

        <form onSubmit={track} className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input
            required
            value={orderId}
            onChange={(event) => setOrderId(event.target.value.toUpperCase())}
            aria-label="Order ID"
            placeholder="ALR-YYMM-XXXX…"
            className="field font-mono uppercase"
          />
          <input
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            inputMode="tel"
            aria-label="Mobile number"
            placeholder="০১XXXXXXXXX…"
            className="field font-mono"
          />
          <button
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-neutral-900 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-neutral-900"
          >
            <Search size={15} />
            <span>{loading ? "খোঁজা হচ্ছে…" : "ট্র্যাক"}</span>
          </button>
        </form>

        {error && (
          <p role="alert" className="mx-auto mt-4 max-w-xl rounded-xl border border-rose-300 bg-rose-50 p-3 font-mono text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </p>
        )}

        {orders.length === 0 && !error && (
          <p className="mt-12 text-center font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            অর্ডার আইডি ও মোবাইল নম্বর প্রদান করলে বর্তমান স্ট্যাটাস দৃশ্যমান হবে।
          </p>
        )}

        <div className="mt-10 space-y-6">
          {orders.map((order) => {
            const active = getActiveStep(order.orderStatus);
            return (
              <article key={order.orderNumber} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4 dark:border-neutral-800">
                  <div>
                    <h2 className="font-mono text-lg font-bold text-neutral-900 dark:text-white">#{order.orderNumber}</h2>
                    <p className="font-mono text-xs text-neutral-500">
                      মোবাইল: {order.maskedPhone} · ঠিকানা: {order.maskedAddress}
                    </p>
                  </div>
                  <span className="rounded-md border border-neutral-200 bg-neutral-100 px-2.5 py-1 font-mono text-xs font-semibold text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                    {order.orderStatus}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-4">
                  {steps.map(([status, label, Icon], index) => (
                    <div key={status} className="text-center">
                      <div className={`mx-auto grid size-10 place-items-center rounded-xl border ${index <= active ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900" : "border-neutral-200 bg-neutral-100 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-800"}`}>
                        <Icon size={16} />
                      </div>
                      <p className="mt-2 text-xs font-bold text-neutral-800 dark:text-neutral-300">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50/70 p-3.5 font-mono text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-300">
                  কুরিয়ার পার্সেল ট্র্যাকিং নম্বর: <strong>{order.trackingNumber ?? "প্যাকেজিং সম্পন্ন হলে আপডেট হবে"}</strong>
                </div>

                <div className="mt-5 flex justify-between border-t border-neutral-100 pt-4 font-mono text-xs font-semibold dark:border-neutral-800">
                  <span className="text-neutral-600 dark:text-neutral-400">মোট বিল: ৳{order.totalAmount.toLocaleString("en-BD")}</span>
                  <span className="text-neutral-900 dark:text-white">বাকি ক্যাশ অন ডেলিভারি: ৳{order.dueAmount.toLocaleString("en-BD")}</span>
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
