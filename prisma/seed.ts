import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    productCode: "GAD-001",
    name: "Pocket Turbo Mini Fan",
    slug: "pocket-turbo-mini-fan",
    description: "A quiet, rechargeable mini fan for your desk, bag, or commute.",
    category: "Mini Fan",
    buyPrice: 420,
    sellPrice: 699,
    originalPrice: 799,
    stock: 24,
    images: ["https://images.unsplash.com/photo-1583225275995-0f09b8f0b7a7?auto=format&fit=crop&w=1200&q=85"],
    specs: { battery: "2000mAh", power: "5W", warranty: "6 months", weight: "180g" },
  },
  {
    productCode: "GAD-002",
    name: "65W GaN Fast Charger",
    slug: "65w-gan-fast-charger",
    description: "Compact GaN charger with fast USB-C power delivery for modern devices.",
    category: "Charger",
    buyPrice: 1250,
    sellPrice: 1790,
    originalPrice: 1990,
    stock: 18,
    images: ["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=85"],
    specs: { ports: "2x USB-C, 1x USB-A", power: "65W", warranty: "1 year", weight: "105g" },
  },
  {
    productCode: "GAD-003",
    name: "Braided USB-C Cable",
    slug: "braided-usb-c-cable",
    description: "Durable 1.8m braided cable with high-speed charging support.",
    category: "Cable",
    buyPrice: 180,
    sellPrice: 349,
    originalPrice: 399,
    stock: 62,
    images: ["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=85"],
    specs: { length: "1.8m", connector: "USB-C to USB-C", power: "100W", warranty: "6 months" },
  },
  {
    productCode: "GAD-004",
    name: "AirBeat Wireless Earbuds",
    slug: "airbeat-wireless-earbuds",
    description: "Pocket-sized earbuds with low-latency audio and a clear microphone.",
    category: "Audio",
    buyPrice: 920,
    sellPrice: 1490,
    originalPrice: 1690,
    stock: 11,
    images: ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1200&q=85"],
    specs: { battery: "30 hours", connectivity: "Bluetooth 5.3", warranty: "1 year", weight: "42g" },
  },
];

const heroSlides = [
  { title: "চরম গরমে তাৎক্ষণিক শীতল বাতাস", subtitle: "গরমের সেরা সঙ্গী - GAD-001", badgeText: "পকেট টার্বো ফ্যান", discountTag: "১৩% ছাড়", priceText: "৳৬৯৯", ctaText: "কালেকশন দেখুন", ctaLink: "/product/pocket-turbo-mini-fan", imageUrl: products[0].images[0], order: 0 },
  { title: "এক চার্জারেই ল্যাপটপ ও ফোন", subtitle: "এক চার্জার · সব ডিভাইস · GAD-002", badgeText: "৬৫W GaN ফাস্ট চার্জার", discountTag: "১০% ছাড়", priceText: "৳১,৭৯০", ctaText: "এখনই কিনুন", ctaLink: "/product/65w-gan-fast-charger", imageUrl: products[1].images[0], order: 1 },
  { title: "ডিপ ব্যাস ও নয়েজ ক্যান্সেলেশন", subtitle: "সাউন্ড, যা আপনার · GAD-004", badgeText: "AirBeat Wireless Earbuds", discountTag: "১২% ছাড়", priceText: "৳১,৪৯০", ctaText: "কালেকশন দেখুন", ctaLink: "/product/airbeat-wireless-earbuds", imageUrl: products[3].images[0], order: 2 },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword || adminPassword.length < 12) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD (minimum 12 characters) are required to seed an admin account.");
  }
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: UserRole.ADMIN, passwordHash },
    create: {
      email: adminEmail,
      name: "Aloron Admin",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { productCode: product.productCode },
      update: product,
      create: product,
    });
  }

  if ((await prisma.heroSlide.count()) === 0) {
    await prisma.heroSlide.createMany({ data: heroSlides.map((slide) => ({ ...slide, isActive: true })) });
  }
  await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: {},
    create: { id: "global" },
  });

  console.log(`Seeded admin ${adminEmail}, ${products.length} products, and ${heroSlides.length} hero slides.`);
}

main()
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
