"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createAdminProduct } from "@/lib/admin-api";
import { ProductForm } from "@/components/admin/ProductForm";

export default function AdminNewProductPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#013E37]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Footwear</span>
      </Link>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
          Catalogue Builder
        </p>
        <h1 className="font-serif text-3xl text-[#171C1A] mt-1">
          Create New Footwear Silhouette
        </h1>
      </div>

      <ProductForm
        submitLabel="Publish Footwear"
        onSubmit={async (payload) => {
          await createAdminProduct(payload);
        }}
      />
    </div>
  );
}
