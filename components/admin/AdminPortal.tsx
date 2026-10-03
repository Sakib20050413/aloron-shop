"use client";

import { useMemo, useState } from "react";
import { saveSiteSettings, type SiteSettingsInput } from "@/actions/settings";
import { createCoupon } from "@/actions/coupons";
import { AdminOrderTable } from "@/components/admin/AdminOrderTable";
import { ProductAdminPanel } from "@/components/admin/ProductAdminPanel";
import { CustomerDirectory } from "@/components/admin/CustomerDirectory";
import { HeroSlideManager } from "@/components/admin/HeroSlideManager";
import { AdminTeamManager } from "@/components/admin/AdminTeamManager";
import type { AdminCustomer } from "@/actions/customers";

type AdminOrder = { id: string; orderNumber: string; customerName: string; customerPhone: string; shippingAddress: string; bKashSender: string | null; transactionId: string | null; trackingNumber: string | null; deliveryZone: string; totalAmount: number; advanceAmount: number; orderStatus: string; createdAt: string };
type AdminProduct = { id: string; name: string; productCode: string; category: string; buyPrice: number; sellPrice: number; stock: number; isActive: boolean; isFeatured: boolean };
type AnalyticsOrder = AdminOrder & { cost: number };
type Tab = "products" | "hero" | "settings" | "orders" | "analytics" | "coupons" | "customers" | "admins";
type AdminSlide = { id: string; title: string; subtitle: string; badgeText: string; discountTag: string; priceText: string; ctaText: string; ctaLink: string; imageUrl: string; order: number; isActive: boolean; createdAt: string; updatedAt: string };
type AdminMember = { id: string; name: string; email: string; image: string | null; role: "ADMIN" | "CUSTOMER" };

export function AdminPortal({ products, orders, settings, asOf, customers, slides, admins }: { products: AdminProduct[]; orders: AnalyticsOrder[]; settings: SiteSettingsInput; asOf: number; customers: AdminCustomer[]; slides: AdminSlide[]; admins: AdminMember[] }) {
  const [tab, setTab] = useState<Tab>("products");
  const [message, setMessage] = useState("");
  const analytics = useMemo(() => {
    const eligible = orders.filter((order) => order.orderStatus !== "CANCELLED");
    return {
      all: eligible,
      today: eligible.filter((order) => asOf - Date.parse(order.createdAt) < 86_400_000),
      week: eligible.filter((order) => asOf - Date.parse(order.createdAt) < 604_800_000),
    };
  }, [asOf, orders]);
  const [range, setRange] = useState<"today" | "week" | "all">("all");
  const activeOrders = analytics[range];
  const sales = activeOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const costs = activeOrders.reduce((sum, order) => sum + order.cost, 0);
  const advances = activeOrders.reduce((sum, order) => sum + order.advanceAmount, 0);
  const tabs: [Tab, string][] = [["products", "প্রোডাক্ট ম্যানেজার"], ["hero", "হিরো স্লাইডার"], ["admins", "👥 অ্যাডমিন টিম"], ["settings", "স্টোর সেটিংস"], ["orders", "অর্ডার ও কুরিয়ার"], ["coupons", "কুপন ও ডিসকাউন্ট"], ["customers", "কাস্টমার ডিরেক্টরি"], ["analytics", "লাভ-ক্ষতি রিপোর্ট"]];

  const saveSettings = async (formData: FormData) => {
    const input = Object.fromEntries(formData) as unknown as SiteSettingsInput;
    const result = await saveSiteSettings(input);
    setMessage(result.success ? "সেটিংস সফলভাবে আপডেট হয়েছে।" : result.error);
  };

  return <div className="mt-8">
    <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 p-2 dark:border-white/10" aria-label="Admin modules">{tabs.map(([key, label]) => <button key={key} type="button" onClick={() => setTab(key)} className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-bold transition ${tab === key ? "bg-cyan-500 text-slate-950" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"}`}>{label}</button>)}</nav>
    {message && <p aria-live="polite" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</p>}
    {tab === "products" && <ProductAdminPanel initialProducts={products} />}
    {tab === "hero" && <HeroSlideManager initialSlides={slides} />}
    {tab === "admins" && <AdminTeamManager initialAdmins={admins} />}
    {tab === "settings" && <section className="mt-6 rounded-3xl border border-slate-200 p-6 dark:border-white/10"><h2 className="text-xl font-black">স্টোর ও হোমপেজ সেটিংস</h2><form action={saveSettings} className="mt-6 grid gap-4 sm:grid-cols-2"><Field name="noticeText" label="টপ নোটিস টেক্সট" value={settings.noticeText} /><Field name="heroTitle" label="হিরো ব্যানার হেডলাইন" value={settings.heroTitle} /><Field name="heroSubtitle" label="হিরো সাব-টাইটেল" value={settings.heroSubtitle} /><Field name="bkashNumber" label="বিকাশ রিসিভ নম্বর" value={settings.bkashNumber} /><Field name="advanceFee" label="বিকাশ অগ্রিম ফি" value={String(settings.advanceFee)} type="number" /><Field name="contactNumber" label="কন্টাক্ট নম্বর" value={settings.contactNumber} /><Field name="whatsappNumber" label="হোয়াটসঅ্যাপ নম্বর" value={settings.whatsappNumber} /><Field name="address" label="শপের ঠিকানা" value={settings.address} /><Field name="insideDhakaFee" label="ঢাকার ভেতরের ডেলিভারি চার্জ" value={String(settings.insideDhakaFee)} type="number" /><Field name="outsideDhakaFee" label="ঢাকার বাইরের ডেলিভারি চার্জ" value={String(settings.outsideDhakaFee)} type="number" /><button className="rounded-xl bg-cyan-500 px-5 py-3 font-black text-slate-950 sm:col-span-2">সেটিংস সংরক্ষণ করুন</button></form></section>}
    {tab === "orders" && <section className="mt-6 rounded-3xl border border-slate-200 p-6 dark:border-white/10"><h2 className="text-xl font-black">লাইভ অর্ডার ও কুরিয়ার কন্ট্রোল</h2><p className="mt-1 text-sm text-slate-500">TrxID, ঠিকানা ও dispatch action একসাথে দেখুন।</p><AdminOrderTable initialOrders={orders} /></section>}
    {tab === "customers" && <CustomerDirectory customers={customers} />}
    {tab === "coupons" && <section className="mt-6 rounded-3xl border border-slate-200 p-6 dark:border-white/10"><h2 className="text-xl font-black">কুপন ও ডিসকাউন্ট</h2><p className="mt-1 text-sm text-slate-500">ফিক্সড বা শতাংশ ছাড়ের প্রোমো কোড তৈরি করুন।</p><form action={async (formData) => { const result = await createCoupon(formData);     setMessage(result.success ? "কুপন তৈরি হয়েছে।" : result.error ?? "কুপন তৈরি করা যায়নি।"); }} className="mt-6 grid gap-4 sm:grid-cols-2"><Field name="code" label="কুপন কোড (যেমন ALORON50)" value="" /><Field name="discountValue" label="ডিসকাউন্ট মূল্য" value="" type="number" /><label className="text-sm font-bold">ডিসকাউন্ট টাইপ<select name="discountType" defaultValue="FIXED" className="field mt-2"><option value="FIXED">৳ Fixed</option><option value="PERCENT">% Percentage</option></select></label><Field name="minOrderAmount" label="ন্যূনতম অর্ডার" value="0" type="number" /><button className="rounded-xl bg-violet-500 px-5 py-3 font-black text-white sm:col-span-2">কুপন সংরক্ষণ করুন</button></form></section>}
    {tab === "analytics" && <section className="mt-6 rounded-3xl border border-slate-200 p-6 dark:border-white/10"><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-xl font-black">লাভ-ক্ষতি ও আর্থিক রিপোর্ট</h2><select value={range} onChange={(event) => setRange(event.target.value as typeof range)} className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-bold text-stone-900 dark:border-slate-700 dark:bg-[#111827] dark:text-white"><option value="today">আজকের লাভ</option><option value="week">এই সপ্তাহের লাভ</option><option value="all">সর্বমোট হিসাব</option></select></div><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Kpi label="মোট বিক্রয়" value={`৳${sales.toLocaleString("en-BD")}`} /><Kpi label="পাইকারি খরচ" value={`৳${costs.toLocaleString("en-BD")}`} /><Kpi label="নিট লাভ" value={`৳${(sales - costs).toLocaleString("en-BD")}`} /><Kpi label="বিকাশ অগ্রিম" value={`৳${advances.toLocaleString("en-BD")}`} /></div><div className="mt-8 overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="text-xs text-slate-400"><tr><th className="pb-3">Product</th><th className="pb-3">Sell price</th><th className="pb-3">Buy price</th><th className="pb-3">Unit profit</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-t border-slate-100 dark:border-white/10"><td className="py-3 font-bold">{product.name}</td><td className="py-3">৳{product.sellPrice.toLocaleString("en-BD")}</td><td className="py-3">৳{product.buyPrice.toLocaleString("en-BD")}</td><td className="py-3 font-black text-emerald-600">৳{(product.sellPrice - product.buyPrice).toLocaleString("en-BD")}</td></tr>)}</tbody></table></div></section>}
  </div>;
}

function Field({ name, label, value, type = "text" }: { name: string; label: string; value: string; type?: string }) {
  return <label className="text-sm font-bold">{label}<input required name={name} defaultValue={value} type={type} className="field mt-2" /></label>;
}
function Kpi({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>;
}
