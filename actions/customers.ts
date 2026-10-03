"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type AdminCustomerOrder = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  advanceAmount: number;
  paymentStatus?: string;
  orderStatus: string;
  shippingAddress: string;
  notes?: string | null;
  createdAt: string;
  items: { quantity: number; unitPrice: number; productName: string }[];
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  address?: string | null;
  city?: string | null;
  createdAt: string;
  orders: AdminCustomerOrder[];
};

type CustomerResult = { success: true; customers: AdminCustomer[] } | { success: false; error: string };

export async function getAdminCustomers(): Promise<CustomerResult> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "FORBIDDEN" };

  try {
    const users = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        orders: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            advancePaid: true,
            status: true,
            deliveryAddress: true,
            createdAt: true,
            items: {
              select: {
                quantity: true,
                price: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const customers: AdminCustomer[] = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? "—",
      createdAt: user.createdAt.toISOString(),
      orders: user.orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: Number(order.totalAmount),
        advanceAmount: Number(order.advancePaid),
        orderStatus: order.status,
        shippingAddress: order.deliveryAddress,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          quantity: item.quantity,
          unitPrice: Number(item.price),
          productName: item.name,
        })),
      })),
    }));

    return { success: true, customers };
  } catch (error) {
    console.error("Failed to load admin customers:", error);
    return { success: false, error: "DATABASE_ERROR" };
  }
}
