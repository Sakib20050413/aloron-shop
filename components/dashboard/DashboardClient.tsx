"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, HeartHandshake, MapPin, PackageCheck, Phone, Truck } from "lucide-react";
import { updateProfile } from "@/actions/profile";

type DashboardOrder = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  advanceAmount: number;
  dueAmount: number;
  paymentStatus: string;
  orderStatus: "PENDING" | "CONFIRMED" | "PACKAGING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  trackingNumber: string | null;
  createdAt: string;
  items: { id: string; quantity: number; unitPrice: number; productName: string; image: string | null }[];
};

type Profile = { name: string; email: string; phone: string; address: string; city: string };
const steps = [
  ["PENDING", "অর্ডার গৃহীত ও TrxID যাচাই", Check],
  ["CONFIRMED", "কনফার্মড ও প্যাকেজিং", PackageCheck],
  ["SHIPPED", "কুরিয়ারে হ্যান্ডওভার", Truck],
  ["DELIVERED", "ডেলিভারি সম্পন্ন", HeartHandshake],
] as const;

export function DashboardClient({ profile, orders }: { profile: Profile; orders: DashboardOrder[] }) {
  const [tab, setTab] = useState<"orders" | "profile" | "help">("orders");
  const [message, setMessage] = useState("");

  const saveProfile = async (formData: FormData) => {
    const result = await updateProfile(formData);
    setMessage(result.success ? "আপনার প্রোফাইল সফলভাবে সংরক্ষণ হয়েছে।" : result.error ?? "আপডেট করা যায়নি।");
  };

  return (
    <div className="mt-8">
      <nav className="flex gap-2 overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-50/50 p-1.5 dark:border-neutral-800 dark:bg-neutral-900/50" aria-label="Customer dashboard tabs">
        {[
          ["orders", "আমার অর্ডারসমূহ"],
          ["profile", "ডেলিভারি ঠিকানা ও প্রোফাইল"],
          ["help", "হেল্প ও কাস্টমার কেয়ার"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key as typeof tab)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
              tab === key
                ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {message && (
        <p role="status" className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 p-3 font-mono text-xs text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
          {message}
        </p>
      )}

      {tab === "orders" && (
        <div className="mt-6 space-y-4">
          {orders.length === 0 && (
            <div className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center font-mono text-xs text-neutral-500 dark:border-neutral-800">
              আপনার এখনো কোনো অর্ডার নেই।
            </div>
          )}
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {tab === "profile" && (
        <section className="mt-6 max-w-3xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
          <h2 className="text-lg font-bold text-neutral-950 dark:text-white">ডেলিভারি ঠিকানা ও প্রোফাইল</h2>
          <form action={saveProfile} className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field name="name" label="পূর্ণ নাম" value={profile.name} />
            <Field name="phone" label="মোবাইল নম্বর" value={profile.phone} />
            <Field name="city" label="জেলা / সিটি" value={profile.city} />
            <div className="sm:col-span-2">
              <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                ডিফল্ট ডেলিভারি ঠিকানা
              </label>
              <textarea required name="address" defaultValue={profile.address} rows={3} className="field mt-1.5" />
            </div>
            <button className="rounded-xl bg-neutral-900 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-neutral-800 sm:col-span-2 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100">
              ঠিকানা সেভ করুন
            </button>
          </form>
        </section>
      )}

      {tab === "help" && (
        <section className="mt-6 max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
          <h2 className="text-lg font-bold text-neutral-950 dark:text-white">হেল্প ও কাস্টমার কেয়ার</h2>
          <p className="mt-1 text-xs text-neutral-500">
            অর্ডার, ডেলিভারি ট্র্যাকিং বা যেকোনো গ্যাজেট সাপোর্টে সরাসরি যোগাযোগ করুন।
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href="https://wa.me/8801615869724"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25d366] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#20bd5a]"
            >
              WhatsApp Support
            </a>
            <a
              href="tel:01615869724"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-neutral-900 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <Phone size={15} /> 01615869724
            </a>
          </div>
          <p className="mt-5 flex items-center gap-2 font-mono text-xs text-neutral-500">
            <MapPin size={15} className="text-neutral-400" />
            <span>সেন্ট্রাল ইনভেন্টরি হাব: ঢাকা, বাংলাদেশ</span>
          </p>
        </section>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: DashboardOrder }) {
  const [copied, setCopied] = useState(false);
  const active = order.orderStatus === "CANCELLED" ? -1 : order.orderStatus === "PACKAGING" ? 1 : steps.findIndex(([status]) => status === order.orderStatus);
  const copyTracking = async () => {
    if (!order.trackingNumber) return;
    await navigator.clipboard.writeText(order.trackingNumber);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4 dark:border-neutral-800">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">ORDER RECORD</p>
          <h2 className="font-mono text-base font-bold text-neutral-950 dark:text-white">#{order.orderNumber}</h2>
          <p className="font-mono text-xs text-neutral-500">
            {new Intl.DateTimeFormat("bn-BD", { dateStyle: "medium" }).format(new Date(order.createdAt))}
          </p>
        </div>
        <span className="rounded-md border border-neutral-200 bg-neutral-100 px-2.5 py-1 font-mono text-xs font-semibold text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
          {order.orderStatus}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {steps.map(([status, label, Icon], index) => (
          <div key={status} className="relative text-center">
            <div className={`mx-auto grid size-10 place-items-center rounded-xl border ${index <= active ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900" : "border-neutral-200 bg-neutral-100 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-800"}`}>
              <Icon size={16} />
            </div>
            <p className="mt-2 text-xs font-semibold text-neutral-800 dark:text-neutral-300">{label}</p>
            {status === "SHIPPED" && order.trackingNumber && (
              <div className="mt-2 flex items-center justify-center gap-1 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                <span>{order.trackingNumber}</span>
                <button type="button" onClick={() => void copyTracking()} aria-label="Copy tracking code">
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-2.5 border-t border-neutral-100 pt-4 font-mono text-xs dark:border-neutral-800">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
              {item.image ? (
                <Image src={item.image} alt="" width={36} height={36} unoptimized className="size-full object-cover" />
              ) : (
                "📦"
              )}
            </span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{item.productName} × {item.quantity}</span>
            <span className="ml-auto font-bold text-neutral-950 dark:text-white">৳{item.unitPrice.toLocaleString("en-BD")}</span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-neutral-100 pt-2 font-bold dark:border-neutral-800">
          <span>মোট মূল্য</span>
          <span>৳{order.totalAmount.toLocaleString("en-BD")}</span>
        </div>
        <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
          <span>বিকাশ অগ্রিম প্রদান</span>
          <span>৳{order.advanceAmount.toLocaleString("en-BD")}</span>
        </div>
        <div className="flex justify-between font-bold text-neutral-950 dark:text-white">
          <span>ক্যাশ অন ডেলিভারি</span>
          <span>৳{order.dueAmount.toLocaleString("en-BD")}</span>
        </div>
      </div>
    </article>
  );
}

function Field({ name, label, value }: { name: string; label: string; value: string }) {
  return (
    <div>
      <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <input required name={name} defaultValue={value} className="field mt-1.5" />
    </div>
  );
}
