import type { Product } from "@/types/product";

export type UserRole =
  | "CUSTOMER"
  | "SUPER_ADMIN"
  | "WORKSHOP_MANAGER"
  | "CONCIERGE";

export interface PatronUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: UserRole;
  permissions?: string[];
  preferredEuSize: number | null;
  defaultAddress: string;
  city: string;
  state: string;
}

export interface RegisterPatronPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPatronPayload {
  email: string;
  password: string;
}

export interface UpdatePatronProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  defaultAddress?: string;
  city?: string;
  state?: string;
  preferredEuSize?: number | null;
}

export interface AuthResponse {
  status: "success" | "error";
  message?: string;
  errors?: Record<string, string[]>;
  data?: {
    token: string;
    user: PatronUser;
  };
}

export interface WishlistResponse {
  status: "success" | "error";
  message?: string;
  data?: Product[];
}
