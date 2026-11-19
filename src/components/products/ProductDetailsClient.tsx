"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RefreshCw,
  Check,
  ChevronRight,
} from "lucide-react";
import type { Product, ProductSizeVariant } from "@/types/product";
import { formatNGN, cn } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";
import { ImageGallery } from "@/components/products/ImageGallery";
import { SizeSelector } from "@/components/products/SizeSelector";
import { SizeGuideModal } from "@/components/products/SizeGuideModal";
import { Badge } from "@/components/ui/Badges";
import { Button } from "@/components/ui/Buttons";

interface ProductDetailsClientProps {
  product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const firstAvailableSize =
    product.sizes.find((s) => s.stock > 0) || product.sizes[0];

  const [selectedColour, setSelectedColour] = React.useState(
    product.colourways[0]
  );
  const [selectedSizeVariant, setSelectedSizeVariant] =
    React.useState<ProductSizeVariant>(firstAvailableSize);
  const [sizeGuideOpen, setSizeGuideOpen] = React.useState(false);
  const [justAdded, setJustAdded] = React.useState(false);

  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    if (!selectedSizeVariant || selectedSizeVariant.stock <= 0) return;

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      size: selectedSizeVariant.size,
      ukSize: selectedSizeVariant.ukSize,
      colour: selectedColour.name,
      colourHex: selectedColour.hex,
      image: product.images[0].url,
      quantity: 1,
      maxStock: selectedSizeVariant.stock,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-[#171C1A]/10 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 text-xs text-[#777F7B]">
          <Link href="/" className="hover:text-[#013E37]">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/collections" className="hover:text-[#013E37]">
            Collections
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#171C1A] font-medium truncate">
            {product.name}
          </span>
        </div>
      </div>

      {/* Main Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Multi-Angle Gallery */}
          <div className="lg:col-span-7">
            <ImageGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Right: Specifications, Selectors & Add to Cart */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3 border-b border-[#171C1A]/10 pb-6">
              <div className="flex items-center gap-2">
                <Badge variant="brand">{product.silhouette}</Badge>
                {product.isNewArrival && (
                  <Badge variant="accent">New Arrival</Badge>
                )}
                <Badge variant="outline">{product.origin}</Badge>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-[#171C1A]">
                {product.name}
              </h1>
              <p className="text-sm text-[#777F7B]">{product.subtitle}</p>

              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-[#171C1A]">
                  {formatNGN(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-[#777F7B] line-through">
                    {formatNGN(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-[#171C1A]/85 leading-relaxed">
              {product.description}
            </p>

            {/* Colourway Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-[0.15em] text-[#171C1A]">
                  Leather Patina
                </span>
                <span className="text-[#777F7B] font-medium">
                  {selectedColour.name}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {product.colourways.map((colour) => {
                  const isActive = colour.name === selectedColour.name;
                  return (
                    <button
                      key={colour.name}
                      type="button"
                      onClick={() => setSelectedColour(colour)}
                      className={cn(
                        "inline-flex items-center gap-2.5 px-3.5 py-2 border text-xs transition-all cursor-pointer",
                        isActive
                          ? "border-[#013E37] bg-[#013E37]/5 font-semibold text-[#171C1A]"
                          : "border-[#171C1A]/20 text-[#777F7B] hover:border-[#171C1A]"
                      )}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/20"
                        style={{ backgroundColor: colour.hex }}
                      />
                      <span>{colour.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSizeVariant?.size ?? null}
              onSelectSize={(variant) => setSelectedSizeVariant(variant)}
              onOpenSizeGuide={() => setSizeGuideOpen(true)}
            />

            {/* Add to Bag CTA */}
            <div className="pt-2 space-y-3">
              <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                disabled={!selectedSizeVariant || selectedSizeVariant.stock <= 0}
                onClick={handleAddToCart}
                className="uppercase tracking-[0.18em] text-xs font-semibold"
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Your DÁMS Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      Add to Bag — {formatNGN(product.price)}
                    </span>
                  </>
                )}
              </Button>

              <p className="text-[11px] text-center text-[#777F7B]">
                Pay securely via Paystack (Card / Transfer / USSD) or place a direct WhatsApp Concierge order at checkout.
              </p>
            </div>

            {/* Material & Construction Specifications */}
            <div className="border-t border-[#171C1A]/10 pt-6 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#013E37]">
                Material & Craftsmanship Breakdown
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-[#FAF9F6] border border-[#171C1A]/10">
                  <dt className="uppercase tracking-wider text-[#777F7B] font-semibold">
                    Upper Leather
                  </dt>
                  <dd className="mt-1 text-[#171C1A] font-medium">
                    {product.materials.upper}
                  </dd>
                </div>
                <div className="p-3.5 bg-[#FAF9F6] border border-[#171C1A]/10">
                  <dt className="uppercase tracking-wider text-[#777F7B] font-semibold">
                    Interior Lining
                  </dt>
                  <dd className="mt-1 text-[#171C1A] font-medium">
                    {product.materials.lining}
                  </dd>
                </div>
                <div className="p-3.5 bg-[#FAF9F6] border border-[#171C1A]/10">
                  <dt className="uppercase tracking-wider text-[#777F7B] font-semibold">
                    Sole Unit
                  </dt>
                  <dd className="mt-1 text-[#171C1A] font-medium">
                    {product.materials.sole}
                  </dd>
                </div>
                <div className="p-3.5 bg-[#FAF9F6] border border-[#171C1A]/10">
                  <dt className="uppercase tracking-wider text-[#777F7B] font-semibold">
                    Construction
                  </dt>
                  <dd className="mt-1 text-[#171C1A] font-medium">
                    {product.materials.construction}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Care & Delivery Assurances */}
            <div className="border-t border-[#171C1A]/10 pt-6 space-y-3 text-xs text-[#777F7B]">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-[#013E37] shrink-0" />
                <span>
                  Abuja dispatch in 24 hrs • Nationwide Nigerian delivery in 2–4 business days.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="w-4 h-4 text-[#013E37] shrink-0" />
                <span>
                  Complimentary 14-day size exchange on unworn pairs.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#013E37] shrink-0" />
                <span>
                  Includes branded DÁMS cotton dust bag and care card.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </div>
  );
}
