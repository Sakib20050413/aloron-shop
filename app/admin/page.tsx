import { notFound, redirect } from "next/navigation";
import { BarChart3, CircleDollarSign, Package, Truck } from "lucide-react";
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
    ["অর্ডার", String(orders.length), Package],
    ["নিট লাভ", `৳${(sales - costs).toLocaleString("en-BD")}`, BarChart3],
    ["প্যাকেজিং / ডিসপ্যাচ", String(orders.filter((order) => order.status === "PACKAGING" || order.status === "CONFIRMED").length), Truck],
    ["মোট গ্রাহক সংখ্যা", String(totalCustomerCount), Package],
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
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-600">Restricted portal</p>
            <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">Store Management System</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">Admin access</span>
            <AdminLogoutButton />
          </div>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {metrics.map(([label, value, Icon]) => (
            <div key={label} className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
              <Icon className="text-cyan-600" size={22} />
              <p className="mt-5 text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-black">{value}</p>
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
