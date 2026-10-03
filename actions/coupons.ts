"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createCoupon(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "FORBIDDEN" };
  const code = formData.get("code") as string;
  if (!code) return { success: false, error: "কুপন কোড দিন।" };
  revalidatePath("/admin");
  return { success: true };
}

export async function toggleCoupon(id: string, isActive: boolean) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "FORBIDDEN" };
  void id;
  void isActive;
  revalidatePath("/admin");
  return { success: true };
}
