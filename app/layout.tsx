import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PageTransition } from "@/components/PageTransition";
import { ToastProvider } from "@/components/ui/Toast";
import { CartProvider } from "@/components/CartProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "আলোড়ন অনলাইন শপিং | প্রিমিয়াম গ্যাজেটস ও ইলেকট্রনিক্স",
  description: "কুমিল্লাসহ সারাদেশে দ্রুততম হোম ডেলিভারি এবং মাত্র ২০০ টাকা বিকাশ অগ্রিমে ১০০% টেস্টেড মিনি গ্যাজেট ও ইলেকট্রনিক্স এক্সেসরিজ।",
  openGraph: {
    title: "আলোড়ন অনলাইন শপিং | প্রিমিয়াম গ্যাজেটস ও ইলেকট্রনিক্স",
    description: "কুমিল্লাসহ সারাদেশে দ্রুততম হোম ডেলিভারি এবং মাত্র ২০০ টাকা বিকাশ অগ্রিমে ১০০% টেস্টেড মিনি গ্যাজেট ও ইলেকট্রনিক্স এক্সেসরিজ।",
    type: "website",
    locale: "bn_BD",
    siteName: "আলোড়ন অনলাইন শপিং",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("aloron-theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}` }} />
      </head>
      <body className="min-h-full flex flex-col transition-colors duration-200">
        <ThemeProvider><ToastProvider><CartProvider><AuthProvider><PageTransition>{children}</PageTransition></AuthProvider></CartProvider></ToastProvider></ThemeProvider>
      </body>
    </html>
  );
}
