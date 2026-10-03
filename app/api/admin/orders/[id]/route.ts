import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({ status: z.enum(["PENDING", "CONFIRMED", "PACKAGING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(), trackingNumber: z.string().trim().max(100).optional() }).refine((data) => data.status || data.trackingNumber !== undefined);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = statusSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const { id } = await params;
  try {
    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(parsed.data.status ? { orderStatus: parsed.data.status } : {}),
        ...(parsed.data.trackingNumber !== undefined ? { trackingNumber: parsed.data.trackingNumber } : {}),
        ...(parsed.data.status === "DELIVERED" ? { paymentStatus: "FULLY_PAID" } : {}),
      },
    });
    return NextResponse.json({ id: order.id, status: order.orderStatus });
  } catch {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
}
