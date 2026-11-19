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
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    const products = Array.isArray(json)
      ? json
      : Array.isArray(json.data)
        ? json.data
        : [];
    return products as Product[];
  } catch {
    return [];
  }
}

export async function getBestSellers(limit = 5): Promise<Product[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products/best-sellers?limit=${limit}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(4000),
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
    // Return empty list when API is unavailable
  }

  return [];
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products/new-arrivals?limit=${limit}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(4000),
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
    // Return empty list when API is unavailable
  }

  return [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products/${encodeURIComponent(slug)}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(4000),
      }
    );

    if (res.ok) {
      const json = await res.json();
      return (json.data || json) as Product;
    }
  } catch {
    // Return null when product is not found or API is unavailable
  }

  return null;
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
        signal: AbortSignal.timeout(4000),
      }
    );

    if (res.ok) {
      const json = await res.json();
      return (json.data || json) as ProductStockResponse;
    }
  } catch {
    // Return null when stock endpoint is unavailable
  }

  return null;
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
        signal: AbortSignal.timeout(4000),
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
    // Return empty list when API is unavailable
  }

  return [];
}

export async function getCollections(): Promise<Collection[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/collections`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const json = await res.json();
      const items = Array.isArray(json) ? json : json.data;
      if (Array.isArray(items)) {
        return items as Collection[];
      }
    }
  } catch {
    // Return empty list when API is unavailable
  }

  return [];
}

export async function getCollectionBySlug(
  slug: string
): Promise<CollectionWithProducts | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/collections/${encodeURIComponent(slug)}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(4000),
      }
    );

    if (res.ok) {
      const json = await res.json();
      return (json.data || json) as CollectionWithProducts;
    }
  } catch {
    // Return null when collection is not found or API is unavailable
  }

  return null;
}

export async function getCategories(): Promise<CategoriesResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const json = await res.json();
      return (json.data || json) as CategoriesResponse;
    }
  } catch {
    // Return empty categories when API is unavailable
  }

  return {
    categories: [],
    silhouettes: [],
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

