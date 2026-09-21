"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const emailSchema = z.string().trim().toLowerCase().email().max(254);
const protectedOwnerEmail = "mdnajmussakib2003@gmail.com";

type ActionResult = { success: true } | { success: false; error: string };

async function requireAdmin(): Promise<ActionResult | true> {
  const session = await auth();
  return session?.user?.role === "ADMIN" ? true : { success: false, error: "অনুমতি নেই।" };
}

export async function promoteAdmin(emailInput: string): Promise<ActionResult> {
  const access = await requireAdmin();
  if (access !== true) return access;
  const parsed = emailSchema.safeParse(emailInput);
  if (!parsed.success) return { success: false, error: "সঠিক ইমেইল ঠিকানা দিন।" };
  const email = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { success: false, error: "এই ইমেইলে কোনো ব্যবহারকারী পাওয়া যায়নি। আগে তাকে সাইন ইন করতে হবে।" };
  await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
  revalidatePath("/admin");
  return { success: true };
}

export async function demoteAdmin(userId: string): Promise<ActionResult> {
  const access = await requireAdmin();
  if (access !== true) return access;
  const parsedId = z.string().uuid().safeParse(userId);
  if (!parsedId.success) return { success: false, error: "অবৈধ অ্যাডমিন।" };
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, role: true } });
  if (!user || user.role !== "ADMIN") return { success: false, error: "অ্যাডমিন পাওয়া যায়নি।" };
  if (user.email.toLowerCase() === protectedOwnerEmail) return { success: false, error: "প্রধান মালিককে ডিমোট করা যাবে না।" };
  await prisma.user.update({ where: { id: userId }, data: { role: "CUSTOMER" } });
  revalidatePath("/admin");
  return { success: true };
}
