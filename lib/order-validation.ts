import { z } from "zod";

const safeText = (max: number) => z.string().trim().max(max).refine((value) => !/[<>]/.test(value), "Invalid characters");

export const orderSchema = z.object({
  productId: z.string().trim().min(1).max(100),
  quantity: z.number().int().positive().max(20),
  customerName: safeText(100).min(2),
  customerPhone: z.string().trim().regex(/^01\d{9}$/, "Invalid Bangladesh phone number"),
  shippingAddress: safeText(500).min(5),
  deliveryZone: z.enum(["ঢাকার ভেতরে", "ঢাকার বাইরে (সারা বাংলাদেশ)"]),
  deliveryFee: z.coerce.number().refine((value) => value === 70 || value === 150, "Invalid delivery fee"),
  bKashSender: z.string().trim().regex(/^01[3-9]\d{8}$/, "Invalid bKash sender number"),
  transactionId: z.string().trim().min(4).max(100).regex(/^[a-z0-9]+$/i, "Invalid bKash transaction ID"),
  notes: safeText(500).optional(),
  couponCode: z.string().trim().max(24).regex(/^[a-z0-9_-]+$/i, "Invalid coupon code").optional(),
}).superRefine((data, context) => {
  const expectedFee = data.deliveryZone === "ঢাকার ভেতরে" ? 70 : 150;
  if (data.deliveryFee !== expectedFee) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["deliveryFee"], message: "Delivery fee does not match the selected zone" });
  }
});
