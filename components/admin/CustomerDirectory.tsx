"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { AdminCustomer, AdminCustomerOrder } from "@/actions/customers";

export function CustomerDirectory({ customers }: { customers: AdminCustomer[] }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("ALL");
  const [selected, setSelected] = useState<AdminCustomer | null>(null);

  const filtered = useMemo(
    () =>
      customers.filter((customer) => {
        const haystack = `${customer.name} ${customer.phone} ${customer.email ?? ""}`.toLowerCase();
        const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
        const matchesLocation =
          location === "ALL" ||
          (location === "OTHER"
            ? !["ঢাকা", "চট্টগ্রাম", "সিলেট", "কুমিল্লা"].some((name) =>
                `${customer.city ?? ""} ${customer.address ?? ""}`.includes(name)
              )
            : `${customer.city ?? ""} ${customer.address ?? ""}`.includes(location));
        return matchesQuery && matchesLocation;
      }),
    [customers, location, query]
  );

  return (
    <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-100 pb-4 dark:border-neutral-800">
        <div>
          <h2 className="text-lg font-bold text-neutral-950 dark:text-white">কাস্টমার সিআরএম ডিরেক্টরি</h2>
          <p className="mt-1 text-xs text-neutral-500">
            গ্রাহকের নাম, মোবাইল নম্বর ও আজীবন কেনাকাটার ইতিহাস (LTV)।
          </p>
        </div>
        <span className="rounded-md border border-neutral-200 bg-neutral-100 px-2.5 py-1 font-mono text-xs font-semibold text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
          মোট {filtered.length} জন গ্রাহক
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-neutral-400" size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="গ্রাহকের নাম বা মোবাইল নম্বর দিয়ে খুঁজুন…"
            aria-label="Search customers"
            className="field pl-9 font-mono text-xs"
          />
        </div>
        <select
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          aria-label="Filter customers by location"
          className="field font-mono text-xs"
        >
          <option value="ALL">সকল জেলা</option>
          <option value="ঢাকা">ঢাকা</option>
          <option value="চট্টগ্রাম">চট্টগ্রাম</option>
          <option value="সিলেট">সিলেট</option>
          <option value="কুমিল্লা">কুমিল্লা</option>
          <option value="OTHER">অন্যান্য জেলা</option>
        </select>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left font-mono text-xs">
          <thead className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800">
            <tr>
              <th className="pb-3 pr-4 uppercase">গ্রাহকের নাম</th>
              <th className="pb-3 pr-4 uppercase">মোবাইল নম্বর</th>
              <th className="pb-3 pr-4 uppercase">অবস্থান / এলাকা</th>
              <th className="pb-3 pr-4 uppercase">মোট অর্ডার</th>
              <th className="pb-3 pr-4 uppercase">মোট কেনাকাটা</th>
              <th className="pb-3 pr-4 uppercase">সর্বশেষ অর্ডার</th>
              <th className="pb-3 uppercase">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filtered.map((customer) => {
              const firstOrder = customer.orders.at(-1)?.createdAt;
              const lifetime = customer.orders.reduce((sum, order) => sum + order.totalAmount, 0);
              return (
                <tr key={customer.id}>
                  <td className="py-3.5 pr-4 font-sans font-bold text-neutral-900 dark:text-white">
                    {customer.name}
                  </td>
                  <td className="py-3.5 pr-4 text-neutral-600 dark:text-neutral-400">{customer.phone}</td>
                  <td className="py-3.5 pr-4 text-neutral-500">
                    {customer.city ?? customer.address ?? "—"}
                  </td>
                  <td className="py-3.5 pr-4">{customer.orders.length}</td>
                  <td className="py-3.5 pr-4 font-bold text-neutral-900 dark:text-white">
                    ৳{lifetime.toLocaleString("en-BD")}
                  </td>
                  <td className="py-3.5 pr-4 text-neutral-500">
                    {firstOrder
                      ? new Intl.DateTimeFormat("bn-BD", { dateStyle: "medium" }).format(new Date(firstOrder))
                      : "—"}
                  </td>
                  <td className="py-3.5">
                    <button
                      type="button"
                      onClick={() => setSelected(customer)}
                      className="rounded border border-neutral-300 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                    >
                      হিস্ট্রি দেখুন
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-xs text-neutral-400">কোনো গ্রাহক পাওয়া যায়নি।</p>
        )}
      </div>

      {selected && <HistoryDrawer customer={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function HistoryDrawer({ customer, onClose }: { customer: AdminCustomer; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`${customer.name} order history`}
        className="ml-auto h-full w-full max-w-xl overflow-y-auto border-l border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-4 dark:border-neutral-800">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">CUSTOMER PROFILE</p>
            <h3 className="mt-1 text-xl font-bold text-neutral-950 dark:text-white">{customer.name}</h3>
            <p className="font-mono text-xs text-neutral-500">
              {customer.phone} · {customer.city ?? customer.address ?? "ঠিকানা সংরক্ষিত নেই"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Info label="ইমেইল" value={customer.email ?? "—"} />
          <Info label="ডিফল্ট ঠিকানা" value={customer.address ?? "—"} />
          <Info label="মোট অর্ডার" value={String(customer.orders.length)} />
          <Info
            label="লাইফটাইম কেনাকাটা"
            value={`৳${customer.orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString("en-BD")}`}
          />
        </div>

        <div className="mt-6 space-y-3">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500">
            অর্ডার হিস্ট্রি তালিকা
          </h4>
          {customer.orders.length === 0 && (
            <p className="text-xs text-neutral-400">এই গ্রাহকের কোনো পূর্ববর্তী অর্ডার নেই।</p>
          )}
          {customer.orders.map((order) => (
            <OrderHistoryCard key={order.id} order={order} />
          ))}
        </div>
      </aside>
    </div>
  );
}

function OrderHistoryCard({ order }: { order: AdminCustomerOrder }) {
  return (
    <article className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900/40">
      <div className="flex flex-wrap justify-between gap-2 border-b border-neutral-200 pb-2 dark:border-neutral-800">
        <strong className="text-neutral-900 dark:text-white">#{order.orderNumber}</strong>
        <span className="text-neutral-500">
          {new Intl.DateTimeFormat("bn-BD", { dateStyle: "medium" }).format(new Date(order.createdAt))}
        </span>
      </div>
      <div className="mt-2.5 space-y-1 text-neutral-700 dark:text-neutral-300">
        {order.items.map((item, index) => (
          <p key={`${order.id}-${index}`}>
            {item.productName} × {item.quantity} · ৳{item.unitPrice.toLocaleString("en-BD")}
          </p>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1.5 border-t border-neutral-200 pt-2 text-[11px] dark:border-neutral-800">
        <span>মোট বিল: <b className="text-neutral-900 dark:text-white">৳{order.totalAmount.toLocaleString("en-BD")}</b></span>
        <span>অগ্রিম: <b className="text-emerald-600 dark:text-emerald-400">{order.paymentStatus}</b></span>
        <span>স্ট্যাটাস: <b className="text-neutral-900 dark:text-white">{order.orderStatus}</b></span>
        <span className="col-span-2 text-neutral-500">ঠিকানা: {order.shippingAddress}</span>
      </div>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">{label}</p>
      <p className="mt-1 font-mono text-xs font-bold text-neutral-900 dark:text-white">{value}</p>
    </div>
  );
}
