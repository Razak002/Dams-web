"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Tag,
  MapPin,
  Heart,
  Ruler,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronLeft,
  BadgeCheck,
  Loader2,
  ShieldCheck,
  Trash2,
  ArrowUpRight,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/use-auth-store";
import {
  getMyOrders,
  getWishlist,
  removeFromWishlist,
  updatePatronProfile,
} from "@/lib/api-client";
import { formatNGN, cn } from "@/lib/utils";
import type { VerifyOrderResponse } from "@/types/order";
import type { Product } from "@/types/product";
import type { PatronUser } from "@/types/auth";

type AccountSection =
  | "personal"
  | "orders"
  | "addresses"
  | "wishlist"
  | "sizing";

const EU_SIZES = [38, 39, 40, 41, 42, 43, 44, 45, 46];

interface SectionFormProps {
  user: PatronUser;
  onUpdated: (user: PatronUser) => void;
}

function PersonalInfoPanel({ user, onUpdated }: SectionFormProps) {
  const [firstName, setFirstName] = React.useState(user.firstName || "");
  const [lastName, setLastName] = React.useState(user.lastName || "");
  const [phone, setPhone] = React.useState(user.phone || "");
  const [saving, setSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await updatePatronProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
    });

    setSaving(false);
    if (res.status === "success" && res.data?.user) {
      onUpdated(res.data.user);
      toast.success("Personal information updated.");
      return;
    }
    toast.error(res.message || "Unable to update personal information.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="font-serif text-2xl text-[#171C1A]">
          Personal Information
        </h2>
        <p className="text-sm text-[#777F7B] mt-1">
          Manage your name and contact details on your DÁMS patron profile.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5550] mb-1.5">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full h-11 px-3.5 rounded-xl border border-[#EBE7DF] bg-[#F9F7F4]/60 text-sm focus:outline-none focus:border-[#013E37]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5550] mb-1.5">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full h-11 px-3.5 rounded-xl border border-[#EBE7DF] bg-[#F9F7F4]/60 text-sm focus:outline-none focus:border-[#013E37]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5550] mb-1.5">
          Email Address
        </label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full h-11 px-3.5 rounded-xl border border-[#EBE7DF] bg-[#F4F5F4] text-sm text-[#777F7B] cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5550] mb-1.5">
          Phone Number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+234 800 000 0000"
          className="w-full h-11 px-3.5 rounded-xl border border-[#EBE7DF] bg-[#F9F7F4]/60 text-sm focus:outline-none focus:border-[#013E37]"
        />
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#013E37] text-[#FFEEB3] text-xs font-bold uppercase tracking-wider hover:bg-[#025249] transition-colors cursor-pointer disabled:opacity-60"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
}

function AddressesPanel({ user, onUpdated }: SectionFormProps) {
  const [defaultAddress, setDefaultAddress] = React.useState(
    user.defaultAddress || ""
  );
  const [city, setCity] = React.useState(user.city || "");
  const [stateValue, setStateValue] = React.useState(user.state || "");
  const [saving, setSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await updatePatronProfile({
      defaultAddress: defaultAddress.trim(),
      city: city.trim(),
      state: stateValue.trim(),
    });

    setSaving(false);
    if (res.status === "success" && res.data?.user) {
      onUpdated(res.data.user);
      toast.success("Delivery address saved.");
      return;
    }
    toast.error(res.message || "Unable to save delivery address.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="font-serif text-2xl text-[#171C1A]">Addresses</h2>
        <p className="text-sm text-[#777F7B] mt-1">
          Set your default shipping address for faster DÁMS checkout.
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5550] mb-1.5">
          Street Address
        </label>
        <input
          type="text"
          value={defaultAddress}
          onChange={(e) => setDefaultAddress(e.target.value)}
          placeholder="Street address, apartment or estate"
          className="w-full h-11 px-3.5 rounded-xl border border-[#EBE7DF] bg-[#F9F7F4]/60 text-sm focus:outline-none focus:border-[#013E37]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5550] mb-1.5">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Abuja"
            className="w-full h-11 px-3.5 rounded-xl border border-[#EBE7DF] bg-[#F9F7F4]/60 text-sm focus:outline-none focus:border-[#013E37]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5550] mb-1.5">
            State
          </label>
          <input
            type="text"
            value={stateValue}
            onChange={(e) => setStateValue(e.target.value)}
            placeholder="e.g. FCT"
            className="w-full h-11 px-3.5 rounded-xl border border-[#EBE7DF] bg-[#F9F7F4]/60 text-sm focus:outline-none focus:border-[#013E37]"
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#013E37] text-[#FFEEB3] text-xs font-bold uppercase tracking-wider hover:bg-[#025249] transition-colors cursor-pointer disabled:opacity-60"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Save Address</span>
        </button>
      </div>
    </form>
  );
}

function SizingPanel({ user, onUpdated }: SectionFormProps) {
  const [preferredEuSize, setPreferredEuSize] = React.useState<string>(
    user.preferredEuSize !== null && user.preferredEuSize !== undefined
      ? String(user.preferredEuSize)
      : ""
  );
  const [saving, setSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await updatePatronProfile({
      preferredEuSize: preferredEuSize ? Number(preferredEuSize) : null,
    });

    setSaving(false);
    if (res.status === "success" && res.data?.user) {
      onUpdated(res.data.user);
      toast.success("Preferred EU size saved.");
      return;
    }
    toast.error(res.message || "Unable to save preferred size.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[#171C1A]">
          Fit &amp; EU Sizing
        </h2>
        <p className="text-sm text-[#777F7B] mt-1">
          Select your preferred EU footwear size for quick selection across
          DÁMS silhouettes.
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
        {EU_SIZES.map((size) => {
          const selected = preferredEuSize === String(size);
          return (
            <button
              key={size}
              type="button"
              onClick={() => setPreferredEuSize(selected ? "" : String(size))}
              className={cn(
                "h-12 rounded-xl border text-sm font-semibold transition-all cursor-pointer",
                selected
                  ? "bg-[#013E37] text-[#FFEEB3] border-[#013E37] shadow-xs"
                  : "bg-[#F9F7F4]/60 text-[#171C1A] border-[#EBE7DF] hover:border-[#013E37]/50"
              )}
            >
              EU {size}
            </button>
          );
        })}
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#013E37] text-[#FFEEB3] text-xs font-bold uppercase tracking-wider hover:bg-[#025249] transition-colors cursor-pointer disabled:opacity-60"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Save Fit Preference</span>
        </button>
      </div>
    </form>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const fetchSession = useAuthStore((s) => s.fetchSession);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  const [activeSection, setActiveSection] =
    React.useState<AccountSection>("personal");
  const [mobileDetailOpen, setMobileDetailOpen] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);

  const [orders, setOrders] = React.useState<VerifyOrderResponse[]>([]);
  const [ordersLoading, setOrdersLoading] = React.useState(false);
  const [ordersError, setOrdersError] = React.useState<string | null>(null);

  const [wishlist, setWishlist] = React.useState<Product[]>([]);
  const [wishlistLoading, setWishlistLoading] = React.useState(false);
  const [removingId, setRemovingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    void fetchSession();
  }, [fetchSession]);

  React.useEffect(() => {
    if (initialized && !user) {
      router.replace("/login?redirect=/account");
    }
  }, [initialized, user, router]);

  React.useEffect(() => {
    if (!user) return;
    let active = true;

    async function loadOrdersAndWishlist() {
      setOrdersLoading(true);
      setWishlistLoading(true);
      const [ordersRes, wishlistRes] = await Promise.all([
        getMyOrders(1, 20),
        getWishlist(),
      ]);
      if (!active) return;

      if (ordersRes.status === "success" && Array.isArray(ordersRes.data)) {
        setOrders(ordersRes.data);
        setOrdersError(null);
      } else if (ordersRes.status === "error") {
        setOrdersError(ordersRes.message || "Unable to load orders.");
      }
      setOrdersLoading(false);

      if (wishlistRes.status === "success" && Array.isArray(wishlistRes.data)) {
        setWishlist(wishlistRes.data);
      }
      setWishlistLoading(false);
    }

    void loadOrdersAndWishlist();
    return () => {
      active = false;
    };
  }, [user]);

  const handleRemoveWishlist = async (productId: string) => {
    setRemovingId(productId);
    const res = await removeFromWishlist(productId);
    setRemovingId(null);

    if (res.status === "success" && Array.isArray(res.data)) {
      setWishlist(res.data);
      toast.success("Removed from saved pairs.");
    } else if (res.status === "error") {
      toast.error(res.message || "Unable to remove saved pair.");
    } else {
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
      toast.success("Removed from saved pairs.");
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await logout();
    toast.success("Signed out.");
    router.push("/login");
  };

  if (!initialized || !user) {
    return (
      <div className="min-h-[70vh] bg-[#F9F7F4] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-[#4A5550]">
          <Loader2 className="w-7 h-7 animate-spin text-[#013E37]" />
          <p className="text-sm font-medium">Loading your patron profile…</p>
        </div>
      </div>
    );
  }

  const isStaff = Boolean(user.role && user.role !== "CUSTOMER");
  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "DÁMS Patron";
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`
    .trim()
    .toUpperCase() || (user.email?.[0] || "D").toUpperCase();

  const selectSection = (section: AccountSection) => {
    setActiveSection(section);
    setMobileDetailOpen(true);
  };

  const menuItems: Array<{
    id: AccountSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }> = [
    { id: "personal", label: "Personal Information", icon: User },
    {
      id: "orders",
      label: "My Orders",
      icon: Tag,
      badge: orders.length > 0 ? String(orders.length) : undefined,
    },
    { id: "addresses", label: "Addresses", icon: MapPin },
    {
      id: "wishlist",
      label: "Saved Pairs",
      icon: Heart,
      badge: wishlist.length > 0 ? String(wishlist.length) : undefined,
    },
    {
      id: "sizing",
      label: "Fit & EU Sizing",
      icon: Ruler,
      badge: user.preferredEuSize ? `EU ${user.preferredEuSize}` : undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F4] text-[#171C1A] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Centered Avatar + Clean Stacked Menu List (matches reference) */}
          <div
            className={cn(
              "lg:col-span-5 bg-white rounded-3xl border border-[#EBE7DF] shadow-xs overflow-hidden",
              mobileDetailOpen ? "hidden lg:block" : "block"
            )}
          >
            {/* Centered Profile Avatar & Identity */}
            <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center border-b border-[#EBE7DF]/80">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#013E37] text-[#FFEEB3] flex items-center justify-center font-serif text-3xl font-semibold shadow-sm ring-4 ring-[#F9F7F4]">
                  {initials}
                </div>
                <span
                  title="Verified Patron"
                  className="absolute bottom-0.5 right-0.5 w-7 h-7 rounded-full bg-[#013E37] text-[#FFEEB3] border-2 border-white flex items-center justify-center shadow-xs"
                >
                  <BadgeCheck className="w-4 h-4" />
                </span>
              </div>

              <h1 className="font-serif text-2xl text-[#171C1A] mt-4 tracking-tight">
                {fullName}
              </h1>
              <p className="text-sm text-[#777F7B] mt-0.5">{user.email}</p>

              {isStaff && (
                <Link
                  href="/admin"
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#013E37]/10 text-[#013E37] text-[11px] font-bold uppercase tracking-wider hover:bg-[#013E37]/15 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{user.role?.replace(/_/g, " ")} • Admin</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {/* Clean Stacked List */}
            <nav aria-label="Account sections" className="divide-y divide-[#EBE7DF]/80">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectSection(item.id)}
                    className={cn(
                      "w-full px-6 py-4 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer",
                      isActive
                        ? "bg-[#F9F7F4] text-[#013E37]"
                        : "bg-white text-[#171C1A] hover:bg-[#F9F7F4]/60"
                    )}
                  >
                    <span className="flex items-center gap-3.5 min-w-0">
                      <Icon
                        className={cn(
                          "w-5 h-5 shrink-0",
                          isActive ? "text-[#013E37]" : "text-[#4A5550]"
                        )}
                      />
                      <span className="text-[15px] font-medium truncate">
                        {item.label}
                      </span>
                    </span>

                    <span className="flex items-center gap-2 shrink-0">
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-[#013E37]/10 text-[#013E37] text-[11px] font-semibold">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-[#777F7B]" />
                    </span>
                  </button>
                );
              })}

              <Link
                href="/contact"
                className="w-full px-6 py-4 flex items-center justify-between gap-3 text-[#171C1A] hover:bg-[#F9F7F4]/60 transition-colors"
              >
                <span className="flex items-center gap-3.5">
                  <HelpCircle className="w-5 h-5 text-[#4A5550] shrink-0" />
                  <span className="text-[15px] font-medium">
                    Help &amp; Support
                  </span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#777F7B]" />
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full px-6 py-4 flex items-center justify-between gap-3 text-left text-[#171C1A] hover:bg-red-50/60 hover:text-red-700 transition-colors cursor-pointer disabled:opacity-60"
              >
                <span className="flex items-center gap-3.5">
                  {signingOut ? (
                    <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                  ) : (
                    <LogOut className="w-5 h-5 text-[#4A5550] shrink-0" />
                  )}
                  <span className="text-[15px] font-medium">Logout</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#777F7B]" />
              </button>
            </nav>
          </div>

          {/* Right Column: Active Section Content */}
          <div
            className={cn(
              "lg:col-span-7 bg-white rounded-3xl border border-[#EBE7DF] p-6 sm:p-8 shadow-xs",
              mobileDetailOpen ? "block" : "hidden lg:block"
            )}
          >
            {/* Mobile Back Button */}
            <button
              type="button"
              onClick={() => setMobileDetailOpen(false)}
              className="lg:hidden inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#013E37] mb-5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Account</span>
            </button>

            {activeSection === "personal" && (
              <PersonalInfoPanel
                key={`personal-${user.id}`}
                user={user}
                onUpdated={setUser}
              />
            )}

            {activeSection === "addresses" && (
              <AddressesPanel
                key={`addr-${user.id}`}
                user={user}
                onUpdated={setUser}
              />
            )}

            {activeSection === "sizing" && (
              <SizingPanel
                key={`size-${user.id}`}
                user={user}
                onUpdated={setUser}
              />
            )}

            {activeSection === "orders" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl text-[#171C1A]">
                      My Orders
                    </h2>
                    <p className="text-sm text-[#777F7B] mt-1">
                      Track your recent DÁMS footwear orders and delivery
                      updates.
                    </p>
                  </div>
                  <Link
                    href="/collections"
                    className="text-xs font-bold uppercase tracking-wider text-[#013E37] hover:underline shrink-0"
                  >
                    Shop →
                  </Link>
                </div>

                {ordersLoading ? (
                  <div className="py-12 flex items-center justify-center text-[#4A5550] gap-2 text-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-[#013E37]" />
                    <span>Loading your orders…</span>
                  </div>
                ) : ordersError ? (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
                    {ordersError}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Package className="w-10 h-10 text-[#777F7B]/60 mx-auto" />
                    <p className="text-sm text-[#777F7B]">
                      You haven&apos;t placed any orders yet.
                    </p>
                    <Link
                      href="/collections"
                      className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#013E37] text-[#FFEEB3] text-xs font-bold uppercase tracking-wider"
                    >
                      Explore Collections
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {orders.map((order) => (
                      <div
                        key={order.orderId || order.reference}
                        className="rounded-2xl border border-[#EBE7DF] p-4 sm:p-5 space-y-3 bg-[#F9F7F4]/50"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-[11px] uppercase tracking-wider text-[#777F7B]">
                              Reference
                            </p>
                            <p className="font-mono text-sm font-semibold text-[#171C1A]">
                              {order.reference || order.orderId}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-[#013E37]/10 text-[#013E37] text-[11px] font-bold uppercase tracking-wider">
                              {order.status}
                            </span>
                            <span className="font-serif text-lg text-[#171C1A]">
                              {formatNGN(order.totalAmount || 0)}
                            </span>
                          </div>
                        </div>

                        {Array.isArray(order.items) && order.items.length > 0 && (
                          <div className="border-t border-[#EBE7DF] pt-3 space-y-1.5">
                            {order.items.map((item, idx) => (
                              <div
                                key={`${item.productId}-${item.size}-${idx}`}
                                className="flex items-center justify-between text-xs sm:text-sm text-[#4A5550]"
                              >
                                <span>
                                  {item.name} — EU {item.size} ({item.colour}) ×{" "}
                                  {item.quantity}
                                </span>
                                <span className="font-medium text-[#171C1A]">
                                  {formatNGN(item.unitPrice * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === "wishlist" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl text-[#171C1A]">
                      Saved Pairs
                    </h2>
                    <p className="text-sm text-[#777F7B] mt-1">
                      Silhouettes you&apos;ve bookmarked for later.
                    </p>
                  </div>
                  <Link
                    href="/collections"
                    className="text-xs font-bold uppercase tracking-wider text-[#013E37] hover:underline shrink-0"
                  >
                    Browse →
                  </Link>
                </div>

                {wishlistLoading ? (
                  <div className="py-12 flex items-center justify-center text-[#4A5550] gap-2 text-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-[#013E37]" />
                    <span>Loading saved pairs…</span>
                  </div>
                ) : wishlist.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Heart className="w-10 h-10 text-[#777F7B]/60 mx-auto" />
                    <p className="text-sm text-[#777F7B]">
                      No saved pairs yet. Tap the heart on any silhouette to
                      save it here.
                    </p>
                    <Link
                      href="/collections"
                      className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#013E37] text-[#FFEEB3] text-xs font-bold uppercase tracking-wider"
                    >
                      Discover Footwear
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map((product) => {
                      const primaryImage =
                        product.images?.[0]?.url ||
                        "/images/placeholder-shoe.png";
                      return (
                        <div
                          key={product.id}
                          className="rounded-2xl border border-[#EBE7DF] overflow-hidden bg-[#F9F7F4]/40 flex flex-col"
                        >
                          <Link
                            href={`/products/${product.slug}`}
                            className="relative aspect-[4/3] bg-[#EBE7DF]/40 block"
                          >
                            <Image
                              src={primaryImage}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </Link>
                          <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                            <div>
                              <Link
                                href={`/products/${product.slug}`}
                                className="font-serif text-base text-[#171C1A] hover:text-[#013E37] transition-colors line-clamp-1"
                              >
                                {product.name}
                              </Link>
                              <p className="text-sm font-semibold text-[#013E37] mt-0.5">
                                {formatNGN(product.price)}
                              </p>
                            </div>
                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#EBE7DF]">
                              <Link
                                href={`/products/${product.slug}`}
                                className="text-xs font-bold uppercase tracking-wider text-[#013E37] hover:underline"
                              >
                                View Pair
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleRemoveWishlist(product.id)}
                                disabled={removingId === product.id}
                                className="inline-flex items-center gap-1 text-xs text-[#777F7B] hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                                aria-label={`Remove ${product.name} from saved pairs`}
                              >
                                {removingId === product.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
