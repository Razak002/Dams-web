export interface CheckoutCustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  deliveryNotes?: string;
  paymentMethod: "paystack" | "whatsapp";
}

export interface CartValidateItem {
  productId: string;
  size: number;
  colour: string;
  quantity: number;
}

export interface CartValidatedItemResult {
  productId: string;
  size: number;
  availableStock: number;
  currentPrice: number;
  isAvailable: boolean;
}

export interface CartValidateResponse {
  status: "success" | "error";
  valid: boolean;
  items: CartValidatedItemResult[];
  message?: string;
}

export interface ShippingRatesResponse {
  status: "success" | "error";
  message?: string;
  data?: {
    state: string;
    shippingFee: number;
    freeShippingThreshold: number;
    isComplimentary: boolean;
    estimatedDelivery: string;
  };
}

export interface InitializeCheckoutPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
  };
  items: CartValidateItem[];
}

export interface InitializeCheckoutResponse {
  status: "success" | "error";
  message?: string;
  errors?: Record<string, string[]>;
  data?: {
    orderId: string;
    reference: string;
    authorizationUrl: string;
    subtotal: number;
    shippingFee: number;
    totalAmount: number;
    status: "PENDING" | string;
  };
}

export interface OrderTimelineEntry {
  stage: string;
  label: string;
  completedAt?: string;
  note?: string;
}

export interface OrderItemSummary {
  productId: string;
  slug?: string;
  name: string;
  size: number;
  colour: string;
  quantity: number;
  unitPrice: number;
}

export interface VerifyOrderResponse {
  status: "PAID" | "PENDING" | "FAILED" | "success" | "failed" | "pending";
  orderId: string;
  reference: string;
  fulfilmentIssue?: string | null;
  items: OrderItemSummary[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  timeline?: OrderTimelineEntry[];
  message?: string;
}

export interface OrderTrackingResponse {
  status: "success" | "error";
  message?: string;
  data?: {
    orderId: string;
    status: string;
    timeline: OrderTimelineEntry[];
    trackingNote?: string;
  };
}

export interface PatronOrdersResponse {
  status: "success" | "error";
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data?: VerifyOrderResponse[];
}

export interface EnquiryPayload {
  fullName: string;
  email: string;
  phone: string;
  subject: "sizing" | "bespoke" | "order-status" | "wholesale" | "general";
  message: string;
}

export interface EnquiryResponse {
  status: "success" | "error";
  message: string;
  ticketId?: string;
  errors?: Record<string, string[]>;
}

export interface CustomShoeOrderPayload {
  description: string;
  preferredMaterial: string;
  size: number;
  budgetNGN: number;
  locationState: string;
  locationCity: string;
  fullName: string;
  email: string;
  phone: string;
  sampleImageName?: string;
}

export interface CustomShoeOrderResponse {
  status: "success" | "error";
  message: string;
  referenceId?: string;
  errors?: Record<string, string[]>;
}

export type CustomOrderCommissionStatus =
  | "NEW"
  | "REVIEWING"
  | "QUOTED"
  | "IN_PRODUCTION"
  | "READY_FOR_DISPATCH"
  | "DELIVERED"
  | "DECLINED";

export interface CustomOrderTrackingData {
  referenceId: string;
  commissionStatus: CustomOrderCommissionStatus;
  description: string;
  preferredMaterial: string;
  size: number;
  budgetNGN: number;
  quotedPriceNGN?: number;
  workshopNotes?: string;
  sampleImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomOrderTrackingResponse {
  status: "success" | "error";
  message?: string;
  data?: CustomOrderTrackingData;
}

export interface NewsletterSubscribeResponse {
  status: "success" | "error";
  message: string;
}
