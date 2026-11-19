import type { Metadata } from "next";
import { Suspense } from "react";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { StorefrontShell } from "@/components/layout/StorefrontShell";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "DÁMS Footwear | Made Locally. Worn Everywhere.",
    template: "%s | DÁMS Footwear Nigeria",
  },
  icons: {
    icon: [
      { url: "/images/brand/colored-logo.svg", type: "image/svg+xml" },
      { url: "/images/brand/colored-logo.png", type: "image/png" },
    ],
    shortcut: "/images/brand/colored-logo.png",
    apple: "/images/brand/colored-logo.png",
  },
  description:
    "Contemporary Nigerian footwear label built around locally manufactured leather shoes, thoughtful architectural design, and dependable family craftsmanship.",
  keywords: [
    "DÁMS Footwear",
    "Nigerian leather shoes",
    "Made in Nigeria shoes",
    "Abuja bespoke footwear",
    "handcrafted loafers Nigeria",
    "Abuja footwear brand",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "DÁMS Footwear",
    title: "DÁMS Footwear | Made Locally. Worn Everywhere.",
    description:
      "Locally manufactured Nigerian leather footwear crafted for durability, poise, and everyday distinction.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#171C1A] selection:bg-[#013E37] selection:text-[#FFEEB3]">
        <AppProviders>
          <Suspense
            fallback={<main className="flex-1 flex flex-col">{children}</main>}
          >
            <StorefrontShell>{children}</StorefrontShell>
          </Suspense>
        </AppProviders>
      </body>
    </html>
  );
}
