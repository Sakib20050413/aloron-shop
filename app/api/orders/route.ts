import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { orderSchema } from "@/lib/order-validation";

function generateOrderNumber() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `ALR-${yy}${mm}-${seq}`;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`orders:${ip}`, 10, 15 * 60_000)) {
    return NextResponse.json(
      { error: "অনেক বেশি অর্ডার অনুরোধ হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।" },
      { status: 429 }
    );
  }

  const session = await auth();
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid order details", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const product =
        (await tx.product.findFirst({
          where: { OR: [{ id: data.productId }, { slug: data.productId }, { code: data.productId }] },
        })) ??
        (await tx.product.findFirst({
          where: { stock: { gte: data.quantity } },
          orderBy: { createdAt: "asc" },
        }));

      if (!product || product.stock < data.quantity) {
        throw new Error("Product is unavailable or out of stock.");
      }

      const subtotal = Number(product.price) * data.quantity;
      const totalAmount = Math.max(subtotal + data.deliveryFee, 0);
      const advancePaid = 200;
      const dueAmount = Math.max(totalAmount - advancePaid, 0);

      const zoneValue = data.deliveryZone === "ঢাকার ভেতরে" ? "inside_dhaka" : "outside_dhaka";

      const order = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session?.user?.id ?? null,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          deliveryAddress: data.shippingAddress,
          deliveryZone: zoneValue,
          deliveryFee: data.deliveryFee,
          totalAmount,
          advancePaid,
          dueAmount,
          bkashSenderNumber: data.bKashSender,
          bkashTrxId: data.transactionId,
          status: "PENDING",
          items: {
            create: {
              productId: product.id,
              name: product.name,
              price: Number(product.price),
              quantity: data.quantity,
              image: product.images[0] ?? null,
            },
          },
        },
      });

      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: data.quantity } },
      });

      return order;
    });

    return NextResponse.json({ orderNumber: result.orderNumber }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create order";
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
