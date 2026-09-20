import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ code: z.string().trim().min(3).max(24), amount: z.coerce.number().nonnegative() });

export async function GET(request: Request) {
  const parsed = schema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Invalid coupon request." }, { status: 400 });
  const coupon = await prisma.coupon.findUnique({ where: { code: parsed.data.code.toUpperCase() } });
  if (!coupon || !coupon.isActive || parsed.data.amount < Number(coupon.minOrderAmount)) return NextResponse.json({ error: "কুপনটি প্রযোজ্য নয়।" }, { status: 400 });
  const discount = coupon.discountType === "PERCENT" ? parsed.data.amount * Number(coupon.discountValue) / 100 : Number(coupon.discountValue);
  return NextResponse.json({ code: coupon.code, discount: Math.min(Math.max(discount, 0), parsed.data.amount) });
}
