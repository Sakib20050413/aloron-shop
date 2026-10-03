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
const steps = [["PENDING", "অর্ডার গৃহীত ও TrxID যাচাই", Check], ["CONFIRMED", "কনফার্মড ও প্যাকেজিং", PackageCheck], ["SHIPPED", "কুরিয়ারে হ্যান্ডওভার", Truck], ["DELIVERED", "ডেলিভারি সম্পন্ন", HeartHandshake]] as const;

export function DashboardClient({ profile, orders }: { profile: Profile; orders: DashboardOrder[] }) {
  const [tab, setTab] = useState<"orders" | "profile" | "help">("orders");
  const [message, setMessage] = useState("");
  const saveProfile = async (formData: FormData) => {
    const result = await updateProfile(formData);
    setMessage(result.success ? "আপনার প্রোফাইল সফলভাবে সংরক্ষণ হয়েছে।" : result.error ?? "আপডেট করা যায়নি।");
  };
  return <div className="mt-8">
    <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 p-2 dark:border-white/10" aria-label="Customer dashboard tabs">{[["orders", "আমার অর্ডারসমূহ"], ["profile", "ডেলিভারি ঠিকানা ও প্রোফাইল"], ["help", "হেল্প ও কাস্টমার কেয়ার"]].map(([key, label]) => <button key={key} type="button" onClick={() => setTab(key as typeof tab)} className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-bold ${tab === key ? "bg-cyan-500 text-slate-950" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"}`}>{label}</button>)}</nav>
    {message && <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</p>}
    {tab === "orders" && <div className="mt-6 space-y-5">{orders.length === 0 && <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500">আপনার এখনো কোনো অর্ডার নেই।</div>}{orders.map((order) => <OrderCard key={order.id} order={order} />)}</div>}
    {tab === "profile" && <section className="mt-6 max-w-3xl rounded-3xl border border-slate-200 p-6 dark:border-white/10"><h2 className="text-xl font-black">ডেলিভারি ঠিকানা ও প্রোফাইল</h2><form action={saveProfile} className="mt-6 grid gap-4 sm:grid-cols-2"><Field name="name" label="পূর্ণ নাম" value={profile.name} /><Field name="phone" label="মোবাইল নম্বর" value={profile.phone} /><Field name="city" label="জেলা / সিটি" value={profile.city} /><label className="text-sm font-bold sm:col-span-2">ডিফল্ট ঠিকানা<textarea required name="address" defaultValue={profile.address} rows={4} className="field mt-2" /></label><button className="rounded-xl bg-cyan-500 px-5 py-3 font-black text-slate-950 sm:col-span-2">ঠিকানা সেভ করুন</button></form></section>}
    {tab === "help" && <section className="mt-6 max-w-2xl rounded-3xl border border-slate-200 p-6 dark:border-white/10"><h2 className="text-xl font-black">হেল্প ও কাস্টমার কেয়ার</h2><p className="mt-2 text-slate-500">অর্ডার বা ডেলিভারি বিষয়ে সরাসরি আমাদের সাথে যোগাযোগ করুন।</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><a href="https://wa.me/8801615869724" target="_blank" rel="noreferrer" className="rounded-xl bg-[#25d366] px-5 py-3 text-center font-black text-white">WhatsApp Support</a><a href="tel:01615869724" className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-black text-slate-950"><Phone size={17} /> 01615869724</a></div><p className="mt-5 flex items-center gap-2 text-sm text-slate-500"><MapPin size={17} className="text-cyan-500" /> কুমিল্লা, বাংলাদেশ</p></section>}
  </div>;
}

function OrderCard({ order }: { order: DashboardOrder }) {
  const [copied, setCopied] = useState(false);
  const active = order.orderStatus === "CANCELLED" ? -1 : order.orderStatus === "PACKAGING" ? 1 : steps.findIndex(([status]) => status === order.orderStatus);
  const copyTracking = async () => { if (!order.trackingNumber) return; await navigator.clipboard.writeText(order.trackingNumber); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  return <article className="rounded-3xl border border-slate-200 p-6 shadow-sm dark:border-white/10"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-slate-400">Order history</p><h2 className="mt-1 text-xl font-black">#{order.orderNumber}</h2><p className="mt-1 text-xs text-slate-500">{new Intl.DateTimeFormat("bn-BD", { dateStyle: "medium" }).format(new Date(order.createdAt))}</p></div><span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-700">{order.orderStatus}</span></div><div className="mt-8 grid gap-6 md:grid-cols-4">{steps.map(([status, label, Icon], index) => <div key={status} className="relative"><div className={`grid size-11 place-items-center rounded-full ${index <= active ? "bg-cyan-500 text-slate-950" : "bg-slate-100 text-slate-400 dark:bg-white/10"}`}><Icon size={18} /></div><p className="mt-3 text-xs font-bold leading-5">{label}</p>{status === "SHIPPED" && order.trackingNumber && <div className="mt-2 flex items-center gap-1 text-[11px] text-cyan-600"><span>{order.trackingNumber}</span><button type="button" onClick={() => void copyTracking()} aria-label="Copy tracking code">{copied ? <Check size={13} /> : <Copy size={13} />}</button></div>}</div>)}</div><div className="mt-7 grid gap-3 border-t border-slate-200 pt-5 text-sm dark:border-white/10">{order.items.map((item) => <div key={item.id} className="flex items-center gap-3"><span className="grid size-10 place-items-center overflow-hidden rounded-lg bg-cyan-50">{item.image ?   <Image src={item.image} alt="" width={40} height={40} unoptimized className="size-full object-cover" /> : "📦"}</span><span className="font-semibold">{item.productName} × {item.quantity}</span><span className="ml-auto">৳{item.unitPrice.toLocaleString("en-BD")}</span></div>)}<div className="mt-2 flex justify-between font-bold"><span>মোট</span><span>৳{order.totalAmount.toLocaleString("en-BD")}</span></div><div className="flex justify-between text-emerald-600"><span>অগ্রিম প্রদান</span><span>৳{order.advanceAmount.toLocaleString("en-BD")}</span></div><div className="flex justify-between"><span>ক্যাশ অন ডেলিভারি</span><span>৳{order.dueAmount.toLocaleString("en-BD")}</span></div></div></article>;
}

function Field({ name, label, value }: { name: string; label: string; value: string }) {
  return <label className="text-sm font-bold">{label}<input required name={name} defaultValue={value} className="field mt-2" /></label>;
}
