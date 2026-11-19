import { Suspense } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { BrandStory } from "@/components/home/BrandStory";
import { getBestSellers } from "@/lib/api-client";
import { ProductGridSkeleton } from "@/components/ui/SkeletonLoaders";

async function FeaturedCollectionLoader() {
  const products = await getBestSellers(5);
  return <FeaturedGrid products={products} />;
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense
        fallback={
          <section className="py-20 sm:py-28 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <ProductGridSkeleton count={6} />
          </section>
        }
      >
        <FeaturedCollectionLoader />
      </Suspense>
      <BrandStory />
    </>
  );
}
