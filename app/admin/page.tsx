import { notFound, redirect } from "next/navigation";
import { BarChart3, CircleDollarSign, Package, Truck } from "lucide-react";
import { auth } from "@/auth";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { AdminPortal } from "@/components/admin/AdminPortal";
import { getAdminCustomers } from "@/actions/customers";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { OWNER_ADMIN_EMAILS } from "@/auth";

const defaultSettings = {
  noticeText: "কুমিল্লাসহ সারাদেশে দ্রুততম হোম ডেলিভারি",
  heroTitle: "প্রয়োজনীয় সব স্মার্ট গ্যাজেট ও ইলেকট্রনিক্স",
  heroSubtitle: "১০০% টেস্টেড গ্যাজেট, মাত্র ২০০ টাকা বিকাশ অগ্রিমে বুকিং।",
  bkashNumber: "01615869724",
  advanceFee: 200,
  contactNumber: "01615869724",
  whatsappNumber: "01615869724",
  address: "কুমিল্লা, বাংলাদেশ",
  insideDhakaFee: 70,
  outsideDhakaFee: 150,
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") notFound();
  const [orders, products, settings, slides, adminUsers, registeredCustomerCount, customerPhoneRows, registeredUsers, customerResult] = await Promise.all([
    prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } }).catch((error) => { console.error("Admin order read failed:", error); return []; }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }).catch((error) => { console.error("Admin product read failed:", error); return []; }),
    prisma.siteSettings.findUnique({ where: { id: "global" } }).catch((error) => { console.error("Site settings read failed:", error); return null; }),
    prisma.heroSlide.findMany({ orderBy: { order: "asc" } }).catch((error) => { console.error("Hero slide read failed:", error); return []; }),
    prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true, name: true, email: true, image: true, role: true }, orderBy: { createdAt: "asc" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({ distinct: ["customerPhone"], select: { customerPhone: true } }),
    prisma.user.findMany({ where: { role: "CUSTOMER" }, select: { phone: true } }),
    getAdminCustomers(),
  ]);
  const registeredPhones = new Set(registeredUsers.map((user) => user.phone).filter((phone): phone is string => Boolean(phone)));
  const totalCustomerCount = registeredCustomerCount + customerPhoneRows.filter((row) => !registeredPhones.has(row.customerPhone)).length;
  const activeOrders = orders.filter((order) => order.orderStatus !== "CANCELLED");
  const sales = activeOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  const costs = activeOrders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + Number(item.unitCost) * item.quantity, 0), 0);
  const metrics = [
    ["মোট বিক্রয়", `৳${sales.toLocaleString("en-BD")}`, CircleDollarSign],
    ["অর্ডার", String(orders.length), Package],
    ["নিট লাভ", `৳${(sales - costs).toLocaleString("en-BD")}`, BarChart3],
    ["To dispatch", String(orders.filter((order) => order.orderStatus === "CONFIRMED").length), Truck],
    ["মোট গ্রাহক সংখ্যা", String(totalCustomerCount), Package],
  ] as const;
  const adminProducts = products.map((product) => ({ id: product.id, name: product.name, productCode: product.productCode, category: product.category, buyPrice: Number(product.buyPrice), sellPrice: Number(product.sellPrice), stock: product.stock, isActive: product.isActive, isFeatured: product.isFeatured }));
  const adminOrders = orders.map((order) => ({ id: order.id, orderNumber: order.orderNumber, customerName: order.customerName, customerPhone: order.customerPhone, shippingAddress: order.shippingAddress, bKashSender: order.bKashSender, transactionId: order.transactionId, trackingNumber: order.trackingNumber, deliveryZone: order.deliveryZone, totalAmount: Number(order.totalAmount), advanceAmount: Number(order.advanceAmount), orderStatus: order.orderStatus, createdAt: order.createdAt.toISOString(), cost: order.items.reduce((sum, item) => sum + Number(item.unitCost) * item.quantity, 0) }));
  const asOf = orders[0]?.createdAt.getTime() ?? 0;
  const savedSettings = settings ? { ...defaultSettings, ...settings, advanceFee: Number(settings.advanceFee), insideDhakaFee: Number(settings.insideDhakaFee), outsideDhakaFee: Number(settings.outsideDhakaFee) } : defaultSettings;
  const customers = customerResult.success ? customerResult.customers : [];
  const normalizedAdmins = adminUsers.filter((user) => user.role === "ADMIN" || OWNER_ADMIN_EMAILS.has(user.email.toLowerCase()));
  return <><Navbar /><main className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-600">Restricted portal</p><h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">Store Management System</h1></div><div className="flex items-center gap-3"><span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">Admin access</span><AdminLogoutButton /></div></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{metrics.map(([label, value, Icon]) => <div key={label} className="rounded-2xl border border-slate-200 p-5 dark:border-white/10"><Icon className="text-cyan-600" size={22} /><p className="mt-5 text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>)}</div><AdminPortal products={adminProducts} orders={adminOrders} settings={savedSettings} asOf={asOf} customers={customers} slides={slides.map((slide) => ({ ...slide, createdAt: slide.createdAt.toISOString(), updatedAt: slide.updatedAt.toISOString() }))} admins={normalizedAdmins} /></main></>;
}
