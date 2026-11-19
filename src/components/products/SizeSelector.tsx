"use client";

import type { ProductSizeVariant } from "@/types/product";
import { cn } from "@/lib/utils";
import { Ruler } from "lucide-react";

interface SizeSelectorProps {
  sizes: ProductSizeVariant[];
  selectedSize: number | null;
  onSelectSize: (variant: ProductSizeVariant) => void;
  onOpenSizeGuide: () => void;
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSelectSize,
  onOpenSizeGuide,
}: SizeSelectorProps) {
  const activeVariant = sizes.find((s) => s.size === selectedSize);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#171C1A]">
            Select Size (EU / UK)
          </span>
          {activeVariant && (
            <span className="ml-2 text-xs text-[#777F7B]">
              • Foot length {activeVariant.footLengthCm} cm
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenSizeGuide}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#013E37] underline underline-offset-4 hover:opacity-80 cursor-pointer"
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>Size & Last Guide</span>
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {sizes.map((variant) => {
          const isOut = variant.stock <= 0;
          const isSelected = selectedSize === variant.size;

          return (
            <button
              key={variant.size}
              type="button"
              disabled={isOut}
              onClick={() => onSelectSize(variant)}
              className={cn(
                "relative py-3 px-2 border text-center transition-all cursor-pointer flex flex-col items-center justify-center",
                isOut
                  ? "border-[#171C1A]/10 bg-[#F7F7F5] text-[#777F7B]/40 cursor-not-allowed line-through"
                  : isSelected
                    ? "border-[#013E37] bg-[#013E37] text-[#FFEEB3] font-semibold shadow-xs"
                    : "border-[#171C1A]/20 bg-white text-[#171C1A] hover:border-[#013E37]"
              )}
              aria-label={`EU ${variant.size}, UK ${variant.ukSize}${isOut ? " - Out of stock" : ""}`}
            >
              <span className="text-sm leading-none">EU {variant.size}</span>
              <span
                className={cn(
                  "mt-1 text-[10px]",
                  isSelected ? "text-[#FFEEB3]/80" : "text-[#777F7B]"
                )}
              >
                UK {variant.ukSize}
              </span>
            </button>
          );
        })}
      </div>

      {/* Real-time Stock Indicator */}
      {activeVariant && (
        <div className="flex items-center gap-2 pt-1 text-xs">
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              activeVariant.stock > 4
                ? "bg-emerald-600"
                : activeVariant.stock > 0
                  ? "bg-amber-600"
                  : "bg-red-600"
            )}
          />
          <span className="text-[#171C1A] font-medium">
            {activeVariant.stock > 4
              ? `In Stock in Abuja Atelier (${activeVariant.stock} pairs ready for dispatch)`
              : activeVariant.stock > 0
                ? `Low Stock — Only ${activeVariant.stock} pair${activeVariant.stock === 1 ? "" : "s"} remaining in EU ${activeVariant.size}`
                : "Currently out of stock in this size"}
          </span>
        </div>
      )}
    </div>
  );
}
