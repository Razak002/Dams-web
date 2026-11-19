import { getStoredPatronToken } from "@/lib/api-client";
import type {
  AdminCollection,
  AdminCollectionPayload,
  AdminCustomOrder,
  AdminEnquiry,
  AdminOrder,
  AdminProduct,
  AdminProductPayload,
  AdminUsersFilter,
  AnalyticsOverview,
  ApiEnvelope,
  CreateManualOrderPayload,
  CreateStaffPayload,
  EnquiryStatus,
  NewsletterSubscriber,
  ShippingSettings,
  StaffMember,
  UpdateCustomOrderPayload,
  UpdateOrderStatusPayload,
  UpdateStockPayload,
} from "@/types/admin";
import type { CustomOrderCommissionStatus } from "@/types/order";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export class AdminApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function adminFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiEnvelope<T>> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const token = getStoredPatronToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
    cache: "no-store",
  });

  const json = (await res.json().catch(() => ({
    status: "error",
    message: "Invalid server response.",
  }))) as ApiEnvelope<T>;

  if (!res.ok) {
    throw new AdminApiError(
      json.message || `Request failed (${res.status})`,
      res.status,
      json.errors
    );
  }

  return json;
}

// ── A. Analytics ─────────────────────────────────────────────────────────────

export async function getAdminAnalyticsOverview(): Promise<AnalyticsOverview> {
  const res = await adminFetch<AnalyticsOverview>("/admin/analytics/overview");
  return res.data as AnalyticsOverview;
}

// ── B. Orders & Dispatch ─────────────────────────────────────────────────────

export interface AdminOrdersFilter {
  status?: string;
  paymentMethod?: string;
  fulfilmentIssue?: string;
  state?: string;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getAdminOrders(
  filters: AdminOrdersFilter = {}
): Promise<ApiEnvelope<AdminOrder[]>> {
  const qs = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== "ALL") {
      qs.set(k, String(v));
    }
  });
  const query = qs.toString();
  return adminFetch<AdminOrder[]>(`/admin/orders${query ? `?${query}` : ""}`);
}

export async function getAdminOrderById(id: string): Promise<AdminOrder> {
  const res = await adminFetch<AdminOrder>(
    `/admin/orders/${encodeURIComponent(id)}`
  );
  return res.data as AdminOrder;
}

export async function updateAdminOrderStatus(
  id: string,
  payload: UpdateOrderStatusPayload
): Promise<AdminOrder> {
  const res = await adminFetch<AdminOrder>(
    `/admin/orders/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
  return res.data as AdminOrder;
}

export async function createManualOrder(
  payload: CreateManualOrderPayload
): Promise<AdminOrder> {
  const res = await adminFetch<AdminOrder>("/admin/orders/manual", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data as AdminOrder;
}

// ── C. Products, Stock & Media Uploads ───────────────────────────────────────

export async function getAdminProducts(params?: {
  status?: string;
  outOfStock?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ApiEnvelope<AdminProduct[]>> {
  const qs = new URLSearchParams();
  if (params?.status && params.status !== "all") {
    qs.set("status", params.status);
  }
  if (params?.outOfStock) {
    qs.set("outOfStock", "true");
  }
  if (params?.search) {
    qs.set("search", params.search);
  }
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const q = qs.toString();
  return adminFetch<AdminProduct[]>(`/admin/products${q ? `?${q}` : ""}`);
}

export async function getAdminProductById(id: string): Promise<AdminProduct> {
  const res = await adminFetch<AdminProduct>(
    `/admin/products/${encodeURIComponent(id)}`
  );
  return res.data as AdminProduct;
}

export async function createAdminProduct(
  payload: AdminProductPayload
): Promise<AdminProduct> {
  const res = await adminFetch<AdminProduct>("/admin/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data as AdminProduct;
}

export async function updateAdminProduct(
  id: string,
  payload: Partial<AdminProductPayload>
): Promise<AdminProduct> {
  const res = await adminFetch<AdminProduct>(
    `/admin/products/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
  return res.data as AdminProduct;
}

export async function updateAdminProductStock(
  id: string,
  payload: UpdateStockPayload
): Promise<AdminProduct> {
  const res = await adminFetch<AdminProduct>(
    `/admin/products/${encodeURIComponent(id)}/stock`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
  return res.data as AdminProduct;
}

export async function deleteAdminProduct(
  id: string,
  hard = false
): Promise<void> {
  await adminFetch(
    `/admin/products/${encodeURIComponent(id)}${hard ? "?hard=true" : ""}`,
    {
      method: "DELETE",
    }
  );
}

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  "image/webp",
  "image/png",
  "image/jpeg",
  "model/gltf-binary",
]);

export interface UploadedMediaResult {
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  url: string;
}

export async function uploadAdminMedia(
  file: File
): Promise<UploadedMediaResult> {
  const isGlbByName = file.name.toLowerCase().endsWith(".glb");
  if (!ALLOWED_UPLOAD_MIME_TYPES.has(file.type) && !isGlbByName) {
    throw new AdminApiError(
      "Unsupported file type. Upload WebP, PNG, JPG, or .glb files.",
      415
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new AdminApiError("File exceeds the 15MB upload limit.", 413);
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await adminFetch<UploadedMediaResult>("/admin/uploads", {
    method: "POST",
    body: formData,
  });
  return res.data as UploadedMediaResult;
}

// ── D. Collections ───────────────────────────────────────────────────────────

export async function getAdminCollections(): Promise<AdminCollection[]> {
  const res = await adminFetch<AdminCollection[]>("/admin/collections");
  return res.data ?? [];
}

export async function createAdminCollection(
  payload: AdminCollectionPayload
): Promise<AdminCollection> {
  const res = await adminFetch<AdminCollection>("/admin/collections", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data as AdminCollection;
}

export async function updateAdminCollection(
  id: string,
  payload: Partial<AdminCollectionPayload>
): Promise<AdminCollection> {
  const res = await adminFetch<AdminCollection>(
    `/admin/collections/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
  return res.data as AdminCollection;
}

export async function deleteAdminCollection(id: string): Promise<void> {
  await adminFetch(`/admin/collections/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// ── E. Custom Shoe Commissions ───────────────────────────────────────────────

export async function getAdminCustomOrders(params?: {
  status?: CustomOrderCommissionStatus | "ALL";
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ApiEnvelope<AdminCustomOrder[]>> {
  const qs = new URLSearchParams();
  if (params?.status && params.status !== "ALL") {
    qs.set("status", params.status);
  }
  if (params?.search) qs.set("search", params.search);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const q = qs.toString();
  return adminFetch<AdminCustomOrder[]>(
    `/admin/custom-orders${q ? `?${q}` : ""}`
  );
}

export async function getAdminCustomOrderById(
  id: string
): Promise<AdminCustomOrder> {
  const res = await adminFetch<AdminCustomOrder>(
    `/admin/custom-orders/${encodeURIComponent(id)}`
  );
  return res.data as AdminCustomOrder;
}

export async function updateAdminCustomOrder(
  id: string,
  payload: UpdateCustomOrderPayload
): Promise<AdminCustomOrder> {
  const res = await adminFetch<AdminCustomOrder>(
    `/admin/custom-orders/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
  return res.data as AdminCustomOrder;
}

// ── F. Enquiries ─────────────────────────────────────────────────────────────

export async function getAdminEnquiries(params?: {
  subject?: string;
  status?: EnquiryStatus | "ALL";
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ApiEnvelope<AdminEnquiry[]>> {
  const qs = new URLSearchParams();
  if (params?.subject && params.subject !== "ALL") {
    qs.set("subject", params.subject);
  }
  if (params?.status && params.status !== "ALL") {
    qs.set("status", params.status);
  }
  if (params?.search) qs.set("search", params.search);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const q = qs.toString();
  return adminFetch<AdminEnquiry[]>(`/admin/enquiries${q ? `?${q}` : ""}`);
}

export async function updateAdminEnquiry(
  id: string,
  payload: { status: EnquiryStatus; conciergeNotes?: string }
): Promise<AdminEnquiry> {
  const res = await adminFetch<AdminEnquiry>(
    `/admin/enquiries/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
  return res.data as AdminEnquiry;
}

// ── G. Newsletter ────────────────────────────────────────────────────────────

export async function getAdminNewsletter(
  page = 1,
  limit = 20
): Promise<ApiEnvelope<NewsletterSubscriber[]>> {
  return adminFetch<NewsletterSubscriber[]>(
    `/admin/newsletter?page=${page}&limit=${limit}`
  );
}

export function getAdminNewsletterCsvUrl(): string {
  return `${API_BASE_URL}/admin/newsletter?format=csv`;
}

// ── H. Shipping Settings ─────────────────────────────────────────────────────

export async function getAdminShippingSettings(): Promise<ShippingSettings> {
  const res = await adminFetch<ShippingSettings>("/admin/settings/shipping");
  return res.data as ShippingSettings;
}

export async function updateAdminShippingSettings(
  payload: ShippingSettings
): Promise<ShippingSettings> {
  const res = await adminFetch<ShippingSettings>("/admin/settings/shipping", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return res.data as ShippingSettings;
}

// ── I. Users & Staff Management ──────────────────────────────────────────────

export async function getAdminUsers(
  filters: AdminUsersFilter = {}
): Promise<ApiEnvelope<StaffMember[]>> {
  const qs = new URLSearchParams();
  if (filters.role && filters.role !== "ALL") {
    qs.set("role", filters.role);
  }
  if (filters.isActive && filters.isActive !== "ALL") {
    qs.set("isActive", filters.isActive);
  }
  if (filters.search?.trim()) {
    qs.set("search", filters.search.trim());
  }
  if (filters.page) qs.set("page", String(filters.page));
  if (filters.limit) qs.set("limit", String(filters.limit));

  const q = qs.toString();
  return adminFetch<StaffMember[]>(`/admin/users${q ? `?${q}` : ""}`);
}

export async function getAdminStaff(): Promise<StaffMember[]> {
  const res = await adminFetch<StaffMember[]>("/admin/staff");
  return res.data ?? [];
}

export async function createAdminStaff(
  payload: CreateStaffPayload
): Promise<StaffMember> {
  const res = await adminFetch<StaffMember>("/admin/staff", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data as StaffMember;
}
