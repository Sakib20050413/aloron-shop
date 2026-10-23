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

type AdminOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  bKashSender: string | null;
  transactionId: string | null;
  trackingNumber: string | null;
  deliveryZone: string;
  totalAmount: number;
  advanceAmount: number;
  orderStatus: string;
  createdAt: string;
};

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

type AnalyticsOrder = AdminOrder & { cost: number };
type Tab = "products" | "hero" | "settings" | "orders" | "analytics" | "coupons" | "customers" | "admins";
type AdminSlide = {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  discountTag: string;
  priceText: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type AdminMember = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "ADMIN" | "CUSTOMER";
};

export function AdminPortal({
  products,
  orders,
  settings,
  asOf,
  customers,
  slides,
  admins,
}: {
  products: AdminProduct[];
  orders: AnalyticsOrder[];
  settings: SiteSettingsInput;
  asOf: number;
  customers: AdminCustomer[];
  slides: AdminSlide[];
  admins: AdminMember[];
}) {
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

  const tabs: [Tab, string][] = [
    ["products", "প্রোডাক্ট ক্যাটালগ"],
    ["orders", "অর্ডার ও কুরিয়ার"],
    ["hero", "হিরো স্লাইডার"],
    ["admins", "অ্যাডমিন টিম"],
    ["settings", "স্টোর পলিসি ও সেটিংস"],
    ["coupons", "কুপন কোড"],
    ["customers", "কাস্টমার ডিরেক্টরি"],
    ["analytics", "লাভ-ক্ষতি রিপোর্ট"],
  ];

  const saveSettings = async (formData: FormData) => {
    const input = Object.fromEntries(formData) as unknown as SiteSettingsInput;
    const result = await saveSiteSettings(input);
    setMessage(result.success ? "স্টোর সেটিংস সফলভাবে সংরক্ষিত হয়েছে।" : result.error);
  };

  return (
    <div className="mt-8">
      {/* Navigation Tabs */}
      <nav
        className="flex gap-2 overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-50/50 p-1.5 dark:border-neutral-800 dark:bg-neutral-900/50"
        aria-label="Admin modules"
      >
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`whitespace-nowrap rounded-lg px-3.5 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
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
        <p
          aria-live="polite"
          className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 p-3 font-mono text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
        >
          {message}
        </p>
      )}

      {tab === "products" && <ProductAdminPanel initialProducts={products} />}
      {tab === "orders" && (
        <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
          <div className="border-b border-neutral-100 pb-4 dark:border-neutral-800">
            <h2 className="text-lg font-bold text-neutral-950 dark:text-white">লাইভ অর্ডার ও কুরিয়ার ট্র্যাকিং</h2>
            <p className="mt-1 text-xs text-neutral-500">
              গ্রাহকের ফোন, বিকাশ TrxID ও কুরিয়ার কনফার্মেশন এক ক্লিকে ম্যানেজ করুন।
            </p>
          </div>
          <AdminOrderTable initialOrders={orders} />
        </section>
      )}
      {tab === "hero" && <HeroSlideManager initialSlides={slides} />}
      {tab === "admins" && <AdminTeamManager initialAdmins={admins} />}
      {tab === "settings" && (
        <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
          <div className="border-b border-neutral-100 pb-4 dark:border-neutral-800">
            <h2 className="text-lg font-bold text-neutral-950 dark:text-white">স্টোর পলিসি ও অপারেশনাল সেটিংস</h2>
            <p className="mt-1 text-xs text-neutral-500">
              হেডার নোটিস, বিকাশ পেমেন্ট নম্বর, সেন্ট্রাল হাব ও ডেলিভারি চার্জ কনফিগারেশন।
            </p>
          </div>
          <form action={saveSettings} className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field name="noticeText" label="টপ নোটিস টেক্সট" value={settings.noticeText} />
            <Field name="heroTitle" label="হিরো ব্যানার হেডলাইন" value={settings.heroTitle} />
            <Field name="heroSubtitle" label="হিরো সাব-টাইটেল" value={settings.heroSubtitle} />
            <Field name="bkashNumber" label="অফিসিয়াল বিকাশ রিসিভ নম্বর" value={settings.bkashNumber} />
            <Field name="advanceFee" label="বিকাশ বাধ্যতামূলক অগ্রিম ফি (BDT)" value={String(settings.advanceFee)} type="number" />
            <Field name="contactNumber" label="অফিসিয়াল কন্টাক্ট নম্বর" value={settings.contactNumber} />
            <Field name="whatsappNumber" label="অফিসিয়াল হোয়াটসঅ্যাপ নম্বর" value={settings.whatsappNumber} />
            <Field name="address" label="সেন্ট্রাল ইনভেন্টরি হাব ঠিকানা" value={settings.address} />
            <Field name="insideDhakaFee" label="ঢাকার ভেতরে ডেলিভারি ফি (৳৭০)" value={String(settings.insideDhakaFee)} type="number" />
            <Field name="outsideDhakaFee" label="ঢাকার বাইরে ডেলিভারি ফি (৳১৫০)" value={String(settings.outsideDhakaFee)} type="number" />
            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="rounded-xl bg-neutral-900 px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                সেটিংস সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </section>
      )}
      {tab === "customers" && <CustomerDirectory customers={customers} />}
      {tab === "coupons" && (
        <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
          <div className="border-b border-neutral-100 pb-4 dark:border-neutral-800">
            <h2 className="text-lg font-bold text-neutral-950 dark:text-white">কুপন ও ডিসকাউন্ট কোড</h2>
            <p className="mt-1 text-xs text-neutral-500">
              গ্রাহকদের জন্য ফিক্সড (৳) বা শতাংশ (%) ভিত্তিক প্রোমো কোড তৈরি করুন।
            </p>
          </div>
          <form
            action={async (formData) => {
              const result = await createCoupon(formData);
              setMessage(result.success ? "কুপন সফলভাবে সক্রিয় হয়েছে।" : result.error ?? "কুপন তৈরি করা যায়নি।");
            }}
            className="mt-6 grid gap-4 sm:grid-cols-2"
          >
            <Field name="code" label="কুপন কোড (যেমন: ALORON100)" value="" />
            <Field name="discountValue" label="ছাড়ের পরিমাণ" value="" type="number" />
            <div>
              <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                ডিসকাউন্ট টাইপ
              </label>
              <select name="discountType" defaultValue="FIXED" className="field mt-1.5">
                <option value="FIXED">৳ নির্দিষ্ট টাকা (Fixed BDT)</option>
                <option value="PERCENT">% শতাংশ (Percentage)</option>
              </select>
            </div>
            <Field name="minOrderAmount" label="ন্যূনতম অর্ডার মূল্য (BDT)" value="0" type="number" />
            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="rounded-xl bg-neutral-900 px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                কুপন তৈরি ও সেভ করুন
              </button>
            </div>
          </form>
        </section>
      )}
      {tab === "analytics" && (
        <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4 dark:border-neutral-800">
            <div>
              <h2 className="text-lg font-bold text-neutral-950 dark:text-white">লাভ-ক্ষতি ও আর্থিক হিসাব</h2>
              <p className="mt-1 text-xs text-neutral-500">বিক্রয়, পাইকারি খরচ ও আনুমানিক মার্জিন অ্যানালিটিক্স।</p>
            </div>
            <select
              value={range}
              onChange={(event) => setRange(event.target.value as typeof range)}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            >
              <option value="today">আজকের হিসাব</option>
              <option value="week">এই সপ্তাহের হিসাব</option>
              <option value="all">সর্বমোট হিসাব</option>
            </select>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="মোট বিক্রয়" value={`৳${sales.toLocaleString("en-BD")}`} />
            <Kpi label="পাইকারি খরচ (Cost)" value={`৳${costs.toLocaleString("en-BD")}`} />
            <Kpi label="নিট লাভ (Gross Margin)" value={`৳${(sales - costs).toLocaleString("en-BD")}`} />
            <Kpi label="বিকাশ সংগৃহীত অগ্রিম" value={`৳${advances.toLocaleString("en-BD")}`} />
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left font-mono text-xs">
              <thead className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800">
                <tr>
                  <th className="pb-3 pr-4 font-semibold uppercase">প্রোডাক্টের নাম</th>
                  <th className="pb-3 pr-4 font-semibold uppercase">বিক্রয় মূল্য</th>
                  <th className="pb-3 pr-4 font-semibold uppercase">কেনা মূল্য</th>
                  <th className="pb-3 font-semibold uppercase">ইউনিট প্রতি লাভ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="py-3 pr-4 font-sans font-bold text-neutral-900 dark:text-white">{product.name}</td>
                    <td className="py-3 pr-4 text-neutral-600 dark:text-neutral-300">৳{product.sellPrice.toLocaleString("en-BD")}</td>
                    <td className="py-3 pr-4 text-neutral-600 dark:text-neutral-300">৳{product.buyPrice.toLocaleString("en-BD")}</td>
                    <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">
                      ৳{(product.sellPrice - product.buyPrice).toLocaleString("en-BD")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function Field({
  name,
  label,
  value = "",
  type = "text",
}: {
  name: string;
  label: string;
  value?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <input required name={name} defaultValue={value ?? ""} type={type} className="field mt-1.5" />
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
      <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
      <p className="mt-2 font-mono text-xl font-bold text-neutral-950 dark:text-white">{value}</p>
    </div>
  );
}
