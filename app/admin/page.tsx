import { notFound, redirect } from "next/navigation";
import { BarChart3, CircleDollarSign, Package, ShieldCheck, Truck, Users } from "lucide-react";
import { auth, OWNER_ADMIN_EMAILS } from "@/auth";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { AdminPortal } from "@/components/admin/AdminPortal";
import { getAdminCustomers } from "@/actions/customers";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { defaultSiteSettings } from "@/lib/settings";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") notFound();

  const [
    orders,
    products,
    settings,
    slides,
    adminUsers,
    registeredCustomerCount,
    customerPhoneRows,
    registeredUsers,
    customerResult,
  ] = await Promise.all([
    prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } }).catch((error) => {
      console.error("Admin order read failed:", error);
      return [];
    }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }).catch((error) => {
      console.error("Admin product read failed:", error);
      return [];
    }),
    prisma.storeSetting.findUnique({ where: { id: "global" } }).catch((error) => {
      console.error("Store settings read failed:", error);
      return null;
    }),
    prisma.heroSlide.findMany({ orderBy: { order: "asc" } }).catch((error) => {
      console.error("Hero slide read failed:", error);
      return [];
    }),
    prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({ distinct: ["customerPhone"], select: { customerPhone: true } }),
    prisma.user.findMany({ where: { role: "CUSTOMER" }, select: { phone: true } }),
    getAdminCustomers(),
  ]);

  const registeredPhones = new Set(
    registeredUsers.map((user) => user.phone).filter((phone): phone is string => Boolean(phone))
  );
  const totalCustomerCount =
    registeredCustomerCount +
    customerPhoneRows.filter((row) => !registeredPhones.has(row.customerPhone)).length;

  const activeOrders = orders.filter((order) => order.status !== "CANCELLED");
  const sales = activeOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  const costs = activeOrders.reduce(
    (sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + Number(item.price * 0.7) * item.quantity, 0),
    0
  );

  const metrics = [
    ["মোট বিক্রয়", `৳${sales.toLocaleString("en-BD")}`, CircleDollarSign],
    ["অর্ডার সংখ্যা", String(orders.length), Package],
    ["আনুমানিক নিট লাভ", `৳${(sales - costs).toLocaleString("en-BD")}`, BarChart3],
    ["প্যাকেজিং ও ডিসপ্যাচ", String(orders.filter((order) => order.status === "PACKAGING" || order.status === "CONFIRMED").length), Truck],
    ["মোট গ্রাহক সংখ্যা", String(totalCustomerCount), Users],
  ] as const;

  const adminProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    productCode: product.code,
    category: product.category,
    buyPrice: Number(product.wholesaleCost ?? product.price * 0.7),
    sellPrice: Number(product.price),
    stock: product.stock,
    isActive: true,
    isFeatured: product.isFeatured,
  }));

  const adminOrders = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    shippingAddress: order.deliveryAddress,
    bKashSender: order.bkashSenderNumber,
    transactionId: order.bkashTrxId,
    trackingNumber: null,
    deliveryZone: order.deliveryZone,
    totalAmount: Number(order.totalAmount),
    advanceAmount: Number(order.advancePaid),
    orderStatus: order.status,
    createdAt: order.createdAt.toISOString(),
    cost: order.items.reduce((sum, item) => sum + Number(item.price * 0.7) * item.quantity, 0),
  }));

  const asOf = orders[0]?.createdAt.getTime() ?? 0;
  const savedSettings = settings
    ? {
        ...defaultSiteSettings,
        announcementText: settings.announcementText,
        noticeText: settings.announcementText,
        supportPhone: settings.supportPhone,
        contactNumber: settings.supportPhone,
        supportWhatsApp: settings.supportWhatsApp,
        whatsappNumber: settings.supportWhatsApp,
        deliveryInsideDhaka: Number(settings.deliveryInsideDhaka),
        insideDhakaFee: Number(settings.deliveryInsideDhaka),
        deliveryOutsideDhaka: Number(settings.deliveryOutsideDhaka),
        outsideDhakaFee: Number(settings.deliveryOutsideDhaka),
        advanceBkashAmount: Number(settings.advanceBkashAmount),
        advanceFee: Number(settings.advanceBkashAmount),
        bkashNumber: settings.bkashNumber,
      }
    : defaultSiteSettings;

  const customers = customerResult.success ? customerResult.customers : [];
  const normalizedAdmins = adminUsers.map((user) => ({
    ...user,
    image: null,
  })).filter((user) => user.role === "ADMIN" || OWNER_ADMIN_EMAILS.has(user.email.toLowerCase()));

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200/80 pb-6 dark:border-neutral-800">
          <div>
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              SECURE ENGINE // STORE MANAGEMENT
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
              অ্যাডমিন পোর্টাল ও অপারেশনাল হাব
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-100 px-2.5 py-1 font-mono text-xs font-semibold text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>AUTHORIZED ADMIN</span>
            </span>
            <AdminLogoutButton />
          </div>
        </div>

        <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {metrics.map(([label, value, Icon]) => (
            <div key={label} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">{label}</span>
                <Icon className="text-neutral-600 dark:text-neutral-400" size={17} />
              </div>
              <p className="mt-3 font-mono text-xl font-bold text-neutral-950 dark:text-white sm:text-2xl">{value}</p>
            </div>
          ))}
        </div>

        <AdminPortal
          products={adminProducts}
          orders={adminOrders}
          settings={savedSettings}
          asOf={asOf}
          customers={customers}
          slides={slides.map((slide) => ({
            ...slide,
            createdAt: slide.createdAt.toISOString(),
            updatedAt: slide.updatedAt.toISOString(),
          }))}
          admins={normalizedAdmins}
        />
      </main>
    </>
  );
}
