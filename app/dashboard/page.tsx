import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { Navbar } from "@/components/Navbar";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { LogoutButton } from "@/components/LogoutButton";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true, address: true, city: true },
  });
  if (!user) redirect("/login?callbackUrl=/dashboard");
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true, orderNumber: true, totalAmount: true, advanceAmount: true, dueAmount: true,
      paymentStatus: true, orderStatus: true, trackingNumber: true, createdAt: true,
      items: { select: { id: true, quantity: true, unitPrice: true, product: { select: { name: true, images: true } } } },
    },
  });
  const serializedOrders = orders.map((order) => ({
    id: order.id, orderNumber: order.orderNumber, totalAmount: Number(order.totalAmount),
    advanceAmount: Number(order.advanceAmount), dueAmount: Number(order.dueAmount),
    paymentStatus: order.paymentStatus, orderStatus: order.orderStatus,
    trackingNumber: order.trackingNumber, createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({ id: item.id, quantity: item.quantity, unitPrice: Number(item.unitPrice), productName: item.product.name, image: item.product.images[0] ?? null })),
  }));
  const total = serializedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pending = serializedOrders.filter((order) => !["DELIVERED", "CANCELLED"].includes(order.orderStatus)).length;
  return <><Navbar /><main className="mx-auto max-w-7xl px-5 py-10 lg:px-8"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-600">Customer space</p><h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">স্বাগতম, {user.name || "সম্মানিত গ্রাহক"}</h1><span className="mt-3 inline-block rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-500 dark:border-white/10">{user.email}</span></div><div className="flex flex-wrap items-center gap-3">{session.user.role === "ADMIN" && <Link href="/admin" className="rounded-xl bg-cyan-500 px-4 py-3 text-sm font-black text-slate-950 shadow-[0_0_16px_rgba(6,182,212,0.25)] transition hover:bg-cyan-300 active:scale-[0.97]">🛡️ অ্যাডমিন প্যানেল (Admin Panel)</Link>}<LogoutButton /></div></header><div className="mt-8 grid gap-4 sm:grid-cols-3"><Kpi label="মোট অর্ডার সংখ্যা" value={String(serializedOrders.length)} /><Kpi label="মোট খরচ (BDT)" value={`৳${total.toLocaleString("en-BD")}`} /><Kpi label="পেন্ডিং ডেলিভারি" value={String(pending)} /></div><DashboardClient profile={{ name: user.name, email: user.email, phone: user.phone ?? "", address: user.address ?? "", city: user.city ?? "" }} orders={serializedOrders} /></main></>;
}

function Kpi({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-200 p-5 shadow-sm dark:border-white/10"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{value}</p></div>;
}
