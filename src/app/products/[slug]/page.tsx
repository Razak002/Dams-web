import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FALLBACK_PRODUCTS, getProductBySlug } from "@/lib/api-client";
import { ProductDetailsClient } from "@/components/products/ProductDetailsClient";
import { Skeleton } from "@/components/ui/SkeletonLoaders";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return FALLBACK_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Pair Not Found",
    };
  }

  return {
    title: `${product.name} — ${product.subtitle}`,
    description: product.description,
    openGraph: {
      title: `${product.name} | DÁMS Footwear Nigeria`,
      description: product.description,
      type: "website",
      images: product.images.map((img) => ({
        url: img.url,
        alt: img.alt,
      })),
    },
  };
}

async function ProductDetailsContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ slug: string }>;
}) {
  const { slug } = await paramsPromise;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const totalStock = product.sizes.reduce((acc, s) => acc + s.stock, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => img.url),
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "DÁMS Footwear",
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/products/${product.slug}`,
      priceCurrency: "NGN",
      price: product.price,
      availability:
        totalStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailsClient product={product} />
    </>
  );
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Skeleton className="lg:col-span-7 aspect-[4/5] w-full" />
          <div className="lg:col-span-5 space-y-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      }
    >
      <ProductDetailsContent paramsPromise={params} />
    </Suspense>
  );
}
