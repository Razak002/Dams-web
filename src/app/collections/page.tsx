import { Suspense } from "react";
import type { Metadata } from "next";
import { getProducts } from "@/lib/api-client";
import { CollectionCatalogClient } from "@/components/products/CollectionCatalogClient";
import { ProductGridSkeleton } from "@/components/ui/SkeletonLoaders";

export const metadata: Metadata = {
  title: "Collections — Handcrafted Nigerian Leather Shoes",
  description:
    "Browse DÁMS Men's, Women's, and Unisex leather footwear crafted in Abuja, Nigeria. Natural cork slides, derbies, penny loafers, woven mules, and Chelsea boots.",
};

async function CollectionsContent() {
  const products = await getProducts();
  return <CollectionCatalogClient initialProducts={products} />;
}

export default function CollectionsPage() {
  return (
    <div className="bg-white">
      {/* Editorial Banner */}
      <section className="bg-[#013E37] text-white py-14 sm:py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFEEB3]">
            Abuja Atelier • Permanent & Seasonal Line
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-white">
            The Footwear Collection
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
            Every pair is cut from purely natural full-grain Nigerian leather, lasted by hand, and inspected in our Abuja workshop for enduring comfort and proportion.
          </p>
        </div>
      </section>

      {/* Catalogue Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Suspense fallback={<ProductGridSkeleton count={6} />}>
          <CollectionsContent />
        </Suspense>
      </section>
    </div>
  );
}
