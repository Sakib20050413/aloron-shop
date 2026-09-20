"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const settingsSchema = z.object({
  noticeText: z.string().trim().min(2).max(240),
  heroTitle: z.string().trim().min(2).max(240),
  heroSubtitle: z.string().trim().min(2).max(500),
  bkashNumber: z.string().trim().regex(/^(?:\+?88)?01[3-9]\d{8}$/),
  advanceFee: z.coerce.number().int().nonnegative().max(100000),
  contactNumber: z.string().trim().regex(/^(?:\+?88)?01[3-9]\d{8}$/),
  whatsappNumber: z.string().trim().regex(/^(?:\+?88)?01[3-9]\d{8}$/),
  address: z.string().trim().min(2).max(240),
  insideDhakaFee: z.coerce.number().int().nonnegative().max(100000),
  outsideDhakaFee: z.coerce.number().int().nonnegative().max(100000),
});

export type SiteSettingsInput = z.infer<typeof settingsSchema>;

export async function saveSiteSettings(input: SiteSettingsInput) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return { success: false, error: "অনুমতি নেই।" } as const;
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "সেটিংসের তথ্য সঠিক নয়।" } as const;
  await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: parsed.data,
    create: { id: "global", ...parsed.data },
  });
  revalidatePath("/");
  revalidatePath("/checkout");
  revalidatePath("/admin");
  return { success: true } as const;
}
