"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AnnouncementStrip } from "@/components/layout/AnnouncementStrip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";

const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome =
    pathname?.startsWith("/admin") ||
    AUTH_ROUTES.some((route) => pathname?.startsWith(route));

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <AnnouncementStrip />
      <Navbar />
      <CartDrawer />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
