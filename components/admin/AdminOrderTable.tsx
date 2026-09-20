"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminOrder = { id: string; orderNumber: string; customerName: string; customerPhone: string; shippingAddress: string; deliveryZone: string; bKashSender: string | null; transactionId: string | null; trackingNumber: string | null; totalAmount: number; orderStatus: string };
const actions = [
  ["CONFIRMED", "কনফার্ম করুন"],
  ["SHIPPED", "কুরিয়ারে হ্যান্ডওভার"],
  ["DELIVERED", "ডেলিভারি সম্পন্ন"],
  ["CANCELLED", "ক্যানসেল"],
] as const;

export function AdminOrderTable({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const updateStatus = async (id: string, status: string) => {
    setBusy(id); setError("");
    const response = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (!response.ok) { setError("স্ট্যাটাস আপডেট করা যায়নি।"); setBusy(""); return; }
    setOrders((current) => current.map((order) => order.id === id ? { ...order, orderStatus: status } : order));
    setBusy("");
    router.refresh();
  };
  const updateTracking = async (order: AdminOrder, trackingNumber: string) => { setBusy(order.id); const response = await fetch(`/api/admin/orders/${order.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ trackingNumber }) }); if (response.ok) setOrders((current) => current.map((item) => item.id === order.id ? { ...item, trackingNumber } : item)); else setError("ট্র্যাকিং নম্বর সংরক্ষণ করা যায়নি।"); setBusy(""); };
  const exportCsv = () => { const rows = [["Order", "Customer", "Phone", "Address", "Zone", "Amount", "bKash TrxID"], ...orders.filter((order) => order.orderStatus === "PENDING").map((order) => [order.orderNumber, order.customerName, order.customerPhone, order.shippingAddress, order.deliveryZone, String(order.totalAmount), order.transactionId ?? ""])]; const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n"); const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); const link = document.createElement("a"); link.href = url; link.download = "aloron-pending-orders.csv"; link.click(); URL.revokeObjectURL(url); };
  return <div className="mt-5"><button type="button" onClick={exportCsv} className="mb-4 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-black text-cyan-700 dark:text-cyan-200">অর্ডার রিপোর্ট এক্সপোর্ট (CSV)</button><div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-left text-sm"><thead className="text-xs uppercase tracking-wider text-slate-400"><tr><th className="pb-3">Order</th><th className="pb-3">Customer</th><th className="pb-3">Address / TrxID</th><th className="pb-3">Amount</th><th className="pb-3">Status</th><th className="pb-3">Tracking</th><th className="pb-3">Actions</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-t border-slate-100 dark:border-white/10"><td className="py-4 font-bold">{order.orderNumber}<span className="block text-xs font-normal text-slate-400">{order.deliveryZone}</span></td><td className="py-4 text-slate-500">{order.customerName}<span className="block text-xs">{order.customerPhone}</span></td><td className="py-4 text-xs text-slate-500">{order.shippingAddress}<span className="block text-cyan-600">{order.transactionId ?? "No TrxID"}</span></td><td className="py-4">৳{order.totalAmount.toLocaleString("en-BD")}</td><td className="py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold dark:bg-white/10">{order.orderStatus}</span></td><td className="py-4"><div className="flex gap-1"><input defaultValue={order.trackingNumber ?? ""} placeholder="Steadfast / Pathao" aria-label={`Tracking number for ${order.orderNumber}`} className="w-36 rounded-lg border border-slate-200 bg-transparent px-2 py-2 text-xs dark:border-white/10" /><button type="button" onClick={(event) => void updateTracking(order, (event.currentTarget.previousElementSibling as HTMLInputElement).value)} className="rounded-lg bg-violet-500 px-2 py-2 text-xs font-bold text-white">Save</button></div></td><td className="py-4"><div className="flex flex-wrap gap-2">{actions.map(([status, label]) => <button key={status} type="button" disabled={busy === order.id || order.orderStatus === status || (status === "CONFIRMED" && order.orderStatus !== "PENDING") || (status === "SHIPPED" && order.orderStatus !== "CONFIRMED") || (status === "DELIVERED" && order.orderStatus !== "SHIPPED")} onClick={() => void updateStatus(order.id, status)} className={`rounded-lg px-2.5 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-35 ${status === "CANCELLED" ? "bg-rose-100 text-rose-700" : "bg-cyan-100 text-cyan-700"}`}>{label}</button>)}</div></td></tr>)}</tbody></table>{orders.length === 0 && <p className="py-8 text-center text-sm text-slate-500">কোনো অর্ডার নেই।</p>}{error && <p role="alert" className="mt-3 text-sm text-rose-500">{error}</p>}</div></div>;
}
