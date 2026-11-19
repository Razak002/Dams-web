"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCartStore } from "@/store/use-cart-store";
import { backdropFade, drawerSlide } from "@/lib/animations";
import { formatNGN } from "@/lib/utils";
import { Button } from "@/components/ui/Buttons";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Close drawer on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-[#171C1A]/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          <motion.aside
            variants={drawerSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white text-[#171C1A] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 bg-[#013E37] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#FFEEB3]" />
                <h2 className="font-serif text-xl tracking-wide text-[#FFEEB3]">
                  Your DÁMS Bag
                </h2>
                <span className="text-xs px-2 py-0.5 bg-white/10 text-[#FFEEB3]">
                  {items.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="p-1.5 text-white/80 hover:text-[#FFEEB3] transition-colors cursor-pointer"
                aria-label="Close bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 divide-y divide-[#171C1A]/10">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#013E37]/5 flex items-center justify-center text-[#013E37] mb-4">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <p className="font-serif text-xl text-[#171C1A]">
                    Your bag is currently empty
                  </p>
                  <p className="mt-2 text-sm text-[#777F7B] max-w-xs">
                    Explore our locally crafted Nigerian leather shoes to find your pair.
                  </p>
                  <Link
                    href="/collections"
                    onClick={closeCart}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#013E37] text-[#FFEEB3] text-xs font-semibold uppercase tracking-[0.15em] hover:bg-[#025249] transition-colors"
                  >
                    Browse Collections
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.key} className="py-5 first:pt-0 last:pb-0 flex gap-4">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="relative w-20 h-24 shrink-0 bg-[#F6F6F4] overflow-hidden border border-[#171C1A]/10"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={closeCart}
                            className="font-semibold text-sm text-[#171C1A] hover:text-[#013E37] transition-colors truncate"
                          >
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(item.key)}
                            className="text-[#777F7B] hover:text-red-600 transition-colors p-1 -mr-1 cursor-pointer"
                            aria-label={`Remove ${item.name} from bag`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="mt-0.5 text-xs text-[#777F7B]">
                          {item.colour} • EU {item.size} (UK {item.ukSize})
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-[#171C1A]/20">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.key, item.quantity - 1)
                            }
                            className="p-1.5 text-[#171C1A] hover:bg-[#171C1A]/5 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.key, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.maxStock}
                            className="p-1.5 text-[#171C1A] hover:bg-[#171C1A]/5 disabled:opacity-35 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-sm font-semibold text-[#171C1A]">
                          {formatNGN(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#171C1A]/10 bg-[#FAF9F6] px-6 py-5 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#777F7B]">Subtotal</span>
                    <span className="text-base font-bold text-[#171C1A]">
                      {formatNGN(subtotal)}
                    </span>
                  </div>
                  <p className="text-xs text-[#777F7B]">
                    {subtotal >= 150000
                      ? "✓ Qualifies for complimentary nationwide Nigerian delivery."
                      : `Add ${formatNGN(150000 - subtotal)} more for complimentary nationwide delivery.`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link href="/cart" onClick={closeCart}>
                    <Button variant="outline" fullWidth className="text-xs uppercase tracking-wider">
                      Review Bag
                    </Button>
                  </Link>
                  <Link href="/checkout" onClick={closeCart}>
                    <Button variant="primary" fullWidth className="text-xs uppercase tracking-wider">
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
