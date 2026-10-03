import { prisma } from "@/lib/prisma";
import { catalogProducts, type CatalogProduct } from "@/lib/catalog";

function mapDbProduct(product: Awaited<ReturnType<typeof prisma.product.findFirst>> & Record<string, unknown>, index: number): CatalogProduct {
  const fallback = catalogProducts[index % catalogProducts.length];
  return {
    id: product!.id as string,
    productCode: product!.productCode as string,
    name: product!.name as string,
    slug: product!.slug as string,
    description: product!.description as string,
    category: product!.category as string,
    buyPrice: Number(product!.buyPrice),
    sellPrice: Number(product!.sellPrice),
    originalPrice: Number(product!.originalPrice),
    stock: product!.stock as number,
    icon: fallback?.icon ?? "\u{1F4E6}",
    accent: fallback?.accent ?? "from-cyan-100 to-blue-100",
    images: Array.isArray(product!.images) && (product!.images as string[]).some((img) => img.startsWith("http") || img.startsWith("/"))
      ? (product!.images as string[])
      : (fallback?.images ?? []),
    specs: Object.fromEntries(Object.entries((product!.specs as Record<string, unknown> | null) ?? {}).map(([key, value]) => [key, String(value)])),
    videoUrl: (product as Record<string, unknown>).videoUrl as string | undefined ?? undefined,
    faqs: ((product as Record<string, unknown>).faqs as [string, string][] | null) ?? undefined,
    boxContents: Array.isArray((product as Record<string, unknown>).whatsInTheBox) && ((product as Record<string, unknown>).whatsInTheBox as string[]).length > 0
      ? ((product as Record<string, unknown>).whatsInTheBox as string[])
      : (((product as Record<string, unknown>).boxContents as string[] | null) ?? undefined),
  };
}

export async function getStoreProducts(): Promise<CatalogProduct[]> {
  try {
    const products = await prisma.product.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
    if (!products.length) return [];
    return products.map((product, index) => mapDbProduct(product as Record<string, unknown> & typeof product, index));
  } catch (error) {
    console.error("Catalog database read failed:", error);
    return catalogProducts;
  }
}

export async function getStoreProduct(idOrSlug: string): Promise<CatalogProduct | null> {
  try {
    const product = await prisma.product.findFirst({ where: { isActive: true, OR: [{ id: idOrSlug }, { slug: idOrSlug }] } });
    if (!product) return null;
    return mapDbProduct(product as Record<string, unknown> & typeof product, 0);
  } catch (error) {
    console.error("Product database read failed:", error);
    return catalogProducts.find((item) => item.id === idOrSlug || item.slug === idOrSlug) ?? null;
  }
}