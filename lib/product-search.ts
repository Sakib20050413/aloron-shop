import type { CatalogProduct } from "@/lib/catalog";

export function normalizeSearch(value: string) {
  return value.toLocaleLowerCase("bn-BD").normalize("NFKC").replace(/[\s-]+/g, "");
}

export function searchProducts(products: CatalogProduct[], query: string) {
  const normalized = normalizeSearch(query.trim());
  if (!normalized) return products;
  return products.filter((product) => {
    const translatedCategory = product.category === "Mini Fan" ? "মিনি ফ্যান" : product.category === "Charger" ? "চার্জার" : product.category === "Cable" ? "কেবল" : product.category === "Audio" ? "অডিও" : "";
    const translatedName = product.slug === "pocket-turbo-mini-fan" ? "পকেট টার্বো মিনি ফ্যান" : "";
    const searchable = [
      product.name,
      translatedName,
      product.category,
      translatedCategory,
      product.productCode,
      product.slug,
      product.description,
      ...Object.entries(product.specs).flat(),
    ].map(normalizeSearch);
    return searchable.some((field) => field.includes(normalized) || normalized.includes(field));
  });
}
