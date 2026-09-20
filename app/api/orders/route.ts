import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { orderSchema } from "@/lib/order-validation";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`orders:${ip}`, 10, 15 * 60_000)) return NextResponse.json({ error: "অনেক বেশি অর্ডার অনুরোধ হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।" }, { status: 429 });
  const session = await auth();
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  const parsed = orderSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid order details", details: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findFirst({
        where: { OR: [{ id: data.productId }, { slug: data.productId }, { productCode: data.productId }] },
      }) ?? await tx.product.findFirst({
        where: { isActive: true, stock: { gte: data.quantity } },
        orderBy: { createdAt: "asc" },
      });
      if (!product || !product.isActive || product.stock < data.quantity) throw new Error("Product is unavailable or out of stock.");
      const subtotal = Number(product.sellPrice) * data.quantity;
      let discountAmount = 0;
      if (data.couponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: data.couponCode.toUpperCase() } });
        if (!coupon || !coupon.isActive || subtotal + data.deliveryFee < Number(coupon.minOrderAmount)) throw new Error("কুপনটি প্রযোজ্য নয়।");
        discountAmount = coupon.discountType === "PERCENT" ? (subtotal + data.deliveryFee) * Number(coupon.discountValue) / 100 : Number(coupon.discountValue);
        discountAmount = Math.min(discountAmount, subtotal + data.deliveryFee);
      }
      const totalAmount = Math.max(subtotal + data.deliveryFee - discountAmount, 0);
      const advanceAmount = 200;
      const order = await tx.order.create({
        data: {
          orderNumber: `ALR-${Date.now().toString().slice(-6)}`,
          userId: session?.user?.id ?? null,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          shippingAddress: data.shippingAddress,
          deliveryZone: data.deliveryZone,
          deliveryFee: data.deliveryFee,
          subtotal,
          totalAmount,
          advanceAmount,
          dueAmount: Math.max(totalAmount - advanceAmount, 0),
          bKashSender: data.bKashSender,
          transactionId: data.transactionId,
          paymentStatus: "UNPAID",
          orderStatus: "PENDING",
          notes: data.notes,
          couponCode: data.couponCode?.toUpperCase(),
          discountAmount,
          items: { create: { productId: product.id, quantity: data.quantity, unitPrice: product.sellPrice, unitCost: product.buyPrice } },
        },
      });
      await tx.product.update({ where: { id: product.id }, data: { stock: { decrement: data.quantity } } });
      return order;
    });
    return NextResponse.json({ orderNumber: result.orderNumber }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create order";
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
