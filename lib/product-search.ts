import type { CatalogProduct } from "@/lib/catalog";

export function normalizeSearch(value: string) {
  return value.toLocaleLowerCase("bn-BD").normalize("NFKC").replace(/[\s-]+/g, "");
}

export function searchProducts(products: CatalogProduct[], query: string) {
  const normalized = normalizeSearch(query.trim());
  if (!normalized) return products;
  return products.filter((product) => {
    const specsValues = product.specs ? Object.entries(product.specs).flat() : [];
    const searchable = [
      product.name,
      product.nameEn ?? "",
      product.category,
      product.code ?? "",
      product.productCode ?? "",
      product.slug,
      product.description,
      ...specsValues,
    ]
      .filter(Boolean)
      .map(normalizeSearch);
    return searchable.some((field) => field.includes(normalized) || normalized.includes(field));
  });
}
