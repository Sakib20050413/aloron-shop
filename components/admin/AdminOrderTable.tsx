"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Download, Save } from "lucide-react";

type AdminOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  deliveryZone: string;
  bKashSender: string | null;
  transactionId: string | null;
  trackingNumber: string | null;
  totalAmount: number;
  orderStatus: string;
};

const actions = [
  ["CONFIRMED", "কনফার্ম করুন"],
  ["PACKAGING", "প্যাকেজিং শুরু"],
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
    setBusy(id);
    setError("");
    const response = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      setError("স্ট্যাটাস আপডেট করা যায়নি।");
      setBusy("");
      return;
    }
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, orderStatus: status } : order))
    );
    setBusy("");
    router.refresh();
  };

  const updateTracking = async (order: AdminOrder, trackingNumber: string) => {
    setBusy(order.id);
    const response = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingNumber }),
    });
    if (response.ok) {
      setOrders((current) =>
        current.map((item) => (item.id === order.id ? { ...item, trackingNumber } : item))
      );
    } else {
      setError("ট্র্যাকিং নম্বর সংরক্ষণ করা যায়নি।");
    }
    setBusy("");
  };

  const exportCsv = () => {
    const rows = [
      ["Order", "Customer", "Phone", "Address", "Zone", "Amount", "bKash TrxID"],
      ...orders
        .filter((order) => order.orderStatus === "PENDING")
        .map((order) => [
          order.orderNumber,
          order.customerName,
          order.customerPhone,
          order.shippingAddress,
          order.deliveryZone,
          String(order.totalAmount),
          order.transactionId ?? "",
        ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "aloron-pending-orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-1.5 font-mono text-xs font-semibold text-neutral-800 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
        >
          <Download size={13} />
          <span>অর্ডার রিপোর্ট এক্সপোর্ট (CSV)</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left font-mono text-xs">
          <thead className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800">
            <tr>
              <th className="pb-3 pr-4 uppercase">অর্ডার নম্বর</th>
              <th className="pb-3 pr-4 uppercase">গ্রাহক</th>
              <th className="pb-3 pr-4 uppercase">ঠিকানা ও TrxID</th>
              <th className="pb-3 pr-4 uppercase">মূল্য</th>
              <th className="pb-3 pr-4 uppercase">স্ট্যাটাস</th>
              <th className="pb-3 pr-4 uppercase">কুরিয়ার ট্র্যাকিং</th>
              <th className="pb-3 uppercase">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="py-3.5 pr-4">
                  <span className="font-bold text-neutral-900 dark:text-white">#{order.orderNumber}</span>
                  <span className="block text-[10px] text-neutral-400">{order.deliveryZone}</span>
                </td>
                <td className="py-3.5 pr-4">
                  <span className="font-sans font-semibold text-neutral-800 dark:text-neutral-200">
                    {order.customerName}
                  </span>
                  <span className="block text-[11px] text-neutral-500">{order.customerPhone}</span>
                </td>
                <td className="py-3.5 pr-4 text-[11px] text-neutral-600 dark:text-neutral-400">
                  <span className="block max-w-[220px] truncate">{order.shippingAddress}</span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">
                    TrxID: {order.transactionId ?? "নেই"}
                  </span>
                </td>
                <td className="py-3.5 pr-4 font-bold text-neutral-900 dark:text-white">
                  ৳{order.totalAmount.toLocaleString("en-BD")}
                </td>
                <td className="py-3.5 pr-4">
                  <span className="rounded-md border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                    {order.orderStatus}
                  </span>
                </td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-1">
                    <input
                      defaultValue={order.trackingNumber ?? ""}
                      placeholder="Steadfast / Pathao…"
                      aria-label={`Tracking number for ${order.orderNumber}`}
                      className="w-32 rounded border border-neutral-300 bg-transparent px-2 py-1 text-xs dark:border-neutral-700"
                    />
                    <button
                      type="button"
                      onClick={(event) =>
                        void updateTracking(
                          order,
                          (event.currentTarget.previousElementSibling as HTMLInputElement).value
                        )
                      }
                      className="rounded border border-neutral-300 bg-white p-1 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                      title="Save Tracking"
                    >
                      <Save size={13} />
                    </button>
                  </div>
                </td>
                <td className="py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {actions.map(([status, label]) => {
                      const isDisabled =
                        busy === order.id ||
                        order.orderStatus === status ||
                        (status === "CONFIRMED" && order.orderStatus !== "PENDING") ||
                        (status === "PACKAGING" && order.orderStatus !== "CONFIRMED") ||
                        (status === "SHIPPED" && !["CONFIRMED", "PACKAGING"].includes(order.orderStatus)) ||
                        (status === "DELIVERED" && order.orderStatus !== "SHIPPED");

                      return (
                        <button
                          key={status}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => void updateStatus(order.id, status)}
                          className={`rounded px-2 py-1 text-[10px] font-bold transition disabled:cursor-not-allowed disabled:opacity-30 ${
                            status === "CANCELLED"
                              ? "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                              : "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-400">
                  কোনো অর্ডার নেই।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {error && <p role="alert" className="mt-3 font-mono text-xs text-rose-500">{error}</p>}
    </div>
  );
}
