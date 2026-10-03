import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  code: z.string().trim().min(3).max(24),
  amount: z.coerce.number().nonnegative(),
});

const activeCoupons: Record<string, { discount: number; type: "FIXED" | "PERCENT"; minOrder: number }> = {
  ALORON50: { discount: 50, type: "FIXED", minOrder: 500 },
  ALORON100: { discount: 100, type: "FIXED", minOrder: 1000 },
  ALORON10: { discount: 10, type: "PERCENT", minOrder: 1000 },
};

export async function GET(request: Request) {
  const parsed = schema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Invalid coupon request." }, { status: 400 });

  const code = parsed.data.code.toUpperCase();
  const coupon = activeCoupons[code];

  if (!coupon || parsed.data.amount < coupon.minOrder) {
    return NextResponse.json({ error: "কুপনটি প্রযোজ্য নয়।" }, { status: 400 });
  }

  const discount =
    coupon.type === "PERCENT"
      ? (parsed.data.amount * coupon.discount) / 100
      : coupon.discount;

  return NextResponse.json({
    code,
    discount: Math.min(Math.max(discount, 0), parsed.data.amount),
  });
}
