import { NextResponse } from "next/server";
import { getStoreProducts } from "@/lib/catalog-server";

export async function GET() {
  const products = await getStoreProducts();
  return NextResponse.json(products, {
    headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" },
  });
}
