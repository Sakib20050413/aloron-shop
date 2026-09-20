import { z } from "zod";

const safeText = (max: number) => z.string().trim().max(max).refine((value) => !/[<>]/.test(value), "Invalid characters");

export const orderSchema = z.object({
  productId: z.string().trim().min(1).max(100),
  quantity: z.number().int().positive().max(20),
  customerName: safeText(100).min(2),
  customerPhone: z.string().trim().regex(/^01\d{9}$/, "Invalid Bangladesh phone number"),
  shippingAddress: safeText(500).min(5),
  deliveryZone: safeText(120).min(1),
  deliveryFee: z.coerce.number().finite().nonnegative().max(100000),
  bKashSender: z.string().trim().min(5).max(30).regex(/^[0-9+ -]+$/, "Invalid sender number"),
  transactionId: z.string().trim().min(4).max(100).regex(/^[a-z0-9]+$/i, "Invalid bKash transaction ID"),
  notes: safeText(500).optional(),
  couponCode: z.string().trim().max(24).regex(/^[a-z0-9_-]+$/i, "Invalid coupon code").optional(),
});
