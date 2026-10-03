"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  nameEn: z.string().trim().max(120).optional(),
  code: z.string().trim().min(2).max(40).regex(/^[A-Z0-9-]+$/i).optional(),
  productCode: z.string().trim().min(2).max(40).regex(/^[A-Z0-9-]+$/i).optional(),
  category: z.string().trim().min(2).max(60),
  price: z.coerce.number().finite().nonnegative().max(10_000_000).optional(),
  sellPrice: z.coerce.number().finite().nonnegative().max(10_000_000).optional(),
  originalPrice: z.coerce.number().finite().nonnegative().max(10_000_000).optional(),
  wholesaleCost: z.coerce.number().finite().nonnegative().max(10_000_000).optional(),
  buyPrice: z.coerce.number().finite().nonnegative().max(10_000_000).optional(),
  stock: z.coerce.number().int().nonnegative().max(1_000_000),
  imageData: z.string().optional(),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().trim().min(5).max(5000),
  specs: z.string().optional(),
  whatsInTheBox: z.string().optional(),
  isFeatured: z.coerce.boolean().default(true),
  isTrending: z.coerce.boolean().default(false),
});

type ActionResult = { success: true } | { success: false; error: string };

async function requireAdmin(): Promise<ActionResult | true> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return { success: false, error: "অনুমতি নেই।" };
  return true;
}

function generateSlug(name: string, code: string): string {
  const asciiPart = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const codePart = code.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
  if (asciiPart.length >= 2) return `${asciiPart}-${codePart}`;
  return `product-${codePart}`;
}

export async function createProduct(formData: FormData): Promise<ActionResult> {
  const access = await requireAdmin();
  if (access !== true) return access;
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, error: "সব তথ্য সঠিকভাবে পূরণ করুন।" };
  const data = parsed.data;

  const code = (data.code || data.productCode || "").toUpperCase();
  if (!code) return { success: false, error: "প্রোডাক্ট কোড দিন।" };

  const price = data.price ?? data.sellPrice;
  if (price === undefined || price <= 0) return { success: false, error: "সঠিক বিক্রয় মূল্য দিন।" };

  const existingByCode = await prisma.product.findUnique({ where: { code }, select: { id: true } });
  if (existingByCode) return { success: false, error: `"${code}" কোডটি ইতিমধ্যে ব্যবহৃত হয়েছে। অন্য কোড দিন।` };

  const slug = generateSlug(data.name, code);
  const existingBySlug = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
  if (existingBySlug) return { success: false, error: "একই নাম ও কোডের পণ্য ইতিমধ্যে আছে।" };

  const image = data.imageUrl || data.imageData || "/logo.png";
  let parsedSpecs: Record<string, string> | null = null;
  if (data.specs) {
    try {
      parsedSpecs = JSON.parse(data.specs);
    } catch {
      parsedSpecs = null;
    }
  }

  const parsedBox: string[] = data.whatsInTheBox
    ? data.whatsInTheBox.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  try {
    await prisma.product.create({
      data: {
        name: data.name,
        nameEn: data.nameEn || null,
        code,
        category: data.category,
        price,
        originalPrice: data.originalPrice ?? null,
        wholesaleCost: data.wholesaleCost ?? data.buyPrice ?? null,
        stock: data.stock,
        images: [image],
        videoUrl: data.videoUrl || null,
        description: data.description,
        specs: parsedSpecs ?? undefined,
        whatsInTheBox: parsedBox,
        isFeatured: data.isFeatured,
        isTrending: data.isTrending,
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

export async function updateProduct(
  productId: string,
  changes: { stock?: number; isFeatured?: boolean; isTrending?: boolean; price?: number; isActive?: boolean }
): Promise<ActionResult> {
  const access = await requireAdmin();
  if (access !== true) return access;
  if (!productId) return { success: false, error: "অবৈধ পণ্য।" };

  try {
    await prisma.product.update({ where: { id: productId }, data: changes });
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
  if (!productId) return { success: false, error: "অবৈধ পণ্য।" };

  try {
    const orderItems = await prisma.orderItem.count({ where: { productId } });
    if (orderItems > 0) return { success: false, error: "অর্ডার ইতিহাস থাকা পণ্য ডিলিট করা যাবে না।" };
    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Product deletion failed:", error);
    return { success: false, error: "পণ্য ডিলিট করা যায়নি।" };
  }
}