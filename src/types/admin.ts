import type { UserRole } from "@/types/auth";
import type {
  CustomOrderCommissionStatus,
  OrderTimelineEntry,
} from "@/types/order";
import type {
  Collection,
  Product,
  ProductCategory,
  ProductSizeVariant,
} from "@/types/product";

export interface ApiEnvelope<T> {
  status: "success" | "error";
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data?: T;
}

// ── A. Overview & Analytics ──────────────────────────────────────────────────

export interface LowStockAlert {
  productId: string;
  name: string;
  slug: string;
  lowSizes: { size: number; stock: number }[];
}

export interface TopSilhouetteStat {
  productId: string;
  name: string;
  slug: string;
  unitsSold: number;
  revenueNGN: number;
}

export interface SalesByStateStat {
  state: string;
  ordersCount: number;
  revenueNGN: number;
}

export interface AnalyticsOverview {
  totalRevenueNGN: number;
  paidOrdersCount: number;
  ordersCount: number;
  pendingCustomCommissions: number;
  lowStockAlerts: LowStockAlert[];
  ordersByStatus: Record<string, number>;
  topSilhouettes: TopSilhouetteStat[];
  salesByState: SalesByStateStat[];
}

// ── B. Orders & Dispatch ─────────────────────────────────────────────────────

export type AdminOrderStatus =
  | "PENDING"
  | "PAID"
  | "IN_WORKSHOP"
  | "DISPATCHED"
  | "DELIVERED"
  | "CANCELLED"
  | "FAILED";

export type FulfilmentIssue =
  | "STOCK_CONFLICT"
  | "REFUND_REQUIRED"
  | "AMOUNT_MISMATCH"
  | "PAID_AFTER_CANCEL"
  | null;

export interface AdminOrderItem {
  productId: string;
  slug?: string;
  name: string;
  size: number;
  colour: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface PaymentLogEntry {
  event: string;
  reference?: string;
  amount?: number;
  note?: string;
  timestamp: string;
}

export interface AdminOrder {
  id: string;
  orderId: string;
  reference?: string;
  paymentReference?: string;
  paymentMethod: "paystack" | "whatsapp" | "walk-in";
  status: AdminOrderStatus;
  fulfilmentIssue: FulfilmentIssue;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
  };
  items: AdminOrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  dispatch?: {
    riderName?: string;
    riderPhone?: string;
    waybillNumber?: string;
    trackingNote?: string;
    dispatchedAt?: string;
  };
  riderName?: string;
  riderPhone?: string;
  waybillNumber?: string;
  trackingNote?: string;
  timeline: OrderTimelineEntry[];
  paymentLog?: PaymentLogEntry[];
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateOrderStatusPayload {
  status: AdminOrderStatus;
  riderName?: string;
  riderPhone?: string;
  waybillNumber?: string;
  trackingNote?: string;
}

export interface CreateManualOrderPayload {
  paymentMethod: "whatsapp" | "walk-in";
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
  };
  items: {
    productId: string;
    size: number;
    colour: string;
    quantity: number;
  }[];
  status: "PAID" | "IN_WORKSHOP" | "DELIVERED";
  trackingNote?: string;
}

// ── C. Products & Stock ──────────────────────────────────────────────────────

export interface StockHistoryEntry {
  id?: string;
  size: number;
  previousStock: number;
  newStock: number;
  changedBy: string;
  reason?: string;
  changedAt: string;
}

export interface AdminProduct extends Product {
  status?: "published" | "draft" | "archived";
  isPublished: boolean;
  isArchived?: boolean;
  salesCount?: number;
  stockHistory?: StockHistoryEntry[];
}

export interface AdminProductPayload {
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  category: ProductCategory;
  collectionSlug?: string;
  silhouette: string;
  origin: string;
  price: number;
  compareAtPrice?: number;
  isPublished: boolean;
  featured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  images: { url: string; alt: string; angle: string }[];
  colourways: { name: string; hex: string }[];
  materials: {
    upper: string;
    lining: string;
    sole: string;
    construction: string;
  };
  careInstructions: string[];
  sizes: ProductSizeVariant[];
}

export interface UpdateStockPayload {
  sizes: { size: number; stock: number }[];
  reason?: string;
}

// ── D. Collections ───────────────────────────────────────────────────────────

export interface AdminCollection extends Collection {
  sortOrder: number;
  isActive: boolean;
}

export interface AdminCollectionPayload {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  sortOrder: number;
  isActive: boolean;
}

// ── E. Custom Shoe Commissions ───────────────────────────────────────────────

export interface AdminCustomOrder {
  id: string;
  referenceId: string;
  commissionStatus: CustomOrderCommissionStatus;
  description: string;
  preferredMaterial: string;
  size: number;
  budgetNGN: number;
  quotedPriceNGN?: number;
  workshopNotes?: string;
  depositPaymentUrl?: string;
  sampleImageUrl?: string;
  fullName: string;
  email: string;
  phone: string;
  locationCity: string;
  locationState: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCustomOrderPayload {
  commissionStatus: CustomOrderCommissionStatus;
  quotedPriceNGN?: number;
  workshopNotes?: string;
  generateDepositLink?: boolean;
}

// ── F. Enquiries ─────────────────────────────────────────────────────────────

export type EnquiryStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export interface AdminEnquiry {
  id: string;
  ticketId: string;
  fullName: string;
  email: string;
  phone: string;
  subject: "sizing" | "bespoke" | "order-status" | "wholesale" | "general";
  message: string;
  status: EnquiryStatus;
  conciergeNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

// ── G. Newsletter ────────────────────────────────────────────────────────────

export interface NewsletterSubscriber {
  id: string;
  email: string;
  source: string;
  isActive: boolean;
  createdAt: string;
}

// ── H. Shipping Settings ─────────────────────────────────────────────────────

export interface StateShippingRate {
  state: string;
  fee: number;
  estimatedDelivery: string;
}

export interface ShippingSettings {
  freeShippingThreshold: number;
  defaultNationwideFee: number;
  defaultNationwideEta: string;
  stateRates: StateShippingRate[];
}

// ── I. Staff Management ──────────────────────────────────────────────────────

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  authProvider?: "local" | "google" | string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface AdminUsersFilter {
  role?: UserRole | "ALL";
  isActive?: "ALL" | "true" | "false";
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateStaffPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: Exclude<UserRole, "CUSTOMER">;
}
