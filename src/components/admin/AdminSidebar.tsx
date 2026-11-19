"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  Footprints,
  Layers,
  MessageSquare,
  Mail,
  Truck,
  Users,
  ExternalLink,
  LogOut,
  X,
} from "lucide-react";
import type { PatronUser, UserRole } from "@/types/auth";
import { useAuthStore } from "@/store/use-auth-store";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Exclude<UserRole, "CUSTOMER">[];
}

const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    label: "Overview & Analytics",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN"],
  },
  {
    label: "Orders & Dispatch",
    href: "/admin/orders",
    icon: ShoppingBag,
    roles: ["SUPER_ADMIN", "WORKSHOP_MANAGER", "CONCIERGE"],
  },
  {
    label: "Bespoke Commissions",
    href: "/admin/custom-orders",
    icon: Sparkles,
    roles: ["SUPER_ADMIN", "WORKSHOP_MANAGER", "CONCIERGE"],
  },
  {
    label: "Footwear & Stock",
    href: "/admin/products",
    icon: Footprints,
    roles: ["SUPER_ADMIN", "WORKSHOP_MANAGER"],
  },
  {
    label: "Collections",
    href: "/admin/collections",
    icon: Layers,
    roles: ["SUPER_ADMIN", "WORKSHOP_MANAGER"],
  },
  {
    label: "Concierge Enquiries",
    href: "/admin/enquiries",
    icon: MessageSquare,
    roles: ["SUPER_ADMIN", "CONCIERGE"],
  },
  {
    label: "Newsletter Ledger",
    href: "/admin/newsletter",
    icon: Mail,
    roles: ["SUPER_ADMIN"],
  },
  {
    label: "Shipping Settings",
    href: "/admin/settings/shipping",
    icon: Truck,
    roles: ["SUPER_ADMIN"],
  },
  {
    label: "Users & Patrons",
    href: "/admin/users",
    icon: Users,
    roles: ["SUPER_ADMIN"],
  },
  {
    label: "Staff Management",
    href: "/admin/staff",
    icon: Users,
    roles: ["SUPER_ADMIN"],
  },
];

export function AdminSidebar({
  user,
  mobileOpen,
  onCloseMobile,
}: {
  user: PatronUser;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const staffRole = (user.role || "CONCIERGE") as Exclude<UserRole, "CUSTOMER">;
  const visibleItems = ADMIN_NAV_ITEMS.filter((item) =>
    item.roles.includes(staffRole)
  );

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#013E37] text-white w-64 border-r border-white/10">
      {/* Top Brand + Nav */}
      <div>
        <div className="h-20 px-5 flex items-center justify-between border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/images/brand/transparent.png"
              alt="DÁMS Atelier"
              width={110}
              height={48}
              className="w-24 h-auto object-contain -my-3"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFEEB3] border-l border-white/20 pl-2.5">
              Admin
            </span>
          </Link>

          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-[#FFEEB3] hover:text-white cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Staff Badge */}
        <div className="px-5 py-4 border-b border-white/10 bg-[#01322C]">
          <p className="text-xs font-semibold text-white truncate">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FFEEB3] mt-0.5">
            {staffRole.replace(/_/g, " ")}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors",
                  isActive
                    ? "bg-[#FFEEB3] text-[#013E37]"
                    : "text-white/80 hover:bg-white/10 hover:text-[#FFEEB3]"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: View Storefront + Logout */}
      <div className="p-4 border-t border-white/10 space-y-2 bg-[#012d28]">
        <Link
          href="/"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold text-[#FFEEB3] hover:bg-white/10 transition-colors"
        >
          <span>View Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-white/75 hover:text-red-300 hover:bg-white/5 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed-Height Sidebar */}
      <aside className="hidden lg:block shrink-0 h-full overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-In Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-[#171C1A]/60 backdrop-blur-xs"
            aria-hidden="true"
          />
          <aside className="relative z-10 h-full">{sidebarContent}</aside>
        </div>
      )}
    </>
  );
}
