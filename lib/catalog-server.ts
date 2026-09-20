import { prisma } from "@/lib/prisma";
import { catalogProducts, type CatalogProduct } from "@/lib/catalog";

export async function getStoreProducts(): Promise<CatalogProduct[]> {
  try {
    const products = await prisma.product.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
    if (!products.length) return catalogProducts;
    return products.map((product, index) => ({
      id: product.id,
      productCode: product.productCode,
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category,
      buyPrice: Number(product.buyPrice),
      sellPrice: Number(product.sellPrice),
      originalPrice: Number(product.originalPrice),
      stock: product.stock,
      icon: catalogProducts[index % catalogProducts.length]?.icon ?? "📦",
      accent: catalogProducts[index % catalogProducts.length]?.accent ?? "from-cyan-100 to-blue-100",
      images: product.images.length ? product.images : (catalogProducts[index % catalogProducts.length]?.images ?? ["📦"]),
      specs: Object.fromEntries(Object.entries((product.specs as Record<string, unknown> | null) ?? {}).map(([key, value]) => [key, String(value)])),
    }));
  } catch (error) {
    console.error("Catalog database read failed; using seeded fallback:", error);
    return catalogProducts;
  }
}

export async function getStoreProduct(id: string) {
  const fallback = catalogProducts.find((product) => product.id === id || product.slug === id);
  try {
    const product = await prisma.product.findFirst({ where: { isActive: true, OR: [{ id }, { slug: id }] } });
    if (!product) return fallback;
    const matchingFallback = fallback ?? catalogProducts[0];
    return {
      ...matchingFallback,
      id: product.id,
      productCode: product.productCode,
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category,
      buyPrice: Number(product.buyPrice),
      sellPrice: Number(product.sellPrice),
      originalPrice: Number(product.originalPrice),
      stock: product.stock,
      specs: Object.fromEntries(Object.entries((product.specs as Record<string, unknown> | null) ?? {}).map(([key, value]) => [key, String(value)])),
    };
  } catch (error) {
    console.error("Product database read failed; using seeded fallback:", error);
    return fallback;
  }
}
