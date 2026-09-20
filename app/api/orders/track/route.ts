import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const phoneSchema = z.string().trim().regex(/^(?:\+?88)?01[3-9]\d{8}$/);

export async function GET(request: Request) {
  const phone = phoneSchema.safeParse(new URL(request.url).searchParams.get("phone") ?? "");
  if (!phone.success) return NextResponse.json({ error: "সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।" }, { status: 400 });
  const orders = await prisma.order.findMany({
    where: { customerPhone: phone.data },
    select: { orderNumber: true, orderStatus: true, totalAmount: true, dueAmount: true, trackingNumber: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return NextResponse.json({ orders: orders.map((order) => ({ ...order, totalAmount: Number(order.totalAmount), dueAmount: Number(order.dueAmount) })) });
}
