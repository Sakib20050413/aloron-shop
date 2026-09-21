"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const slideSchema = z.object({
  title: z.string().trim().min(2).max(240),
  subtitle: z.string().trim().min(2).max(240),
  badgeText: z.string().trim().min(2).max(120),
  discountTag: z.string().trim().max(60),
  priceText: z.string().trim().min(1).max(60),
  ctaText: z.string().trim().min(1).max(80),
  ctaLink: z.string().trim().regex(/^\/[a-zA-Z0-9/?=&%._-]*$/),
  imageUrl: z.string().trim().url().max(2000),
  order: z.coerce.number().int().min(0).max(10000),
  isActive: z.coerce.boolean(),
});

type Result = { success: true } | { success: false; error: string };

async function requireAdmin(): Promise<Result | true> {
  const session = await auth();
  return session?.user?.role === "ADMIN" ? true : { success: false, error: "অনুমতি নেই।" };
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createHeroSlide(formData: FormData): Promise<Result> {
  const access = await requireAdmin();
  if (access !== true) return access;
  const parsed = slideSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, error: "স্লাইডের সব তথ্য সঠিকভাবে পূরণ করুন।" };
  await prisma.heroSlide.create({ data: parsed.data });
  refresh();
  return { success: true };
}

export async function updateHeroSlide(id: string, changes: Partial<z.input<typeof slideSchema>>): Promise<Result> {
  const access = await requireAdmin();
  if (access !== true) return access;
  const parsedId = z.string().cuid().safeParse(id);
  const parsed = slideSchema.partial().safeParse(changes);
  if (!parsedId.success || !parsed.success || !Object.keys(parsed.data).length) return { success: false, error: "অবৈধ স্লাইড পরিবর্তন।" };
  await prisma.heroSlide.update({ where: { id }, data: parsed.data });
  refresh();
  return { success: true };
}

export async function deleteHeroSlide(id: string): Promise<Result> {
  const access = await requireAdmin();
  if (access !== true) return access;
  const parsedId = z.string().cuid().safeParse(id);
  if (!parsedId.success) return { success: false, error: "অবৈধ স্লাইড।" };
  await prisma.heroSlide.delete({ where: { id } });
  refresh();
  return { success: true };
}
