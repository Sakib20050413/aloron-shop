import { handlers } from "@/auth";
import { rateLimit } from "@/lib/rate-limit";
import type { NextRequest } from "next/server";

function requestKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function GET(request: NextRequest) {
  if (!rateLimit(`auth:${requestKey(request)}`, 60)) {
    return new Response("অনেক বেশি অনুরোধ হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।", { status: 429 });
  }
  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  let account = "unknown";
  try {
    const body = await request.clone().formData();
    account = String(body.get("email") ?? body.get("username") ?? "unknown").trim().toLowerCase();
  } catch {
    // OAuth and non-form requests are still protected by the IP key.
  }
  if (!rateLimit(`auth:${requestKey(request)}:${account}`, 5, 15 * 60_000)) {
    return new Response("অনেক বেশি লগইন চেষ্টা হয়েছে। ১৫ মিনিট পর আবার চেষ্টা করুন।", { status: 429 });
  }
  return handlers.POST(request);
}
