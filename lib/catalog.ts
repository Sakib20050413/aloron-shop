export type CatalogProduct = {
  id: string;
  productCode: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  buyPrice: number;
  sellPrice: number;
  originalPrice: number;
  stock: number;
  icon: string;
  accent: string;
  images: string[];
  specs: Record<string, string>;
};

export const catalogProducts: CatalogProduct[] = [
  {
    id: "pocket-turbo-mini-fan",
    productCode: "GAD-001",
    name: "Pocket Turbo Mini Fan",
    slug: "pocket-turbo-mini-fan",
    description: "A quiet, rechargeable mini fan for your desk, bag, or commute.",
    category: "Mini Fan",
    buyPrice: 420,
    sellPrice: 699,
    originalPrice: 799,
    stock: 24,
    icon: "🌀",
    accent: "from-cyan-100 to-blue-100",
    images: ["🌀", "❄️", "🔋"],
    specs: { Battery: "2000mAh", Power: "5W", Warranty: "6 months", Weight: "180g" },
  },
  {
    id: "65w-gan-fast-charger",
    productCode: "GAD-002",
    name: "65W GaN Fast Charger",
    slug: "65w-gan-fast-charger",
    description: "Compact GaN charger with fast USB-C power delivery for modern devices.",
    category: "Charger",
    buyPrice: 1250,
    sellPrice: 1790,
    originalPrice: 1990,
    stock: 18,
    icon: "⚡",
    accent: "from-amber-100 to-orange-100",
    images: ["⚡", "🔌", "🚀"],
    specs: { Ports: "2x USB-C, 1x USB-A", Power: "65W", Warranty: "1 year", Weight: "105g" },
  },
  {
    id: "braided-usb-c-cable",
    productCode: "GAD-003",
    name: "Braided USB-C Cable",
    slug: "braided-usb-c-cable",
    description: "Durable 1.8m braided cable with high-speed charging support.",
    category: "Cable",
    buyPrice: 180,
    sellPrice: 349,
    originalPrice: 399,
    stock: 62,
    icon: "🔌",
    accent: "from-violet-100 to-fuchsia-100",
    images: ["🔌", "🧵", "⚙️"],
    specs: { Length: "1.8m", Connector: "USB-C to USB-C", Power: "100W", Warranty: "6 months" },
  },
  {
    id: "airbeat-wireless-earbuds",
    productCode: "GAD-004",
    name: "AirBeat Wireless Earbuds",
    slug: "airbeat-wireless-earbuds",
    description: "Pocket-sized earbuds with low-latency audio and a clear microphone.",
    category: "Audio",
    buyPrice: 920,
    sellPrice: 1490,
    originalPrice: 1690,
    stock: 11,
    icon: "🎧",
    accent: "from-teal-100 to-emerald-100",
    images: ["🎧", "🎶", "🎙️"],
    specs: { Battery: "30 hours", Connectivity: "Bluetooth 5.3", Warranty: "1 year", Weight: "42g" },
  },
];

export function getCatalogProduct(id: string) {
  return catalogProducts.find((product) => product.id === id || product.slug === id);
}
