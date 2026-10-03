"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const profileSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^01\d{9}$/, "সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।"),
});

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "লগইন করা আবশ্যক।" };
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, error: "প্রোফাইলের তথ্য সঠিকভাবে পূরণ করুন।" };
  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: parsed.data.name, phone: parsed.data.phone },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Profile update failed:", error);
    return { success: false, error: "প্রোফাইল আপডেট করা যায়নি।" };
  }
}
