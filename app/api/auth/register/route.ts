import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  phone: z.string().regex(/^[0-9+\-\s]{6,20}$/).optional(),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`register:${ip}`, 5, 15 * 60_000)) {
    return NextResponse.json({ error: "অনেক বেশি চেষ্টা হয়েছে। ১৫ মিনিট পর আবার চেষ্টা করুন।" }, { status: 429 });
  }
  let payload: unknown;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "অবৈধ ইনপুট" }, { status: 400 });

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "এই ইমেইলে আগেই অ্যাকাউন্ট আছে।" }, { status: 409 });

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name.trim(),
      email,
      passwordHash,
      phone: parsed.data.phone?.trim() || null,
      role: "CUSTOMER",
    },
    select: { id: true, name: true, email: true },
  });
  return NextResponse.json({ ok: true, user }, { status: 201 });
}