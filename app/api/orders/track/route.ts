import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const phoneSchema = z.string().trim().regex(/^(?:\+?88)?01[3-9]\d{8}$/);
const orderNumberSchema = z.string().trim().regex(/^ALR-(?:\d{4}-\d{4}|\d+)$/i);

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("88") ? digits.slice(2) : digits;
}

function maskPhone(phone: string) {
  const normalized = normalizePhone(phone);
  return `${normalized.slice(0, 4)}****${normalized.slice(-2)}`;
}

function maskAddress(address: string) {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  return parts.length >= 2 ? parts.slice(-2).join(", ") : parts[0]?.slice(0, 40) ?? "ঠিকানা গোপন রাখা হয়েছে";
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const orderNumber = orderNumberSchema.safeParse(params.get("orderId") ?? "");
  const phone = phoneSchema.safeParse(params.get("phone") ?? "");
  if (!orderNumber.success || !phone.success) {
    return NextResponse.json({ error: "অর্ডার নম্বর অথবা মোবাইল নম্বরটি সঠিক নয়।" }, { status: 404 });
  }

  const order = await prisma.order.findFirst({
    where: { orderNumber: { equals: orderNumber.data.toUpperCase() }, customerPhone: phone.data },
    select: {
      orderNumber: true,
      status: true,
      totalAmount: true,
      dueAmount: true,
      createdAt: true,
      customerPhone: true,
      deliveryAddress: true,
    },
  });

  if (!order || normalizePhone(order.customerPhone) !== normalizePhone(phone.data)) {
    return NextResponse.json({ error: "অর্ডার নম্বর অথবা মোবাইল নম্বরটি সঠিক নয়।" }, { status: 404 });
  }

  return NextResponse.json({
    orders: [
      {
        orderNumber: order.orderNumber,
        orderStatus: order.status,
        status: order.status,
        maskedPhone: maskPhone(order.customerPhone),
        maskedAddress: maskAddress(order.deliveryAddress),
        totalAmount: Number(order.totalAmount),
        dueAmount: Number(order.dueAmount),
        trackingNumber: null,
        createdAt: order.createdAt.toISOString(),
      },
    ],
  });
}
