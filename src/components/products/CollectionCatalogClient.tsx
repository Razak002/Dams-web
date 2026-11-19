"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { motion } from "motion/react";
import type { Product, ProductCategory } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";
import { staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface CollectionCatalogClientProps {
  initialProducts: Product[];
}

const CATEGORIES: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All Footwear" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "unisex", label: "Unisex" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest Releases" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;

export function CollectionCatalogClient({
  initialProducts,
}: CollectionCatalogClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const paramCategory = searchParams.get("category") as
    | ProductCategory
    | "all"
    | null;
  const paramSearch = searchParams.get("search") || "";
  const paramSort = searchParams.get("sort") as
    | (typeof SORT_OPTIONS)[number]["value"]
    | null;

  const selectedCategory: ProductCategory | "all" =
    paramCategory && ["men", "women", "unisex"].includes(paramCategory)
      ? paramCategory
      : "all";

  const [sortBy, setSortBy] = React.useState<
    (typeof SORT_OPTIONS)[number]["value"]
  >(
    paramSort &&
      ["featured", "newest", "price-asc", "price-desc"].includes(paramSort)
      ? paramSort
      : "featured"
  );

  const handleCategoryChange = (cat: ProductCategory | "all") => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "all") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const filteredProducts = React.useMemo(() => {
    let list = [...initialProducts];
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (paramSearch.trim()) {
      const q = paramSearch.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.silhouette.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "featured":
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }

    return list;
  }, [initialProducts, selectedCategory, paramSearch, sortBy]);

  return (
    <div className="space-y-10">
      {/* Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#171C1A]/10">
        {/* Category Tabs */}
        <div
          role="tablist"
          aria-label="Filter by category"
          className="flex flex-wrap items-center gap-2"
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleCategoryChange(cat.value)}
                className={cn(
                  "px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] transition-colors cursor-pointer",
                  isActive
                    ? "bg-[#013E37] text-[#FFEEB3]"
                    : "bg-[#F7F7F5] text-[#171C1A] hover:bg-[#171C1A]/10"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Right: Count + Sort */}
        <div className="flex items-center justify-between md:justify-end gap-4">
          <span className="text-xs text-[#777F7B]">
            Showing{" "}
            <strong className="text-[#171C1A]">{filteredProducts.length}</strong>{" "}
            {filteredProducts.length === 1 ? "silhouette" : "silhouettes"}
          </span>

          <div className="inline-flex items-center gap-2 border border-[#171C1A]/20 px-3 py-2 bg-white">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#013E37]" />
            <label htmlFor="collection-sort" className="sr-only">
              Sort products
            </label>
            <select
              id="collection-sort"
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as (typeof SORT_OPTIONS)[number]["value"]
                )
              }
              className="text-xs font-medium text-[#171C1A] bg-transparent focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Search Filter Pill */}
      {paramSearch.trim() && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-[#FAF9F6] border border-[#013E37]/20 text-xs">
          <div className="flex items-center gap-2 text-[#171C1A]">
            <Search className="w-3.5 h-3.5 text-[#013E37]" />
            <span>
              Search results for{" "}
              <strong className="text-[#013E37]">
                &ldquo;{paramSearch}&rdquo;
              </strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleClearSearch}
            className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-[#013E37] hover:opacity-75 cursor-pointer"
          >
            <span>Clear</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-[#FAF9F6] border border-[#171C1A]/10">
          <p className="font-serif text-2xl text-[#171C1A]">
            No pairs match this filter
          </p>
          <p className="text-sm text-[#777F7B]">
            Try selecting &ldquo;All Footwear&rdquo; to explore our full Abuja atelier line.
          </p>
        </div>
      ) : (
        <motion.div
          key={`${selectedCategory}-${sortBy}`}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
