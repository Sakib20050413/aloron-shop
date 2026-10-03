export type CatalogProduct = {
  id: string;
  code: string;
  productCode: string; // compatibility alias
  name: string;
  nameEn?: string | null;
  slug: string;
  description: string;
  category: string;
  price: number;
  sellPrice: number; // compatibility alias
  originalPrice: number;
  wholesaleCost?: number | null;
  buyPrice: number; // compatibility alias
  stock: number;
  icon?: string;
  accent?: string;
  images: string[];
  videoUrl?: string | null;
  specs?: Record<string, string> | null;
  whatsInTheBox?: string[];
  boxContents?: string[]; // compatibility alias
  faqs?: [string, string][];
  isTrending?: boolean;
  isFeatured?: boolean;
};

export const catalogProducts: CatalogProduct[] = [
  {
    id: "qcy-gt2-amoled-smart-watch",
    code: "GAD-WATCH-01",
    productCode: "GAD-WATCH-01",
    name: "QCY GT2 AMOLED Smart Watch",
    nameEn: "QCY GT2 AMOLED Smart Watch",
    slug: "qcy-gt2-amoled-smart-watch",
    description: "বাজেটের মধ্যে প্রিমিয়াম জিংক অ্যালয় মেটাল ফ্রেম ও চোখ জুড়ানো ১.৪৩\" অ্যামোলেড ডিসপ্লে সমৃদ্ধ ফ্ল্যাগশিপ স্মার্টওয়াচ।",
    category: "SMART GADGET",
    price: 2990,
    sellPrice: 2990,
    originalPrice: 3700,
    wholesaleCost: 2400,
    buyPrice: 2400,
    stock: 10,
    icon: "⌚",
    accent: "from-cyan-100 to-blue-100",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&q=85",
    ],
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
    boxContents: [
      "১x QCY GT2 স্মার্টওয়াচ",
      "১x প্রিমিয়াম সিলিকন স্ট্র্যাপ",
      "১x ম্যাগনেটিক চার্জার ক্যাবল",
      "১x ইউজার গাইড ও ওয়ারেন্টি কার্ড",
    ],
    isFeatured: true,
    isTrending: true,
  },
  {
    id: "65w-gan-fast-charger",
    code: "GAD-CHG-01",
    productCode: "GAD-CHG-01",
    name: "65W GaN Fast Charger",
    nameEn: "65W GaN Fast Charger",
    slug: "65w-gan-fast-charger",
    description: "এক চার্জারেই ল্যাপটপ ও ফোন ফাস্ট চার্জ করার জন্য সেরা GaN প্রযুক্তি।",
    category: "CHARGER",
    price: 1790,
    sellPrice: 1790,
    originalPrice: 1990,
    wholesaleCost: 1300,
    buyPrice: 1300,
    stock: 15,
    icon: "⚡",
    accent: "from-amber-100 to-orange-100",
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=85",
    ],
    specs: {
      Output: "65W Max GaN",
      Ports: "2x USB-C, 1x USB-A",
      Protection: "Over-voltage & Over-heat protection",
    },
    whatsInTheBox: ["১x 65W GaN চার্জার", "১x ইউজার ম্যানুয়াল"],
    boxContents: ["১x 65W GaN চার্জার", "১x ইউজার ম্যানুয়াল"],
    isFeatured: true,
    isTrending: false,
  },
  {
    id: "airbeat-wireless-earbuds",
    code: "GAD-AUD-01",
    productCode: "GAD-AUD-01",
    name: "AirBeat Wireless Earbuds",
    nameEn: "AirBeat Wireless Earbuds",
    slug: "airbeat-wireless-earbuds",
    description: "ডিপ ব্যাস, ট্রু ওয়্যারলেস স্টেরিও এবং সারাদিনের শক্তিশালী ব্যাটারি ব্যাকআপ।",
    category: "AUDIO",
    price: 1490,
    sellPrice: 1490,
    originalPrice: 1690,
    wholesaleCost: 950,
    buyPrice: 950,
    stock: 20,
    icon: "🎧",
    accent: "from-teal-100 to-emerald-100",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1200&q=85",
    ],
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
    boxContents: [
      "১x AirBeat ইয়ারবাডস",
      "১x চার্জিং কেস",
      "১x টাইপ-সি ক্যাবল",
      "২ জোড়া অতিরিক্ত ইয়ারটিপস",
    ],
    isFeatured: true,
    isTrending: true,
  },
  {
    id: "braided-usb-c-cable",
    code: "GAD-CAB-01",
    productCode: "GAD-CAB-01",
    name: "Braided Fast Type-C Cable",
    nameEn: "Braided Fast Type-C Cable",
    slug: "braided-usb-c-cable",
    description: "টেকসই নাইলন ব্রেইডেড প্রিমিয়াম ফাস্ট চার্জিং ও ডেটা ট্রান্সফার ক্যাবল।",
    category: "CABLE",
    price: 349,
    sellPrice: 349,
    originalPrice: 399,
    wholesaleCost: 180,
    buyPrice: 180,
    stock: 50,
    icon: "🔌",
    accent: "from-violet-100 to-fuchsia-100",
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=85",
    ],
    specs: {
      Length: "1.2 Meter",
      Power: "60W Fast Charging",
      Material: "High-density braided nylon",
    },
    whatsInTheBox: ["১x ব্রেইডেড টাইপ-সি ক্যাবল"],
    boxContents: ["১x ব্রেইডেড টাইপ-সি ক্যাবল"],
    isFeatured: true,
    isTrending: false,
  },
];

export function getCatalogProduct(id: string) {
  return catalogProducts.find((product) => product.id === id || product.slug === id || product.code === id || product.productCode === id);
}
