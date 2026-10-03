import { NextResponse } from "next/server";
import { getStoreProduct, getStoreProducts } from "@/lib/catalog-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lookup = searchParams.get("lookup");
  if (lookup) {
    const product = await getStoreProduct(lookup);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(product, {
      headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" },
    });
  }
  const products = await getStoreProducts();
  return NextResponse.json(products, {
    headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" },
  });
}
