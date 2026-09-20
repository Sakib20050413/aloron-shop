"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { AdminCustomer, AdminCustomerOrder } from "@/actions/customers";

export function CustomerDirectory({ customers }: { customers: AdminCustomer[] }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("ALL");
  const [selected, setSelected] = useState<AdminCustomer | null>(null);
  const filtered = useMemo(() => customers.filter((customer) => {
    const haystack = `${customer.name} ${customer.phone} ${customer.email ?? ""}`.toLowerCase();
    const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
    const matchesLocation = location === "ALL" || (location === "OTHER" ? !["কুমিল্লা", "ঢাকা", "চট্টগ্রাম"].some((name) => `${customer.city ?? ""} ${customer.address ?? ""}`.includes(name)) : `${customer.city ?? ""} ${customer.address ?? ""}`.includes(location));
    return matchesQuery && matchesLocation;
  }), [customers, location, query]);

  return <section className="mt-6 rounded-3xl border border-slate-200 p-6 dark:border-white/10">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-xl font-black">কাস্টমার ডিরেক্টরি</h2><p className="mt-1 text-sm text-slate-500">শুধু প্রয়োজনীয় CRM তথ্য দেখানো হচ্ছে; পাসওয়ার্ড বা গোপন ক্রেডেনশিয়াল কখনও পাঠানো হয় না।</p></div><span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-700">{filtered.length} জন</span></div>
    <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_220px]"><label className="relative"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="নাম বা ফোন দিয়ে খুঁজুন…" aria-label="Search customers" className="field pl-10" /></label><select value={location} onChange={(event) => setLocation(event.target.value)} aria-label="Filter customers by location" className="field bg-[#111827] text-white"><option value="ALL">সব এলাকা</option><option value="কুমিল্লা">কুমিল্লা</option><option value="ঢাকা">ঢাকা</option><option value="চট্টগ্রাম">চট্টগ্রাম</option><option value="OTHER">অন্যান্য জেলা</option></select></div>
    <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="text-xs uppercase tracking-wider text-slate-400"><tr><th className="pb-3">গ্রাহকের নাম</th><th className="pb-3">মোবাইল নম্বর</th><th className="pb-3">অবস্থান / জেলা</th><th className="pb-3">মোট অর্ডার</th><th className="pb-3">মোট কেনাকাটা</th><th className="pb-3">প্রথম অর্ডার</th><th className="pb-3">অ্যাকশন</th></tr></thead><tbody>{filtered.map((customer) => { const firstOrder = customer.orders.at(-1)?.createdAt; const lifetime = customer.orders.reduce((sum, order) => sum + order.totalAmount, 0); return <tr key={customer.id} className="border-t border-slate-100 dark:border-white/10"><td className="py-4 font-bold">{customer.name}</td><td className="py-4 text-slate-500">{customer.phone}</td><td className="py-4 text-slate-500">{customer.city ?? customer.address ?? "—"}</td><td className="py-4">{customer.orders.length}</td><td className="py-4 font-bold">৳{lifetime.toLocaleString("en-BD")}</td><td className="py-4 text-slate-500">{firstOrder ? new Intl.DateTimeFormat("bn-BD", { dateStyle: "medium" }).format(new Date(firstOrder)) : "—"}</td><td className="py-4"><button type="button" onClick={() => setSelected(customer)} className="rounded-lg bg-cyan-100 px-3 py-2 text-xs font-bold text-cyan-700 transition hover:bg-cyan-200">বিস্তারিত হিস্ট্রি</button></td></tr>; })}</tbody></table>{filtered.length === 0 && <p className="py-8 text-center text-sm text-slate-500">কোনো গ্রাহক পাওয়া যায়নি।</p>}</div>
    {selected && <HistoryDrawer customer={selected} onClose={() => setSelected(null)} />}
  </section>;
}

function HistoryDrawer({ customer, onClose }: { customer: AdminCustomer; onClose: () => void }) {
  return <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside role="dialog" aria-modal="true" aria-label={`${customer.name} order history`} className="ml-auto h-full w-full max-w-xl overflow-y-auto border-l border-white/15 bg-[#080d1a] p-6 text-white shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Customer profile</p><h3 className="mt-2 text-2xl font-black">{customer.name}</h3><p className="mt-1 text-sm text-slate-400">{customer.phone} · {customer.city ?? customer.address ?? "ঠিকানা সংরক্ষিত নেই"}</p></div><button type="button" onClick={onClose} aria-label="Close customer history" className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"><X size={20} /></button></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><Info label="ইমেইল" value={customer.email ?? "—"} /><Info label="ডিফল্ট ঠিকানা" value={customer.address ?? "—"} /><Info label="অর্ডার সংখ্যা" value={String(customer.orders.length)} /><Info label="লাইফটাইম ভ্যালু" value={`৳${customer.orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString("en-BD")}`} /></div><div className="mt-8 space-y-4"><h4 className="text-lg font-black">সম্পূর্ণ অর্ডার হিস্ট্রি</h4>{customer.orders.length === 0 && <p className="text-sm text-slate-400">এই গ্রাহকের কোনো অর্ডার নেই।</p>}{customer.orders.map((order) => <OrderHistoryCard key={order.id} order={order} />)}</div></aside></div>;
}

function OrderHistoryCard({ order }: { order: AdminCustomerOrder }) {
  return <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><div className="flex flex-wrap justify-between gap-2"><strong>#{order.orderNumber}</strong><span className="text-xs text-slate-400">{new Intl.DateTimeFormat("bn-BD", { dateStyle: "medium" }).format(new Date(order.createdAt))}</span></div><div className="mt-3 space-y-1 text-sm text-slate-300">{order.items.map((item, index) => <p key={`${order.id}-${index}`}>{item.productName} × {item.quantity} · ৳{item.unitPrice.toLocaleString("en-BD")}</p>)}</div><div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 text-xs"><span>মোট: <b className="text-white">৳{order.totalAmount.toLocaleString("en-BD")}</b></span><span>অগ্রিম: <b className="text-emerald-300">{order.paymentStatus}</b></span><span>ডেলিভারি: <b className="text-cyan-300">{order.orderStatus}</b></span><span className="col-span-2 text-slate-400">ঠিকানা: {order.shippingAddress}{order.notes ? ` · নোট: ${order.notes}` : ""}</span></div></article>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><p className="text-[11px] uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 break-words text-sm font-bold text-slate-100">{value}</p></div>;
}
