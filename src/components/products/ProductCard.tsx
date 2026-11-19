"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { Product } from "@/types/product";
import { formatNGN } from "@/lib/utils";
import { cardReveal } from "@/lib/animations";
import { Badge } from "@/components/ui/Badges";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];
  const totalStock = product.sizes.reduce((acc, s) => acc + s.stock, 0);

  return (
    <motion.article
      variants={cardReveal}
      className="group flex flex-col bg-white"
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/5] w-full overflow-hidden bg-[#F7F7F5] border border-[#171C1A]/10"
      >
        <Image
          src={primaryImage.url}
          alt={primaryImage.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
        />

        {product.images.length > 1 && (
          <Image
            src={secondaryImage.url}
            alt={secondaryImage.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.isNewArrival && <Badge variant="brand">New Release</Badge>}
          {totalStock > 0 && totalStock <= 8 && (
            <Badge variant="neutral">Small Batch</Badge>
          )}
        </div>

        {/* Hover Quick Action Bar */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-[#171C1A]/80 via-[#171C1A]/40 to-transparent">
          <span className="block w-full py-2.5 bg-white text-[#171C1A] text-center text-[11px] font-semibold uppercase tracking-[0.16em]">
            Inspect Pair →
          </span>
        </div>
      </Link>

      {/* Product Meta */}
      <div className="pt-4 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-[#777F7B]">
          <span>
            {product.category === "unisex"
              ? "Unisex Silhouette"
              : `${product.category}'s Collection`}
          </span>
          <span>{product.silhouette}</span>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="font-serif text-xl text-[#171C1A] group-hover:text-[#013E37] transition-colors"
        >
          {product.name}
        </Link>

        <p className="text-xs text-[#777F7B] line-clamp-1">
          {product.subtitle}
        </p>

        <div className="pt-1 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-[#171C1A]">
              {formatNGN(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-[#777F7B] line-through">
                {formatNGN(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Colourway Swatches */}
          <div className="flex items-center gap-1.5" aria-label="Available colourways">
            {product.colourways.map((colour) => (
              <span
                key={colour.name}
                title={colour.name}
                className="w-3.5 h-3.5 rounded-full border border-[#171C1A]/20"
                style={{ backgroundColor: colour.hex }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
