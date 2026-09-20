import type { CatalogProduct } from "@/lib/catalog";

export function normalizeSearch(value: string) {
  return value.toLocaleLowerCase("bn-BD").normalize("NFKC").replace(/[\s-]+/g, "");
}

export function searchProducts(products: CatalogProduct[], query: string) {
  const normalized = normalizeSearch(query.trim());
  if (!normalized) return products;
  return products.filter((product) => {
    const searchable = [
      product.name,
      product.category,
      product.productCode,
      product.slug,
      product.description,
      ...Object.entries(product.specs).flat(),
    ].map(normalizeSearch);
    return searchable.some((field) => field.includes(normalized) || normalized.includes(field));
  });
}
