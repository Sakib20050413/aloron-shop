import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Store settings
  await prisma.storeSetting.upsert({
    where: { id: "global" },
    update: {},
    create: {
      id: "global",
      announcementText: "ঢাকা থেকে সারাদেশে দ্রুততম হোম ডেলিভারি | হটলাইন: ০১৬১৫৮৬৯৭২৪",
      supportPhone: "01615869724",
      supportWhatsApp: "8801615869724",
      deliveryInsideDhaka: 70,
      deliveryOutsideDhaka: 150,
      advanceBkashAmount: 200,
      bkashNumber: "01615869724",
      bkashAccountType: "Personal",
    },
  });

  // Products
  const products = [
    {
      code: "GAD-WATCH-01",
      slug: "qcy-gt2-amoled-smart-watch",
      name: "QCY GT2 AMOLED Smart Watch",
      nameEn: "QCY GT2 AMOLED Smart Watch",
      category: "SMART GADGET",
      price: 2990,
      originalPrice: 3700,
      wholesaleCost: 2400,
      stock: 10,
      description: "বাজেটের মধ্যে প্রিমিয়াম জিংক অ্যালয় মেটাল ফ্রেম ও চোখ জুড়ানো ১.৪৩\" অ্যামোলেড ডিসপ্লে সমৃদ্ধ ফ্ল্যাগশিপ স্মার্টওয়াচ।",
      specs: {
        Display: "1.43 inch HD AMOLED 466x466",
        Body: "Zinc Alloy Metallic Frame",
        Battery: "Up to 6 days daily use",
        Waterproof: "5ATM Waterproof",
        Calling: "Bluetooth Calling & AI Assistant",
      },
      whatsInTheBox: [
        "১x QCY GT2 স্মার্টওয়াচ",
        "১x প্রিমিয়াম সিলিকন স্ট্র্যাপ",
        "১x ম্যাগনেটিক চার্জার ক্যাবল",
        "১x ইউজার গাইড ও ওয়ারেন্টি কার্ড",
      ],
      images: [
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&q=85",
      ],
      isFeatured: true,
      isTrending: true,
    },
    {
      code: "GAD-CHG-01",
      slug: "65w-gan-fast-charger",
      name: "65W GaN Fast Charger",
      nameEn: "65W GaN Fast Charger",
      category: "CHARGER",
      price: 1790,
      originalPrice: 1990,
      wholesaleCost: 1300,
      stock: 15,
      description: "এক চার্জারেই ল্যাপটপ ও ফোন ফাস্ট চার্জ করার জন্য সেরা GaN প্রযুক্তি।",
      specs: {
        Output: "65W Max GaN",
        Ports: "2x USB-C, 1x USB-A",
        Protection: "Over-voltage & Over-heat protection",
      },
      whatsInTheBox: ["১x 65W GaN চার্জার", "১x ইউজার ম্যানুয়াল"],
      images: [
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=85",
      ],
      isFeatured: true,
      isTrending: false,
    },
    {
      code: "GAD-AUD-01",
      slug: "airbeat-wireless-earbuds",
      name: "AirBeat Wireless Earbuds",
      nameEn: "AirBeat Wireless Earbuds",
      category: "AUDIO",
      price: 1490,
      originalPrice: 1690,
      wholesaleCost: 950,
      stock: 20,
      description: "ডিপ ব্যাস, ট্রু ওয়্যারলেস স্টেরিও এবং সারাদিনের শক্তিশালী ব্যাটারি ব্যাকআপ।",
      specs: {
        Driver: "13mm Dynamic Bass",
        Battery: "Up to 28 hours with charging case",
        Bluetooth: "v5.3 Low Latency",
      },
      whatsInTheBox: [
        "১x AirBeat ইয়ারবাডস",
        "১x চার্জিং কেস",
        "১x টাইপ-সি ক্যাবল",
        "২ জোড়া অতিরিক্ত ইয়ারটিপস",
      ],
      images: [
        "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1200&q=85",
      ],
      isFeatured: true,
      isTrending: true,
    },
    {
      code: "GAD-CAB-01",
      slug: "braided-usb-c-cable",
      name: "Braided Fast Type-C Cable",
      nameEn: "Braided Fast Type-C Cable",
      category: "CABLE",
      price: 349,
      originalPrice: 399,
      wholesaleCost: 180,
      stock: 50,
      description: "টেকসই নাইলন ব্রেইডেড প্রিমিয়াম ফাস্ট চার্জিং ও ডেটা ট্রান্সফার ক্যাবল।",
      specs: {
        Length: "1.2 Meter",
        Power: "60W Fast Charging",
        Material: "High-density braided nylon",
      },
      whatsInTheBox: ["১x ব্রেইডেড টাইপ-সি ক্যাবল"],
      images: [
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=85",
      ],
      isFeatured: true,
      isTrending: false,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { code: product.code },
      update: product,
      create: product,
    });
  }

  // Hero Slide
  const heroSlide = {
    title: "QCY GT2 ফ্ল্যাগশিপ স্মার্টওয়াচ",
    subtitle: "১.৪৩\" প্রিমিয়াম AMOLED ডিসপ্লে ও মেটাল বডি",
    badgeText: "২০২৬ স্মার্ট ড্রপ",
    discountTag: "২০% ছাড়",
    priceText: "৳২,৯৯০",
    ctaLink: "/product/qcy-gt2-amoled-smart-watch",
    ctaText: "এখনই কিনুন",
    imageUrl:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&q=85",
    order: 0,
    isActive: true,
  };

  const existingSlide = await prisma.heroSlide.findFirst({
    where: { title: heroSlide.title },
  });

  if (!existingSlide) {
    await prisma.heroSlide.create({ data: heroSlide });
  }

  console.log("Database seeded successfully with clean authentic products!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
