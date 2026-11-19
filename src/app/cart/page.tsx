"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";
import { formatNGN } from "@/lib/utils";
import { Button } from "@/components/ui/Buttons";

const emptySubscribe = () => () => {};

export default function CartPage() {
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const freeShippingThreshold = 150000;
  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal
  );

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="h-64 animate-pulse bg-[#171C1A]/5" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#171C1A]/10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
              DÁMS Footwear Atelier
            </p>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-[#171C1A]">
              Your Shopping Bag
            </h1>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs uppercase tracking-wider text-[#777F7B] hover:text-red-600 underline underline-offset-4 self-start sm:self-auto cursor-pointer"
            >
              Empty Bag
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center space-y-5 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#013E37]/5 text-[#013E37] flex items-center justify-center">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl text-[#171C1A]">
              Your bag is empty
            </h2>
            <p className="text-sm text-[#777F7B]">
              Explore our locally manufactured Nigerian leather shoes and select your size to begin.
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2.5 px-7 py-4 bg-[#013E37] text-[#FFEEB3] text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#025249] transition-colors"
            >
              <span>Browse Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Cart Items Table */}
            <div className="lg:col-span-8 divide-y divide-[#171C1A]/10 border-b border-[#171C1A]/10">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="py-6 first:pt-0 flex flex-col sm:flex-row gap-6"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    className="relative w-28 h-36 bg-[#F7F7F5] border border-[#171C1A]/10 shrink-0 overflow-hidden"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-serif text-xl text-[#171C1A] hover:text-[#013E37] transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-[#777F7B]">
                          {item.subtitle}
                        </p>
                        <div className="mt-2 inline-flex flex-wrap items-center gap-3 text-xs text-[#171C1A]">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF9F6] border border-[#171C1A]/10">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: item.colourHex }}
                            />
                            {item.colour}
                          </span>
                          <span className="px-2.5 py-1 bg-[#FAF9F6] border border-[#171C1A]/10 font-medium">
                            EU {item.size} (UK {item.ukSize})
                          </span>
                        </div>
                      </div>

                      <p className="text-base font-bold text-[#171C1A]">
                        {formatNGN(item.price * item.quantity)}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#171C1A]/20">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity - 1)
                          }
                          className="p-2 text-[#171C1A] hover:bg-[#171C1A]/5 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.maxStock}
                          className="p-2 text-[#171C1A] hover:bg-[#171C1A]/5 disabled:opacity-35 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="inline-flex items-center gap-1.5 text-xs text-[#777F7B] hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 bg-[#FAF9F6] border border-[#171C1A]/15 p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-2xl text-[#171C1A]">
                Order Summary
              </h2>

              <div className="p-3.5 bg-white border border-[#171C1A]/10 text-xs text-[#171C1A] flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#013E37] shrink-0" />
                <span>
                  {remainingForFreeShipping === 0
                    ? "Complimentary nationwide delivery unlocked."
                    : `Add ${formatNGN(remainingForFreeShipping)} more for complimentary nationwide delivery.`}
                </span>
              </div>

              <dl className="space-y-3 text-sm border-b border-[#171C1A]/10 pb-5">
                <div className="flex justify-between">
                  <dt className="text-[#777F7B]">Subtotal</dt>
                  <dd className="font-semibold text-[#171C1A]">
                    {formatNGN(subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#777F7B]">Dispatch Estimate</dt>
                  <dd className="text-xs text-[#777F7B]">
                    Calculated at checkout
                  </dd>
                </div>
              </dl>

              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold uppercase tracking-wider text-[#171C1A]">
                  Estimated Total
                </span>
                <span className="text-xl font-bold text-[#171C1A]">
                  {formatNGN(subtotal)}
                </span>
              </div>

              <Link href="/checkout" className="block">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="uppercase tracking-[0.18em] text-xs font-semibold"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <div className="pt-2 flex items-center gap-2 text-xs text-[#777F7B]">
                <ShieldCheck className="w-4 h-4 text-[#013E37] shrink-0" />
                <span>
                  Paystack Secured (NGN Card, Bank Transfer, USSD) or WhatsApp Concierge Order.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
