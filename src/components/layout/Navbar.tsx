"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  Heart,
  User,
  ArrowUpRight,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCartStore } from "@/store/use-cart-store";
import { useAuthStore } from "@/store/use-auth-store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/collections", label: "Shop" },
  { href: "/collections?sort=newest", label: "New Arrivals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const emptySubscribe = () => () => {};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);
  const user = useAuthStore((s) => s.user);
  const fetchSession = useAuthStore((s) => s.fetchSession);

  const isStaff = Boolean(user?.role && user.role !== "CUSTOMER");

  React.useEffect(() => {
    void fetchSession();
  }, [fetchSession]);

  React.useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const totalCount = mounted
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      searchQuery.trim()
        ? `/collections?search=${encodeURIComponent(searchQuery.trim())}`
        : "/collections"
    );
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#013E37] text-white border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 sm:h-24 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Menu Button + Larger Navigation Links */}
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-9 flex-1">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden p-2 -ml-2 text-[#FFEEB3] hover:text-white transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 sm:w-7 sm:h-7" />
            ) : (
              <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
            )}
          </button>

          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-8 xl:gap-10"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-1.5 text-base xl:text-[17px] font-semibold tracking-wide transition-colors group",
                    isActive
                      ? "text-[#FFEEB3]"
                      : "text-white/90 hover:text-[#FFEEB3]"
                  )}
                >
                  <span>{link.label}</span>
                  <span
                    className={cn(
                      "absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[#FFEEB3] transition-transform duration-300 origin-left",
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center: Prominent Official DÁMS Brand Logo from /images/brand/transparent.png */}
        <Link
          href="/"
          className="shrink-0 flex items-center justify-center group"
          aria-label="DÁMS Footwear Home"
        >
          <Image
            src="/images/brand/transparent.png"
            alt="DÁMS Footwear Official Logo"
            width={180}
            height={180}
            priority
            className="w-28 sm:w-36 lg:w-40 h-auto object-contain -my-6 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Right: Larger Search Pill + Action Icons Pill */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 flex-1">
          {searchOpen ? (
            <form
              onSubmit={handleSearchSubmit}
              className="hidden sm:flex items-center bg-white/10 border border-[#FFEEB3]/40 rounded-full px-4 py-2.5"
            >
              <Search className="w-4 h-4 text-[#FFEEB3] mr-2.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search footwear..."
                autoFocus
                className="bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none w-36 lg:w-44"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-white/70 hover:text-white ml-1.5 cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-medium text-white/95 hover:text-[#FFEEB3] transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#FFEEB3]" />
              <span>Search</span>
            </button>
          )}

          {/* Icon Group Pill */}
          <div className="inline-flex items-center gap-3 sm:gap-5 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 border border-white/15">
            <Link
              href="/collections"
              className="text-white/90 hover:text-[#FFEEB3] transition-colors"
              aria-label="Saved pairs"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex items-center gap-1.5 sm:gap-2 text-white/95 hover:text-[#FFEEB3] transition-colors cursor-pointer"
              aria-label={`Open shopping bag with ${totalCount} items`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFEEB3]" />
              {totalCount > 0 && (
                <span className="min-w-4.5 h-4.5 sm:min-w-5 sm:h-5 px-1 sm:px-1.5 rounded-full bg-[#FFEEB3] text-[#013E37] text-[11px] sm:text-xs font-bold flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>

            <Link
              href={mounted && user ? "/account" : "/login"}
              className={cn(
                "relative transition-colors",
                mounted && user
                  ? "text-[#FFEEB3] hover:text-white"
                  : "text-white/90 hover:text-[#FFEEB3]"
              )}
              aria-label={mounted && user ? "My Profile" : "Sign In"}
              title={mounted && user ? "My Profile" : "Sign In"}
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              {mounted && user && (
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FFEEB3] ring-2 ring-[#013E37]"
                />
              )}
            </Link>
          </div>

          {isStaff && (
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FFEEB3] text-[#013E37] text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors"
            >
              Admin
            </Link>
          )}
        </div>
      </div>

      {/* Smooth Slide-In Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-[#171C1A]/65 backdrop-blur-xs lg:hidden"
              aria-hidden="true"
            />

            {/* Left Slide-In Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
                mass: 0.9,
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
              className="fixed top-0 left-0 bottom-0 z-50 w-[85vw] max-w-sm bg-[#013E37] text-white border-r border-[#FFEEB3]/15 shadow-2xl flex flex-col justify-between lg:hidden"
            >
              {/* Drawer Top Header */}
              <div>
                <div className="px-6 h-24 flex items-center justify-between border-b border-white/10">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center shrink-0"
                  >
                    <Image
                      src="/images/brand/transparent.png"
                      alt="DÁMS Footwear Official Logo"
                      width={150}
                      height={150}
                      className="w-28 h-auto object-contain -my-4"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full bg-white/10 text-[#FFEEB3] hover:bg-white/20 transition-colors cursor-pointer"
                    aria-label="Close navigation drawer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Search Box */}
                <div className="px-6 pt-6">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center bg-white/10 border border-[#FFEEB3]/25 rounded-full px-4 py-2.5"
                  >
                    <Search className="w-4 h-4 text-[#FFEEB3] mr-2.5 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search DÁMS footwear..."
                      className="bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none w-full"
                    />
                  </form>
                </div>

                {/* Drawer Links */}
                <nav className="px-6 py-6 flex flex-col gap-1">
                  {NAV_LINKS.map((link, idx) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx + 0.1, duration: 0.3 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center justify-between py-3.5 text-lg font-semibold tracking-wide border-b border-white/10 transition-colors",
                            isActive
                              ? "text-[#FFEEB3]"
                              : "text-white/95 hover:text-[#FFEEB3]"
                          )}
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight className="w-5 h-5 text-[#FFEEB3]/80" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 bg-[#012d28] border-t border-white/10 space-y-3">
                {isStaff && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-11 rounded-full border border-[#FFEEB3]/50 text-[#FFEEB3] font-bold text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 hover:bg-[#FFEEB3]/10 transition-colors"
                  >
                    <span>Admin Dashboard</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                )}

                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-12 rounded-full bg-[#FFEEB3] text-[#013E37] font-bold text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>View Shopping Bag ({totalCount})</span>
                </Link>

                <p className="text-center text-[11px] uppercase tracking-[0.16em] text-[#FFEEB3]/80">
                  Crafted in Abuja, Nigeria • 100% Original
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
