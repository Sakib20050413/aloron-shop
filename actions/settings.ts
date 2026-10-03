"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const settingsSchema = z.object({
  announcementText: z.string().trim().min(2).max(240).optional(),
  noticeText: z.string().trim().min(2).max(240).optional(),
  heroTitle: z.string().trim().min(2).max(240).optional(),
  heroSubtitle: z.string().trim().min(2).max(500).optional(),
  bkashNumber: z.string().trim().regex(/^(?:\+?88)?01[3-9]\d{8}$/),
  advanceFee: z.coerce.number().int().nonnegative().max(100000).optional(),
  advanceBkashAmount: z.coerce.number().int().nonnegative().max(100000).optional(),
  contactNumber: z.string().trim().regex(/^(?:\+?88)?01[3-9]\d{8}$/).optional(),
  supportPhone: z.string().trim().regex(/^(?:\+?88)?01[3-9]\d{8}$/).optional(),
  whatsappNumber: z.string().trim().regex(/^(?:\+?88)?01[3-9]\d{8}$/).optional(),
  supportWhatsApp: z.string().trim().regex(/^(?:\+?88)?01[3-9]\d{8}$/).optional(),
  address: z.string().trim().min(2).max(240).optional(),
  insideDhakaFee: z.coerce.number().int().nonnegative().max(100000).optional(),
  deliveryInsideDhaka: z.coerce.number().int().nonnegative().max(100000).optional(),
  outsideDhakaFee: z.coerce.number().int().nonnegative().max(100000).optional(),
  deliveryOutsideDhaka: z.coerce.number().int().nonnegative().max(100000).optional(),
});

export type SiteSettingsInput = z.infer<typeof settingsSchema>;

export async function saveSiteSettings(input: SiteSettingsInput) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return { success: false, error: "অনুমতি নেই।" } as const;
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "সেটিংসের তথ্য সঠিক নয়।" } as const;

  const data = parsed.data;
  const announcementText = data.announcementText || data.noticeText || "ঢাকা থেকে সারাদেশে দ্রুততম হোম ডেলিভারি | হটলাইন: ০১৬১৫৮৬৯৭২৪";
  const supportPhone = data.supportPhone || data.contactNumber || "01615869724";
  const supportWhatsApp = data.supportWhatsApp || data.whatsappNumber || "8801615869724";
  const deliveryInsideDhaka = Number(data.deliveryInsideDhaka ?? data.insideDhakaFee ?? 70);
  const deliveryOutsideDhaka = Number(data.deliveryOutsideDhaka ?? data.outsideDhakaFee ?? 150);
  const advanceBkashAmount = Number(data.advanceBkashAmount ?? data.advanceFee ?? 200);

  await prisma.storeSetting.upsert({
    where: { id: "global" },
    update: {
      announcementText,
      supportPhone,
      supportWhatsApp,
      deliveryInsideDhaka,
      deliveryOutsideDhaka,
      advanceBkashAmount,
      bkashNumber: data.bkashNumber,
    },
    create: {
      id: "global",
      announcementText,
      supportPhone,
      supportWhatsApp,
      deliveryInsideDhaka,
      deliveryOutsideDhaka,
      advanceBkashAmount,
      bkashNumber: data.bkashNumber,
      bkashAccountType: "Personal",
    },
  });

  revalidatePath("/");
  revalidatePath("/checkout");
  revalidatePath("/admin");
  return { success: true } as const;
}
