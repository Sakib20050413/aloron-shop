"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  productCode: z.string().trim().min(2).max(40).regex(/^[A-Z0-9-]+$/),
  category: z.string().trim().min(2).max(60),
  buyPrice: z.coerce.number().finite().nonnegative().max(10_000_000),
  sellPrice: z.coerce.number().finite().nonnegative().max(10_000_000),
  originalPrice: z.coerce.number().finite().nonnegative().max(10_000_000),
  stock: z.coerce.number().int().nonnegative().max(1_000_000),
  imageData: z.string().regex(/^data:image\/(?:jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/).max(2_500_000),
  description: z.string().trim().min(5).max(5000),
  isFeatured: z.coerce.boolean().default(false),
});

type ActionResult = { success: true } | { success: false; error: string };

async function requireAdmin(): Promise<ActionResult | true> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return { success: false, error: "অনুমতি নেই।" };
  return true;
}

function generateSlug(name: string, productCode: string): string {
  const asciiPart = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const codePart = productCode.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
  if (asciiPart.length >= 2) return `${asciiPart}-${codePart}`;
  return `product-${codePart}`;
}

export async function createProduct(formData: FormData): Promise<ActionResult> {
  const access = await requireAdmin();
  if (access !== true) return access;
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, error: "সব তথ্য সঠিকভাবে পূরণ করুন।" };
  const data = parsed.data;
  const existingByCode = await prisma.product.findUnique({ where: { productCode: data.productCode }, select: { id: true } });
  if (existingByCode) return { success: false, error: `"${data.productCode}" কোডটি ইতিমধ্যে ব্যবহৃত হয়েছে। অন্য কোড দিন।` };
  const slug = generateSlug(data.name, data.productCode);
  const existingBySlug = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
  if (existingBySlug) return { success: false, error: "একই নাম ও কোডের পণ্য ইতিমধ্যে আছে।" };
  try {
    await prisma.product.create({
      data: {
        name: data.name,
        productCode: data.productCode,
        category: data.category,
        buyPrice: data.buyPrice,
        sellPrice: data.sellPrice,
        originalPrice: data.originalPrice,
        stock: data.stock,
        images: [data.imageData],
        description: data.description,
        isFeatured: data.isFeatured,
        slug,
      },
    });
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Product creation failed:", error);
    return { success: false, error: "পণ্য তৈরি করা যায়নি। আবার চেষ্টা করুন।" };
  }
}

export async function updateProduct(productId: string, changes: { stock?: number; isActive?: boolean; isFeatured?: boolean }): Promise<ActionResult> {
  const access = await requireAdmin();
  if (access !== true) return access;
  const parsedId = z.string().uuid().safeParse(productId);
  const parsedChanges = z.object({ stock: z.number().int().nonnegative().max(1_000_000).optional(), isActive: z.boolean().optional(), isFeatured: z.boolean().optional() }).safeParse(changes);
  if (!parsedId.success || !parsedChanges.success || Object.keys(parsedChanges.data).length === 0) return { success: false, error: "অবৈধ পরিবর্তন।" };
  try {
    await prisma.product.update({ where: { id: productId }, data: parsedChanges.data });
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Product update failed:", error);
    return { success: false, error: "পণ্য আপডেট করা যায়নি।" };
  }
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  const access = await requireAdmin();
  if (access !== true) return access;
  const parsedId = z.string().uuid().safeParse(productId);
  if (!parsedId.success) return { success: false, error: "অবৈধ পণ্য।" };
  try {
    const orderItems = await prisma.orderItem.count({ where: { productId } });
    if (orderItems > 0) return { success: false, error: "অর্ডার ইতিহাস থাকা পণ্য ডিলিট করা যাবে না; নিষ্ক্রিয় করুন।" };
    await prisma.$transaction([
      prisma.review.deleteMany({ where: { productId } }),
      prisma.wishlist.deleteMany({ where: { productId } }),
      prisma.product.delete({ where: { id: productId } }),
    ]);
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Product deletion failed:", error);
    return { success: false, error: "পণ্য ডিলিট করা যায়নি।" };
  }
}