"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "@/types/product";
import { formatNGN, cn } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";
import { fadeUp, staggerContainer } from "@/lib/animations";

interface FeaturedGridProps {
  products: Product[];
}

export function FeaturedGrid({ products }: FeaturedGridProps) {
  const showcaseList = products.slice(0, 5);
  const [activeProduct, setActiveProduct] = React.useState<Product>(
    showcaseList[0] || products[0]
  );
  const [selectedColourIndex, setSelectedColourIndex] = React.useState(0);
  const [justAdded, setJustAdded] = React.useState(false);

  const addItem = useCartStore((s) => s.addItem);

  if (!activeProduct) return null;

  const activeColour =
    activeProduct.colourways[selectedColourIndex] ||
    activeProduct.colourways[0];

  const handleQuickAddToCart = () => {
    const availableSize =
      activeProduct.sizes.find((s) => s.stock > 0) || activeProduct.sizes[0];
    if (!availableSize) return;

    addItem({
      productId: activeProduct.id,
      slug: activeProduct.slug,
      name: activeProduct.name,
      subtitle: activeProduct.subtitle,
      price: activeProduct.price,
      size: availableSize.size,
      ukSize: availableSize.ukSize,
      colour: activeColour.name,
      colourHex: activeColour.hex,
      image: activeProduct.images[0].url,
      quantity: 1,
      maxStock: availableSize.stock || 5,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <section className="bg-[#FAF9F6] pt-10 sm:pt-20 pb-10 border-b border-[#171C1A]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* BEST SELLERS Giant Watermark + Centerpiece Product Stage */}
        <div className="relative flex flex-col items-center justify-center py-4 sm:py-10">
          {/* Giant Stacked Background Typography (Matching Sample Design) */}
          <div
            aria-hidden="true"
            className="pointer-events-none select-none flex flex-col items-center justify-center text-center leading-[0.88] tracking-tight font-serif uppercase text-[#013E37]/[0.07] w-full"
          >
            <span className="text-[42px] xs:text-[50px] sm:text-[96px] md:text-[128px] lg:text-[156px] font-bold whitespace-nowrap">
              BEST SELLERS
            </span>
            <span className="text-[42px] xs:text-[50px] sm:text-[96px] md:text-[128px] lg:text-[156px] font-bold whitespace-nowrap">
              BEST SELLERS
            </span>
          </div>

          {/* Floating Centerpiece Product Over Watermark */}
          <div className="relative -mt-20 sm:-mt-52 md:-mt-64 lg:-mt-72 w-full max-w-[280px] sm:max-w-[440px] aspect-[4/3] flex items-center justify-center">
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <Image
                src={activeProduct.images[0].url}
                alt={activeProduct.images[0].alt || activeProduct.name}
                fill
                sizes="(max-width: 768px) 280px, 440px"
                className="object-contain drop-shadow-[0_24px_32px_rgba(1,62,55,0.22)]"
              />
            </motion.div>

            {/* Centered Glassmorphic "→ Add to Cart" Pill Button (Matching Sample Design) */}
            <button
              type="button"
              onClick={handleQuickAddToCart}
              className="group absolute z-20 inline-flex items-center gap-2.5 sm:gap-3 bg-[#013E37]/90 hover:bg-[#013E37] text-white backdrop-blur-md rounded-full pl-2 pr-4 sm:pr-5 py-1.5 sm:py-2 text-xs font-semibold tracking-wide border border-[#FFEEB3]/35 shadow-xl transition-all duration-300 cursor-pointer"
            >
              <span className="w-7 h-7 rounded-full bg-[#FFEEB3] text-[#013E37] flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                {justAdded ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </span>
              <span>{justAdded ? "Added to Bag" : "Add to Cart"}</span>
            </button>
          </div>

          {/* Colourway Swatch Dots */}
          <div
            className="mt-3 sm:mt-4 flex items-center justify-center gap-3"
            aria-label="Select colourway"
          >
            {activeProduct.colourways.map((colour, idx) => {
              const isSelected = idx === selectedColourIndex;
              return (
                <button
                  key={colour.name}
                  type="button"
                  onClick={() => setSelectedColourIndex(idx)}
                  title={colour.name}
                  aria-label={colour.name}
                  className={cn(
                    "w-3.5 h-3.5 rounded-full transition-all cursor-pointer",
                    isSelected
                      ? "ring-2 ring-[#013E37] ring-offset-2 ring-offset-[#FAF9F6] scale-110"
                      : "opacity-60 hover:opacity-100"
                  )}
                  style={{ backgroundColor: colour.hex }}
                />
              );
            })}
          </div>

          {/* Centerpiece Metadata Bar (Left: Name & Tagline | Right: Price) */}
          <div className="mt-5 sm:mt-6 w-full max-w-xl flex items-end justify-between gap-4 px-2">
            <div className="min-w-0">
              <Link
                href={`/products/${activeProduct.slug}`}
                className="font-serif text-lg sm:text-2xl text-[#171C1A] hover:text-[#013E37] transition-colors block truncate"
              >
                {activeProduct.name}
              </Link>
              <p className="mt-0.5 text-xs text-[#777F7B] truncate">
                {activeProduct.subtitle}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#777F7B]">
                Price:
              </span>
              <span className="text-lg sm:text-xl font-bold text-[#013E37]">
                {formatNGN(activeProduct.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Swipe Header Hint */}
        <div className="mt-5 flex sm:hidden items-center justify-between text-[11px] uppercase tracking-[0.14em] text-[#777F7B] px-1">
          <span>Tap a silhouette to preview</span>
          <span className="text-[#013E37] font-semibold">Swipe →</span>
        </div>

        {/* Bottom 5-Column Horizontal Product Strip (Smooth Snap Carousel on Mobile, 5-Col on Desktop) */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-3 sm:mt-10 pt-4 sm:pt-8 border-t border-[#171C1A]/10 flex sm:grid sm:grid-cols-3 lg:grid-cols-5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory gap-3 sm:gap-0 pb-3 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 sm:divide-x divide-[#171C1A]/10"
        >
          {showcaseList.map((product) => {
            const isSelected = product.id === activeProduct.id;
            return (
              <motion.div
                key={product.id}
                variants={fadeUp}
                onClick={() => {
                  setActiveProduct(product);
                  setSelectedColourIndex(0);
                }}
                className={cn(
                  "group shrink-0 w-[60vw] max-w-[220px] sm:w-auto sm:max-w-none snap-start p-3.5 sm:px-4 sm:py-5 flex flex-col justify-between cursor-pointer transition-colors border sm:border-0",
                  isSelected
                    ? "bg-[#013E37]/[0.05] border-[#013E37]/40"
                    : "bg-white sm:bg-transparent border-[#171C1A]/10 hover:bg-white"
                )}
              >
                <div className="relative aspect-[4/3] w-full mb-3 sm:mb-4 overflow-hidden bg-white border border-[#171C1A]/5">
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].alt || product.name}
                    fill
                    sizes="(max-width: 640px) 220px, (max-width: 1024px) 30vw, 20vw"
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-[#777F7B] group-hover:text-[#171C1A] transition-colors truncate">
                      {product.name}
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 text-sm font-bold",
                        isSelected ? "text-[#013E37]" : "text-[#171C1A]"
                      )}
                    >
                      {formatNGN(product.price)}
                    </p>
                  </div>

                  <Link
                    href={`/products/${product.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] font-semibold uppercase tracking-wider text-[#013E37] sm:opacity-0 sm:group-hover:opacity-100 transition-opacity underline underline-offset-4 shrink-0"
                  >
                    View
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
