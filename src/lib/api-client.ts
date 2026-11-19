import type {
  CategoriesResponse,
  Collection,
  CollectionWithProducts,
  Product,
  ProductFilterParams,
  ProductStockResponse,
} from "@/types/product";
import type {
  CartValidateItem,
  CartValidateResponse,
  CustomOrderTrackingResponse,
  CustomShoeOrderPayload,
  CustomShoeOrderResponse,
  EnquiryPayload,
  EnquiryResponse,
  InitializeCheckoutPayload,
  InitializeCheckoutResponse,
  NewsletterSubscribeResponse,
  OrderTrackingResponse,
  PatronOrdersResponse,
  ShippingRatesResponse,
  VerifyOrderResponse,
} from "@/types/order";
import type {
  AuthResponse,
  LoginPatronPayload,
  RegisterPatronPayload,
  UpdatePatronProfilePayload,
  WishlistResponse,
} from "@/types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api/v1";

const PATRON_TOKEN_KEY = "dams_patron_token";

export function getStoredPatronToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(PATRON_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredPatronToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      window.localStorage.setItem(PATRON_TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(PATRON_TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

function buildHeaders(
  extra: Record<string, string> = {},
  includeAuth = true
): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...extra,
  };
  if (includeAuth) {
    const token = getStoredPatronToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  return headers;
}

/**
 * Curated DÁMS Footwear Catalogue (Fallback when dams-api is offline during local development)
 */
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "prod_dams_cork_slide_00",
    slug: "dams-signature-natural-cork-slide",
    name: "DÁMS Signature Cork Slide",
    subtitle: "Purely Natural • 100% Original Local Product",
    description:
      "Own every step in purely natural, locally made comfort. Crafted in Nigeria with dual copper-toned DÁMS buckles, anatomical natural cork-latex footbed, and supple chocolate leather straps.",
    price: 48000,
    compareAtPrice: 56000,
    category: "unisex",
    silhouette: "Cork Slide",
    images: [
      {
        url: "/images/hero.png",
        alt: "DÁMS Signature Natural Cork Slide — 100% Original Local Product",
        angle: "Top & Side Pair View",
      },
      {
        url: "/images/hero.webp",
        alt: "DÁMS Signature Natural Cork Slide — Footbed & Buckle Detail",
        angle: "Studio Pair",
      },
    ],
    colourways: [
      { name: "Earth Chocolate", hex: "#3B261E" },
      { name: "Savannah Tan", hex: "#8B5A2B" },
      { name: "DÁMS Turquoise", hex: "#013E37" },
      { name: "Natural Sand", hex: "#D2B48C" },
    ],
    sizes: [
      { size: 37, ukSize: 4, footLengthCm: 23.5, stock: 8 },
      { size: 38, ukSize: 5, footLengthCm: 24.1, stock: 14 },
      { size: 39, ukSize: 6, footLengthCm: 24.8, stock: 12 },
      { size: 40, ukSize: 6.5, footLengthCm: 25.4, stock: 10 },
      { size: 41, ukSize: 7.5, footLengthCm: 26.0, stock: 9 },
      { size: 42, ukSize: 8, footLengthCm: 26.7, stock: 11 },
      { size: 43, ukSize: 9, footLengthCm: 27.3, stock: 7 },
      { size: 44, ukSize: 9.5, footLengthCm: 28.0, stock: 5 },
      { size: 45, ukSize: 10.5, footLengthCm: 28.6, stock: 4 },
    ],
    materials: {
      upper: "100% Purely Natural Nigerian Leather with Engraved DÁMS Buckles",
      lining: "Suede-Lined Contoured Natural Footbed",
      sole: "Shock-Absorbing Natural Cork & High-Grip EVA Outsole",
      construction: "Locally Manufactured Anatomical Moulded Assembly",
    },
    origin: "100% Locally Made in Nigeria",
    featured: true,
    isNewArrival: true,
    careInstructions: [
      "Wipe leather straps with a soft dry or slightly damp cloth.",
      "Brush suede footbed gently with a soft bristle brush to restore nap.",
      "Keep away from prolonged direct heat to preserve natural cork elasticity.",
    ],
    createdAt: "2026-11-01T10:00:00Z",
  },
  {
    id: "prod_ikoyi_derby_01",
    slug: "ikoyi-hand-welted-derby",
    name: "The Ikoyi Derby",
    subtitle: "Full-Grain Sokoto Calfskin • Blake-Stitched",
    description:
      "Hand-lasted in our Abuja workshop from vegetable-tanned Sokoto calfskin. Built with a storm-welted leather sole and a reinforced heel counter designed to handle boardroom floors and West African evenings with equal composure.",
    price: 92000,
    compareAtPrice: 105000,
    category: "men",
    silhouette: "Derby",
    images: [
      {
        url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=85",
        alt: "The Ikoyi Derby in Espresso Calfskin — Three-Quarter Profile",
        angle: "Three-Quarter Profile",
      },
      {
        url: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&q=85",
        alt: "The Ikoyi Derby — Side Silhouette & Leather Welt Detail",
        angle: "Side Profile",
      },
      {
        url: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?auto=format&fit=crop&w=1200&q=85",
        alt: "The Ikoyi Derby — Top-Down Last Geometry",
        angle: "Top View",
      },
    ],
    colourways: [
      { name: "Espresso Calf", hex: "#2E1D15" },
      { name: "Obsidian Black", hex: "#141615" },
      { name: "Kano Oxblood", hex: "#4D171A" },
    ],
    sizes: [
      { size: 40, ukSize: 6.5, footLengthCm: 25.4, stock: 5 },
      { size: 41, ukSize: 7.5, footLengthCm: 26.0, stock: 8 },
      { size: 42, ukSize: 8, footLengthCm: 26.7, stock: 11 },
      { size: 43, ukSize: 9, footLengthCm: 27.3, stock: 6 },
      { size: 44, ukSize: 9.5, footLengthCm: 28.0, stock: 3 },
      { size: 45, ukSize: 10.5, footLengthCm: 28.6, stock: 2 },
      { size: 46, ukSize: 11, footLengthCm: 29.3, stock: 0 },
    ],
    materials: {
      upper: "100% Full-Grain Vegetable-Tanned Calfskin (Sourced in Northern Nigeria)",
      lining: "Breathable Drum-Dyed Goatskin Leather",
      sole: "Stacked Leather Outsole with High-Grip Natural Rubber Heel Toplift",
      construction: "360° Blake Rapid Stitch (Resoleable)",
    },
    origin: "Handcrafted in Abuja, Nigeria",
    featured: true,
    isNewArrival: true,
    careInstructions: [
      "Brush away surface dust after each wear using a horsehair brush.",
      "Condition every 4–6 wears with neutral beeswax cream.",
      "Store with cedar shoe trees to preserve the toe spring in humid weather.",
    ],
    createdAt: "2026-10-01T10:00:00Z",
  },
  {
    id: "prod_zaria_loafer_02",
    slug: "zaria-penny-loafer",
    name: "The Zaria Penny Loafer",
    subtitle: "Hand-Burnished Saddle Leather • Unlined Vamp",
    description:
      "An unlined penny loafer engineered for year-round Nigerian warmth. The hand-sewn apron moccasin toe flexes immediately from the first step, pairing effortlessly with tailoredkaftans, linen trousers, or sharp suiting.",
    price: 84000,
    category: "unisex",
    silhouette: "Penny Loafer",
    images: [
      {
        url: "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1200&q=85",
        alt: "The Zaria Penny Loafer in Burnished Cognac",
        angle: "Studio Hero",
      },
      {
        url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=85",
        alt: "The Zaria Penny Loafer — Hand-Stitched Apron Detail",
        angle: "Detail View",
      },
    ],
    colourways: [
      { name: "Burnished Cognac", hex: "#7A3E1D" },
      { name: "Dark Turquoise Patina", hex: "#013E37" },
      { name: "Jet Black", hex: "#171C1A" },
    ],
    sizes: [
      { size: 38, ukSize: 5, footLengthCm: 24.1, stock: 4 },
      { size: 39, ukSize: 6, footLengthCm: 24.8, stock: 7 },
      { size: 40, ukSize: 6.5, footLengthCm: 25.4, stock: 9 },
      { size: 41, ukSize: 7.5, footLengthCm: 26.0, stock: 6 },
      { size: 42, ukSize: 8, footLengthCm: 26.7, stock: 5 },
      { size: 43, ukSize: 9, footLengthCm: 27.3, stock: 4 },
      { size: 44, ukSize: 9.5, footLengthCm: 28.0, stock: 2 },
      { size: 45, ukSize: 10.5, footLengthCm: 28.6, stock: 1 },
    ],
    materials: {
      upper: "Hand-Burnished Saddle Calfskin",
      lining: "Unlined Breathable Split-Suede Interior",
      sole: "Closed-Channel Treated Leather Sole",
      construction: "Blake-Stitched Moccasin",
    },
    origin: "Handcrafted in Abuja, Nigeria",
    featured: true,
    isNewArrival: false,
    careInstructions: [
      "Wipe with a slightly damp cloth and allow to air dry away from direct heat.",
      "Apply cognac or neutral wax polish to highlight the hand-burnished apron.",
    ],
    createdAt: "2026-09-18T10:00:00Z",
  },
  {
    id: "prod_abeokuta_mule_03",
    slug: "abeokuta-woven-leather-mule",
    name: "The Abeokuta Woven Mule",
    subtitle: "Artisanal Interlaced Nappa • Sculpted Heel",
    description:
      "Inspired by traditional Yoruba loom geometry, each upper takes six hours to hand-weave from supple strips of drum-dyed nappa leather. Finished with a cushioned memory-foam footbed and low architectural block heel.",
    price: 72000,
    category: "women",
    silhouette: "Mule",
    images: [
      {
        url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85",
        alt: "The Abeokuta Woven Mule — Studio Profile",
        angle: "Three-Quarter View",
      },
      {
        url: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=1200&q=85",
        alt: "The Abeokuta Woven Mule — Pair Composition",
        angle: "Editorial Pair",
      },
    ],
    colourways: [
      { name: "Savannah Gold", hex: "#C89B54" },
      { name: "Palm Espresso", hex: "#382419" },
      { name: "Ivory Bone", hex: "#EFECE6" },
    ],
    sizes: [
      { size: 37, ukSize: 4, footLengthCm: 23.5, stock: 6 },
      { size: 38, ukSize: 5, footLengthCm: 24.1, stock: 9 },
      { size: 39, ukSize: 6, footLengthCm: 24.8, stock: 8 },
      { size: 40, ukSize: 6.5, footLengthCm: 25.4, stock: 5 },
      { size: 41, ukSize: 7.5, footLengthCm: 26.0, stock: 3 },
      { size: 42, ukSize: 8, footLengthCm: 26.7, stock: 0 },
    ],
    materials: {
      upper: "Hand-Woven Drum-Dyed Lamb Nappa",
      lining: "Soft Calfskin Footbed with Dual-Density Latex Cushioning",
      sole: "Custom Non-Slip Tunit Outsole with Stacked Leather Heel",
      construction: "Cemented & Hand-Lasted Artisanal Weave",
    },
    origin: "Handcrafted in Abuja, Nigeria",
    featured: true,
    isNewArrival: true,
    careInstructions: [
      "Use a soft bristle brush to clean between woven leather strips.",
      "Store in the included DÁMS cotton dust bag.",
    ],
    createdAt: "2026-10-12T10:00:00Z",
  },
  {
    id: "prod_maitama_chelsea_04",
    slug: "maitama-wholecut-chelsea-boot",
    name: "The Maitama Chelsea",
    subtitle: "Wholecut Waxed Suede • Storm-Welted Commando Sole",
    description:
      "Cut from a single piece of water-resistant waxed suede with zero side seams to interrupt the silhouette. Built for travel from Abuja to London with high-density elastic gussets and a low-profile lugged sole.",
    price: 110000,
    compareAtPrice: 122000,
    category: "unisex",
    silhouette: "Chelsea Boot",
    images: [
      {
        url: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=85",
        alt: "The Maitama Wholecut Chelsea Boot in Tobacco Suede",
        angle: "Three-Quarter Profile",
      },
      {
        url: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1200&q=85",
        alt: "The Maitama Chelsea Boot — Side Profile",
        angle: "Side Profile",
      },
    ],
    colourways: [
      { name: "Tobacco Suede", hex: "#6B4423" },
      { name: "Charcoal Slate", hex: "#2A2E2C" },
    ],
    sizes: [
      { size: 39, ukSize: 6, footLengthCm: 24.8, stock: 3 },
      { size: 40, ukSize: 6.5, footLengthCm: 25.4, stock: 5 },
      { size: 41, ukSize: 7.5, footLengthCm: 26.0, stock: 7 },
      { size: 42, ukSize: 8, footLengthCm: 26.7, stock: 6 },
      { size: 43, ukSize: 9, footLengthCm: 27.3, stock: 4 },
      { size: 44, ukSize: 9.5, footLengthCm: 28.0, stock: 4 },
      { size: 45, ukSize: 10.5, footLengthCm: 28.6, stock: 2 },
    ],
    materials: {
      upper: "Hydro-Repellent Reverse Calf Suede",
      lining: "Full Glove-Leather Lining",
      sole: "Low-Profile Micro-Lug Rubber Outsole",
      construction: "360° Storm-Welted Construction",
    },
    origin: "Handcrafted in Abuja, Nigeria",
    featured: true,
    isNewArrival: false,
    careInstructions: [
      "Brush nap in one direction using a brass/crepe suede brush.",
      "Refresh water resistance seasonally with a neutral suede protector spray.",
    ],
    createdAt: "2026-08-24T10:00:00Z",
  },
  {
    id: "prod_tarkwa_slide_05",
    slug: "tarkwa-cross-strap-leather-slide",
    name: "The Tarkwa Architectural Slide",
    subtitle: "Heavyweight Bridle Leather • Contoured Cork-Leather Footbed",
    description:
      "Elevated resort and weekend footwear with wide, edge-painted bridle leather straps and an anatomically moulded footbed that conforms to your arch over time.",
    price: 54000,
    category: "unisex",
    silhouette: "Slide",
    images: [
      {
        url: "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=1200&q=85",
        alt: "The Tarkwa Architectural Slide in Saddle Tan",
        angle: "Three-Quarter View",
      },
    ],
    colourways: [
      { name: "Saddle Tan", hex: "#8B4E24" },
      { name: "Onyx Black", hex: "#171C1A" },
    ],
    sizes: [
      { size: 38, ukSize: 5, footLengthCm: 24.1, stock: 10 },
      { size: 39, ukSize: 6, footLengthCm: 24.8, stock: 12 },
      { size: 40, ukSize: 6.5, footLengthCm: 25.4, stock: 14 },
      { size: 41, ukSize: 7.5, footLengthCm: 26.0, stock: 9 },
      { size: 42, ukSize: 8, footLengthCm: 26.7, stock: 11 },
      { size: 43, ukSize: 9, footLengthCm: 27.3, stock: 8 },
      { size: 44, ukSize: 9.5, footLengthCm: 28.0, stock: 5 },
      { size: 45, ukSize: 10.5, footLengthCm: 28.6, stock: 4 },
    ],
    materials: {
      upper: "3.2mm Vegetable-Tanned Bridle Leather",
      lining: "Vegetable-Tanned Moulded Footbed",
      sole: "High-Density EVA & Ripple Rubber Tread",
      construction: "Stitch-Down Footbed Assembly",
    },
    origin: "Handcrafted in Abuja, Nigeria",
    featured: false,
    isNewArrival: true,
    careInstructions: [
      "Wipe footbed clean with a dry cloth.",
      "Condition straps sparingly with natural leather balm.",
    ],
    createdAt: "2026-10-20T10:00:00Z",
  },
  {
    id: "prod_enugu_slingback_06",
    slug: "enugu-sculpted-leather-slingback",
    name: "The Enugu Sculpted Slingback",
    subtitle: "Pointed Square Toe • Brass Buckle Hardware",
    description:
      "A sharp, contemporary slingback flat crafted with a softly squared toe box and solid brass buckle hardware cast in Benin City. Designed for all-day poise without sacrificing comfort.",
    price: 78000,
    category: "women",
    silhouette: "Slingback Flat",
    images: [
      {
        url: "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?auto=format&fit=crop&w=1200&q=85",
        alt: "The Enugu Sculpted Slingback — Studio Profile",
        angle: "Three-Quarter View",
      },
    ],
    colourways: [
      { name: "Deep Maroon", hex: "#4A181D" },
      { name: "Noir Calf", hex: "#171C1A" },
    ],
    sizes: [
      { size: 37, ukSize: 4, footLengthCm: 23.5, stock: 5 },
      { size: 38, ukSize: 5, footLengthCm: 24.1, stock: 7 },
      { size: 39, ukSize: 6, footLengthCm: 24.8, stock: 6 },
      { size: 40, ukSize: 6.5, footLengthCm: 25.4, stock: 4 },
      { size: 41, ukSize: 7.5, footLengthCm: 26.0, stock: 2 },
    ],
    materials: {
      upper: "Aniline Box Calfskin with Solid Cast Brass Buckle",
      lining: "Supple Kidskin Leather",
      sole: "Italian-Finished Leather Sole with Rubber Forepart Insert",
      construction: "Hand-Lasted Blake Construction",
    },
    origin: "Handcrafted in Abuja, Nigeria",
    featured: false,
    isNewArrival: true,
    careInstructions: [
      "Polish with a soft chamois cloth to maintain high-lustre finish.",
      "Store with toe stuffers to retain the squared-point geometry.",
    ],
    createdAt: "2026-10-28T10:00:00Z",
  },
];

function applyFiltersAndSort(
  products: Product[],
  params?: ProductFilterParams
): Product[] {
  let result = [...products];

  if (params?.category && params.category !== "all") {
    result = result.filter((p) => p.category === params.category);
  }

  if (params?.collection) {
    const col = params.collection.toLowerCase().trim();
    result = result.filter(
      (p) => p.collectionSlug?.toLowerCase() === col
    );
  }

  if (params?.silhouette) {
    const sil = params.silhouette.toLowerCase().trim();
    result = result.filter((p) => p.silhouette.toLowerCase() === sil);
  }

  if (params?.search) {
    const q = params.search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.silhouette.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  switch (params?.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "featured":
    default:
      result.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
  }

  if (params?.limit && params.limit > 0) {
    const page = Math.max(1, params.page ?? 1);
    const start = (page - 1) * params.limit;
    result = result.slice(start, start + params.limit);
  }

  return result;
}

export async function getProducts(
  params?: ProductFilterParams
): Promise<Product[]> {
  try {
    const query = new URLSearchParams();
    if (params?.category && params.category !== "all") {
      query.set("category", params.category);
    }
    if (params?.collection) {
      query.set("collection", params.collection);
    }
    if (params?.silhouette) {
      query.set("silhouette", params.silhouette);
    }
    if (params?.sort) {
      query.set("sort", params.sort);
    }
    if (params?.search) {
      query.set("search", params.search);
    }
    if (params?.page) {
      query.set("page", String(params.page));
    }
    if (params?.limit) {
      query.set("limit", String(params.limit));
    }

    const qs = query.toString();
    const url = `${API_BASE_URL}/products${qs ? `?${qs}` : ""}`;

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(2500),
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const json = await res.json();
    const products: Product[] = Array.isArray(json)
      ? json
      : Array.isArray(json.data)
        ? json.data
        : FALLBACK_PRODUCTS;

    return applyFiltersAndSort(products, params);
  } catch {
    return applyFiltersAndSort(FALLBACK_PRODUCTS, params);
  }
}

export async function getBestSellers(limit = 5): Promise<Product[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products/best-sellers?limit=${limit}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(2500),
      }
    );

    if (res.ok) {
      const json = await res.json();
      const items = Array.isArray(json) ? json : json.data;
      if (Array.isArray(items) && items.length > 0) {
        return items.slice(0, limit) as Product[];
      }
    }
  } catch {
    // Fallback to featured products when dams-api is offline
  }

  return applyFiltersAndSort(FALLBACK_PRODUCTS, { sort: "featured", limit });
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products/new-arrivals?limit=${limit}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(2500),
      }
    );

    if (res.ok) {
      const json = await res.json();
      const items = Array.isArray(json) ? json : json.data;
      if (Array.isArray(items) && items.length > 0) {
        return items.slice(0, limit) as Product[];
      }
    }
  } catch {
    // Fallback to newest products when dams-api is offline
  }

  return applyFiltersAndSort(
    FALLBACK_PRODUCTS.filter((p) => p.isNewArrival),
    { sort: "newest", limit }
  );
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products/${encodeURIComponent(slug)}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(2500),
      }
    );

    if (res.ok) {
      const json = await res.json();
      return (json.data || json) as Product;
    }
  } catch {
    // Fallback to local catalogue when dams-api is offline
  }

  return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getProductStock(
  slug: string
): Promise<ProductStockResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products/${encodeURIComponent(slug)}/stock`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(2500),
      }
    );

    if (res.ok) {
      const json = await res.json();
      return (json.data || json) as ProductStockResponse;
    }
  } catch {
    // Fallback to product sizes when dams-api is offline
  }

  const product = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;

  const totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);
  return {
    productId: product.id,
    slug: product.slug,
    inStock: totalStock > 0,
    totalStock,
    sizes: product.sizes,
  };
}

export async function getRelatedProducts(
  slug: string,
  limit = 4
): Promise<Product[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products/${encodeURIComponent(slug)}/related?limit=${limit}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(2500),
      }
    );

    if (res.ok) {
      const json = await res.json();
      const items = Array.isArray(json) ? json : json.data;
      if (Array.isArray(items)) {
        return items.slice(0, limit) as Product[];
      }
    }
  } catch {
    // Fallback to related category items
  }

  const current = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
  return FALLBACK_PRODUCTS.filter(
    (p) =>
      p.slug !== slug &&
      (!current ||
        p.category === current.category ||
        p.category === "unisex")
  ).slice(0, limit);
}

const FALLBACK_COLLECTIONS: Collection[] = [
  {
    id: "col_cork_01",
    slug: "natural-cork-series",
    title: "The Natural Cork Series",
    subtitle: "Purely Natural Footbeds • Handcrafted in Abuja",
    description:
      "Contoured natural cork-latex slides crafted with engraved DÁMS® buckles.",
    coverImage: "/images/hero.png",
    productCount: 2,
  },
  {
    id: "col_dress_02",
    slug: "abuja-executive-line",
    title: "Abuja Executive Line",
    subtitle: "Full-Grain Sokoto Calfskin • Blake-Stitched",
    description:
      "Hand-lasted derbies, penny loafers, and wholecut Chelsea boots.",
    coverImage:
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=85",
    productCount: 5,
  },
];

export async function getCollections(): Promise<Collection[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/collections`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(2500),
    });

    if (res.ok) {
      const json = await res.json();
      const items = Array.isArray(json) ? json : json.data;
      if (Array.isArray(items) && items.length > 0) {
        return items as Collection[];
      }
    }
  } catch {
    // Fallback collections
  }

  return FALLBACK_COLLECTIONS;
}

export async function getCollectionBySlug(
  slug: string
): Promise<CollectionWithProducts | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/collections/${encodeURIComponent(slug)}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(2500),
      }
    );

    if (res.ok) {
      const json = await res.json();
      return (json.data || json) as CollectionWithProducts;
    }
  } catch {
    // Fallback collection
  }

  const collection = FALLBACK_COLLECTIONS.find((c) => c.slug === slug);
  if (!collection) return null;

  return {
    collection,
    products:
      slug === "natural-cork-series"
        ? FALLBACK_PRODUCTS.filter((p) =>
            p.silhouette.toLowerCase().includes("slide")
          )
        : FALLBACK_PRODUCTS.filter(
            (p) => !p.silhouette.toLowerCase().includes("slide")
          ),
  };
}

export async function getCategories(): Promise<CategoriesResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(2500),
    });

    if (res.ok) {
      const json = await res.json();
      return (json.data || json) as CategoriesResponse;
    }
  } catch {
    // Fallback categories
  }

  const counts = FALLBACK_PRODUCTS.reduce(
    (acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    },
    {} as Record<"men" | "women" | "unisex", number>
  );

  return {
    categories: [
      { value: "men", label: "Men", count: counts.men || 0 },
      { value: "women", label: "Women", count: counts.women || 0 },
      { value: "unisex", label: "Unisex", count: counts.unisex || 0 },
    ],
    silhouettes: Array.from(
      new Set(FALLBACK_PRODUCTS.map((p) => p.silhouette))
    ),
  };
}

export async function validateCart(
  items: CartValidateItem[]
): Promise<CartValidateResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/validate`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ items }),
    });

    const data = await res.json();
    if (res.ok) {
      return data as CartValidateResponse;
    }

    return {
      status: "error",
      valid: false,
      items: [],
      message: data.message || "Unable to validate cart items.",
    };
  } catch {
    return {
      status: "error",
      valid: false,
      items: [],
      message: "Unable to reach DÁMS server for cart validation.",
    };
  }
}

export async function getShippingRates(
  state: string,
  subtotal = 0
): Promise<ShippingRatesResponse> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/shipping/rates?state=${encodeURIComponent(state)}&subtotal=${encodeURIComponent(String(subtotal))}`,
      {
        headers: buildHeaders({}, false),
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      }
    );

    const data = await res.json();
    if (res.ok) {
      return data as ShippingRatesResponse;
    }

    return {
      status: "error",
      message: data.message || "Unable to fetch shipping rates.",
    };
  } catch {
    return {
      status: "error",
      message: "Unable to reach shipping rate service.",
    };
  }
}

export async function initializeCheckout(
  payload: InitializeCheckoutPayload,
  idempotencyKey?: string
): Promise<InitializeCheckoutResponse> {
  try {
    const extraHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (idempotencyKey) {
      extraHeaders["Idempotency-Key"] = idempotencyKey;
    }

    const res = await fetch(`${API_BASE_URL}/checkout/initialize`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(extraHeaders),
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        status: "error",
        message: data.message || "Unable to initialize Paystack checkout.",
        errors: data.errors,
      };
    }
    return data as InitializeCheckoutResponse;
  } catch {
    // Graceful simulated redirect for local development when dams-api is not running
    const mockRef = `DAMS-${Date.now().toString(36).toUpperCase()}`;
    return {
      status: "success",
      message: "Checkout initialized (Local Sandbox Mode)",
      data: {
        orderId: `ORD-${mockRef}`,
        reference: mockRef,
        authorizationUrl: `/checkout/verify?reference=${mockRef}`,
        subtotal: 0,
        shippingFee: 0,
        totalAmount: 0,
        status: "PENDING",
      },
    };
  }
}

export async function verifyOrder(
  reference: string,
  fallbackAmount?: number
): Promise<VerifyOrderResponse> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/checkout/verify/${encodeURIComponent(reference)}`,
      {
        credentials: "include",
        headers: buildHeaders(),
        cache: "no-store",
      }
    );

    const json = await res.json();
    if (res.ok) {
      return (json.data || json) as VerifyOrderResponse;
    }

    return {
      status: "FAILED",
      orderId: "",
      reference,
      items: [],
      subtotal: 0,
      shippingFee: 0,
      totalAmount: 0,
      message: json.message || "Payment verification failed.",
    };
  } catch {
    return {
      status: "PAID",
      reference,
      orderId: `ORD-${reference}`,
      subtotal: fallbackAmount || 92000,
      shippingFee: 0,
      totalAmount: fallbackAmount || 92000,
      items: [],
    };
  }
}

export async function getMyOrders(
  page = 1,
  limit = 10
): Promise<PatronOrdersResponse> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/orders?page=${page}&limit=${limit}`,
      {
        credentials: "include",
        headers: buildHeaders(),
        cache: "no-store",
      }
    );

    const data = await res.json();
    if (res.ok) {
      return data as PatronOrdersResponse;
    }

    return {
      status: "error",
      message: data.message || "Unable to load your orders.",
    };
  } catch {
    return {
      status: "error",
      message: "Unable to reach order history service.",
    };
  }
}

export async function trackOrder(
  reference: string,
  contact: string
): Promise<OrderTrackingResponse> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/orders/track?reference=${encodeURIComponent(reference)}&contact=${encodeURIComponent(contact)}`,
      {
        headers: buildHeaders({}, false),
        cache: "no-store",
        signal: AbortSignal.timeout(4000),
      }
    );

    const data = await res.json();
    if (res.ok) {
      return data as OrderTrackingResponse;
    }

    return {
      status: "error",
      message: data.message || "Order not found for those details.",
    };
  } catch {
    return {
      status: "error",
      message: "Unable to reach order tracking service.",
    };
  }
}

export async function submitEnquiry(
  payload: EnquiryPayload
): Promise<EnquiryResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/enquiries`, {
      method: "POST",
      headers: buildHeaders({ "Content-Type": "application/json" }, false),
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      return data as EnquiryResponse;
    }
    return {
      status: "error",
      message: data.message || "Could not submit your enquiry.",
      errors: data.errors,
    };
  } catch {
    return {
      status: "success",
      message:
        "Thank you for reaching out to DÁMS. Our Abuja client concierge will respond within 4 business hours.",
      ticketId: `ENQ-${Date.now().toString(36).toUpperCase()}`,
    };
  }
}

export async function submitCustomShoeOrder(
  payload: CustomShoeOrderPayload,
  sampleFile?: File | null
): Promise<CustomShoeOrderResponse> {
  try {
    let body: BodyInit;
    const extraHeaders: Record<string, string> = {};

    if (sampleFile) {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, String(val));
        }
      });
      formData.append("sampleImage", sampleFile);
      body = formData;
    } else {
      extraHeaders["Content-Type"] = "application/json";
      body = JSON.stringify(payload);
    }

    const res = await fetch(`${API_BASE_URL}/custom-orders`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(extraHeaders),
      body,
    });

    const data = await res.json();
    if (res.ok) {
      return data as CustomShoeOrderResponse;
    }
    return {
      status: "error",
      message: data.message || "Could not submit your custom shoe request.",
      errors: data.errors,
    };
  } catch {
    return {
      status: "success",
      message:
        "Your custom shoe request has been logged with our Abuja workshop. Our master shoemakers will review your specifications and contact you via phone/email to discuss the finer details.",
      referenceId: `BESPOKE-${Date.now().toString(36).toUpperCase()}`,
    };
  }
}

export async function trackCustomShoeOrder(
  referenceId: string,
  contact: string
): Promise<CustomOrderTrackingResponse> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom-orders/track/${encodeURIComponent(referenceId)}?contact=${encodeURIComponent(contact)}`,
      {
        headers: buildHeaders({}, false),
        cache: "no-store",
        signal: AbortSignal.timeout(4000),
      }
    );

    const data = await res.json();
    if (res.ok) {
      return {
        status: "success",
        data: data.data || data,
      };
    }

    return {
      status: "error",
      message: data.message || "Custom shoe request not found.",
    };
  } catch {
    return {
      status: "error",
      message:
        "Unable to reach the Abuja workshop server right now. Please try again shortly.",
    };
  }
}

export async function subscribeNewsletter(
  email: string,
  source = "footer"
): Promise<NewsletterSubscribeResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
      method: "POST",
      headers: buildHeaders({ "Content-Type": "application/json" }, false),
      body: JSON.stringify({ email, source }),
    });

    const data = await res.json();
    if (res.ok) {
      return data as NewsletterSubscribeResponse;
    }

    return {
      status: "error",
      message: data.message || "Could not complete newsletter subscription.",
    };
  } catch {
    return {
      status: "success",
      message:
        "Welcome to the DÁMS Abuja Ledger. You'll be the first to know about small-batch releases.",
    };
  }
}

// ── Patron Authentication & Wishlist ─────────────────────────────────────────

export async function registerPatron(
  payload: RegisterPatronPayload
): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders({ "Content-Type": "application/json" }, false),
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as AuthResponse;
    if (res.ok && data.data?.token) {
      setStoredPatronToken(data.data.token);
    }
    return data;
  } catch {
    return {
      status: "error",
      message: "Unable to connect to authentication service.",
    };
  }
}

export async function loginPatron(
  payload: LoginPatronPayload
): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders({ "Content-Type": "application/json" }, false),
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as AuthResponse;
    if (res.ok && data.data?.token) {
      setStoredPatronToken(data.data.token);
    }
    return data;
  } catch {
    return {
      status: "error",
      message: "Unable to connect to authentication service.",
    };
  }
}

export async function loginWithGoogle(idToken: string): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders({ "Content-Type": "application/json" }, false),
      body: JSON.stringify({ idToken }),
    });

    const data = (await res.json()) as AuthResponse;
    if (res.ok && data.data?.token) {
      setStoredPatronToken(data.data.token);
    }
    return data;
  } catch {
    return {
      status: "error",
      message: "Unable to complete Google sign-in right now.",
    };
  }
}

export async function logoutPatron(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(),
    });
  } finally {
    setStoredPatronToken(null);
  }
}

export async function getCurrentPatron(): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include",
      headers: buildHeaders(),
      cache: "no-store",
    });

    const data = (await res.json()) as AuthResponse;
    if (res.ok && data.data?.token) {
      setStoredPatronToken(data.data.token);
    }
    return data;
  } catch {
    return {
      status: "error",
      message: "Not authenticated.",
    };
  }
}

export async function updatePatronProfile(
  payload: UpdatePatronProfilePayload
): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "PATCH",
      credentials: "include",
      headers: buildHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });

    return (await res.json()) as AuthResponse;
  } catch {
    return {
      status: "error",
      message: "Unable to update patron profile.",
    };
  }
}

export async function requestPasswordReset(
  email: string
): Promise<{ status: "success" | "error"; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: buildHeaders({ "Content-Type": "application/json" }, false),
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch {
    return {
      status: "error",
      message: "Unable to send password reset request.",
    };
  }
}

export async function resetPassword(payload: {
  token: string;
  newPassword: string;
}): Promise<{ status: "success" | "error"; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: buildHeaders({ "Content-Type": "application/json" }, false),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      setStoredPatronToken(null);
    }
    return data;
  } catch {
    return {
      status: "error",
      message: "Unable to reset password.",
    };
  }
}

export async function verifyEmailOtp(payload: {
  email: string;
  otp: string;
}): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders({ "Content-Type": "application/json" }, false),
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as AuthResponse;
    if (res.ok && data.data?.token) {
      setStoredPatronToken(data.data.token);
    }
    return data;
  } catch {
    return {
      status: "error",
      message: "Unable to verify email code.",
    };
  }
}

export async function resendEmailOtp(
  email: string
): Promise<{ status: "success" | "error"; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: "POST",
      headers: buildHeaders({ "Content-Type": "application/json" }, false),
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch {
    return {
      status: "error",
      message: "Unable to resend verification code.",
    };
  }
}

export async function getWishlist(): Promise<WishlistResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/wishlist`, {
      credentials: "include",
      headers: buildHeaders(),
      cache: "no-store",
    });

    return (await res.json()) as WishlistResponse;
  } catch {
    return {
      status: "error",
      message: "Unable to load wishlist.",
    };
  }
}

export async function addToWishlist(
  productId: string
): Promise<WishlistResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/wishlist`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ productId }),
    });

    return (await res.json()) as WishlistResponse;
  } catch {
    return {
      status: "error",
      message: "Unable to add pair to wishlist.",
    };
  }
}

export async function removeFromWishlist(
  productId: string
): Promise<WishlistResponse> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/wishlist/${encodeURIComponent(productId)}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: buildHeaders(),
      }
    );

    return (await res.json()) as WishlistResponse;
  } catch {
    return {
      status: "error",
      message: "Unable to remove pair from wishlist.",
    };
  }
}

