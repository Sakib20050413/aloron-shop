import { prisma } from "@/lib/prisma";
import { catalogProducts, type CatalogProduct } from "@/lib/catalog";

function mapDbProduct(
  product: Awaited<ReturnType<typeof prisma.product.findFirst>> & Record<string, unknown>,
  index: number
): CatalogProduct {
  const fallback = catalogProducts[index % catalogProducts.length];
  const price = Number(product!.price ?? fallback?.price ?? 0);
  const originalPrice = product!.originalPrice ? Number(product!.originalPrice) : fallback?.originalPrice ?? price;
  const wholesaleCost = product!.wholesaleCost ? Number(product!.wholesaleCost) : fallback?.wholesaleCost ?? null;
  const code = (product!.code as string) ?? fallback?.code ?? "GAD-01";
  const whatsInTheBox = Array.isArray(product!.whatsInTheBox) && (product!.whatsInTheBox as string[]).length > 0
    ? (product!.whatsInTheBox as string[])
    : fallback?.whatsInTheBox ?? [];

  return {
    id: product!.id as string,
    code,
    productCode: code,
    name: product!.name as string,
    nameEn: (product!.nameEn as string) ?? fallback?.nameEn ?? null,
    slug: product!.slug as string,
    description: product!.description as string,
    category: product!.category as string,
    price,
    sellPrice: price,
    originalPrice,
    wholesaleCost,
    buyPrice: wholesaleCost ?? price,
    stock: product!.stock as number,
    icon: fallback?.icon ?? "📦",
    accent: fallback?.accent ?? "from-cyan-100 to-blue-100",
    images:
      Array.isArray(product!.images) && (product!.images as string[]).length > 0
        ? (product!.images as string[])
        : fallback?.images ?? ["/logo.png"],
    specs: (product!.specs as Record<string, string> | null) ?? fallback?.specs ?? {},
    videoUrl: (product!.videoUrl as string | null) ?? null,
    whatsInTheBox,
    boxContents: whatsInTheBox,
    isTrending: Boolean(product!.isTrending),
    isFeatured: Boolean(product!.isFeatured),
  };
}

export async function getStoreProducts(): Promise<CatalogProduct[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (!products.length) return catalogProducts;
    return products.map((product, index) =>
      mapDbProduct(product as Record<string, unknown> & typeof product, index)
    );
  } catch (error) {
    console.error("Catalog database read failed:", error);
    return catalogProducts;
  }
}

export async function getStoreProduct(idOrSlug: string): Promise<CatalogProduct | null> {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }, { code: idOrSlug }],
      },
    });
    if (!product) {
      return (
        catalogProducts.find(
          (item) => item.id === idOrSlug || item.slug === idOrSlug || item.code === idOrSlug
        ) ?? null
      );
    }
    return mapDbProduct(product as Record<string, unknown> & typeof product, 0);
  } catch (error) {
    console.error("Product database read failed:", error);
    return (
      catalogProducts.find(
        (item) => item.id === idOrSlug || item.slug === idOrSlug || item.code === idOrSlug
      ) ?? null
    );
  }
}