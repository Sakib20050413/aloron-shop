import { prisma } from "@/lib/prisma";

export const defaultSiteSettings = {
  announcementText: "ঢাকা থেকে সারাদেশে দ্রুততম হোম ডেলিভারি | হটলাইন: ০১৬১৫৮৬৯৭২৪",
  noticeText: "ঢাকা থেকে সারাদেশে দ্রুততম হোম ডেলিভারি | হটলাইন: ০১৬১৫৮৬৯৭২৪",
  heroTitle: "প্রয়োজনীয় সব স্মার্ট গ্যাজেট ও ইলেকট্রনিক্স",
  heroSubtitle: "১০০% টেস্টেড গ্যাজেট, মাত্র ২০০ টাকা বিকাশ অগ্রিমে বুকিং।",
  bkashNumber: "01615869724",
  advanceFee: 200,
  advanceBkashAmount: 200,
  contactNumber: "01615869724",
  supportPhone: "01615869724",
  whatsappNumber: "01615869724",
  supportWhatsApp: "8801615869724",
  address: "ঢাকা, বাংলাদেশ",
  insideDhakaFee: 70,
  deliveryInsideDhaka: 70,
  outsideDhakaFee: 150,
  deliveryOutsideDhaka: 150,
  bkashAccountType: "Personal",
};

export async function getSiteSettings() {
  try {
    const settings = await prisma.storeSetting.findUnique({ where: { id: "global" } });
    if (!settings) return defaultSiteSettings;
    return {
      ...defaultSiteSettings,
      announcementText: settings.announcementText,
      noticeText: settings.announcementText,
      supportPhone: settings.supportPhone,
      contactNumber: settings.supportPhone,
      supportWhatsApp: settings.supportWhatsApp,
      whatsappNumber: settings.supportWhatsApp,
      deliveryInsideDhaka: Number(settings.deliveryInsideDhaka),
      insideDhakaFee: Number(settings.deliveryInsideDhaka),
      deliveryOutsideDhaka: Number(settings.deliveryOutsideDhaka),
      outsideDhakaFee: Number(settings.deliveryOutsideDhaka),
      advanceBkashAmount: Number(settings.advanceBkashAmount),
      advanceFee: Number(settings.advanceBkashAmount),
      bkashNumber: settings.bkashNumber,
      bkashAccountType: settings.bkashAccountType,
    };
  } catch (error) {
    console.error("Store settings read failed; using defaults:", error);
    return defaultSiteSettings;
  }
}
