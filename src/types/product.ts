export type ProductCategory = "men" | "women" | "unisex";

export interface ProductSizeVariant {
  size: number; // EU size (e.g., 38 - 46)
  ukSize: number; // UK equivalent
  footLengthCm: number;
  stock: number;
}

export interface ProductColourway {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number; // In NGN (e.g., 68000)
  compareAtPrice?: number;
  category: ProductCategory;
  collectionSlug?: string;
  silhouette: string; // e.g., "Derby", "Penny Loafer", "Mule", "Chelsea Boot", "Slide"
  images: {
    url: string;
    alt: string;
    angle: string;
  }[];
  colourways: ProductColourway[];
  sizes: ProductSizeVariant[];
  materials: {
    upper: string;
    lining: string;
    sole: string;
    construction: string;
  };
  origin: string;
  featured: boolean;
  isBestSeller?: boolean;
  isNewArrival: boolean;
  careInstructions: string[];
  createdAt: string;
}

export interface ProductFilterParams {
  category?: ProductCategory | "all";
  collection?: string;
  silhouette?: string;
  sort?: "featured" | "newest" | "price-asc" | "price-desc";
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProductStockResponse {
  productId: string;
  slug: string;
  inStock: boolean;
  totalStock: number;
  sizes: ProductSizeVariant[];
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  productCount: number;
}

export interface CollectionWithProducts {
  collection: Collection;
  products: Product[];
}

export interface CategorySummary {
  value: ProductCategory;
  label: string;
  count: number;
}

export interface CategoriesResponse {
  categories: CategorySummary[];
  silhouettes: string[];
}
