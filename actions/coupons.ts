"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  code: z.string().trim().min(3).max(24).regex(/^[A-Z0-9_-]+$/),
  discountType: z.enum(["FIXED", "PERCENT"]),
  discountValue: z.coerce.number().positive().max(100000),
  minOrderAmount: z.coerce.number().nonnegative().max(10000000),
});

export async function createCoupon(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "অনুমতি নেই।" };
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success || (parsed.data.discountType === "PERCENT" && parsed.data.discountValue > 100)) return { success: false, error: "কুপনের তথ্য সঠিক নয়।" };
  try {
    await prisma.coupon.create({ data: { ...parsed.data, code: parsed.data.code.toUpperCase() } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Coupon creation failed:", error);
    return { success: false, error: "এই কোডটি আগে থেকেই আছে।" };
  }
}

export async function toggleCoupon(id: string, isActive: boolean) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "অনুমতি নেই।" };
  if (!z.string().uuid().safeParse(id).success) return { success: false, error: "অবৈধ কুপন।" };
  await prisma.coupon.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin");
  return { success: true };
}
