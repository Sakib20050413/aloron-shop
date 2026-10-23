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
    select: { name: true, email: true, phone: true },
  });
  if (!user) redirect("/login?callbackUrl=/dashboard");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      orderNumber: true,
      totalAmount: true,
      advancePaid: true,
      dueAmount: true,
      status: true,
      createdAt: true,
      items: {
        select: {
          id: true,
          quantity: true,
          price: true,
          name: true,
          image: true,
        },
      },
    },
  });

  const serializedOrders = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    totalAmount: Number(order.totalAmount),
    advanceAmount: Number(order.advancePaid),
    dueAmount: Number(order.dueAmount),
    paymentStatus: "ADVANCE_PAID",
    orderStatus: order.status,
    trackingNumber: null,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: Number(item.price),
      productName: item.name,
      image: item.image ?? null,
    })),
  }));

  const total = serializedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pending = serializedOrders.filter(
    (order) => !["DELIVERED", "CANCELLED"].includes(order.orderStatus)
  ).length;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200/80 pb-6 dark:border-neutral-800">
          <div>
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              CUSTOMER ACCOUNT PORTAL
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
              স্বাগতম, {user.name || "গ্রাহক"}
            </h1>
            <span className="mt-2 inline-block rounded-md border border-neutral-200 bg-neutral-100 px-2.5 py-0.5 font-mono text-xs text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              {user.email}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {session.user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="inline-flex items-center rounded-lg bg-neutral-900 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                🛡️ অ্যাডমিন প্যানেল
              </Link>
            )}
            <LogoutButton />
          </div>
        </header>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Kpi label="মোট অর্ডার সংখ্যা" value={String(serializedOrders.length)} />
          <Kpi label="মোট ব্যয় (BDT)" value={`৳${total.toLocaleString("en-BD")}`} />
          <Kpi label="পেন্ডিং ডেলিভারি" value={String(pending)} />
        </div>

        <DashboardClient
          profile={{
            name: user.name,
            email: user.email,
            phone: user.phone ?? "",
            address: "",
            city: "",
          }}
          orders={serializedOrders}
        />
      </main>
    </>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
      <p className="mt-2 font-mono text-2xl font-bold text-neutral-950 dark:text-white">{value}</p>
    </div>
  );
}
