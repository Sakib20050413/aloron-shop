import { prisma } from "@/lib/prisma";

export const defaultSiteSettings = {
  noticeText: "ঢাকা থেকে সারাদেশে দ্রুততম হোম ডেলিভারি",
  heroTitle: "প্রয়োজনীয় সব স্মার্ট গ্যাজেট ও ইলেকট্রনিক্স",
  heroSubtitle: "১০০% টেস্টেড গ্যাজেট, মাত্র ২০০ টাকা বিকাশ অগ্রিমে বুকিং।",
  bkashNumber: "01615869724",
  advanceFee: 200,
  contactNumber: "01615869724",
  whatsappNumber: "01615869724",
  address: "ঢাকা, বাংলাদেশ",
  insideDhakaFee: 70,
  outsideDhakaFee: 150,
};

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "global" } });
    if (!settings) return defaultSiteSettings;
    return { ...defaultSiteSettings, ...settings, advanceFee: Number(settings.advanceFee), insideDhakaFee: Number(settings.insideDhakaFee), outsideDhakaFee: Number(settings.outsideDhakaFee) };
  } catch (error) {
    console.error("Site settings read failed; using defaults:", error);
    return defaultSiteSettings;
  }
}
