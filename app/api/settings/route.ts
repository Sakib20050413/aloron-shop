import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/settings";

export async function GET() {
  return NextResponse.json(await getSiteSettings(), {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" },
  });
}
