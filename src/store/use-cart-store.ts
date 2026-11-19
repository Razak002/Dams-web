"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/types/cart";
import { getCartItemKey } from "@/lib/utils";

interface AddToCartInput {
  productId: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  size: number;
  ukSize: number;
  colour: string;
  colourHex: string;
  image: string;
  quantity?: number;
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: AddToCartInput) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (input) => {
        const key = getCartItemKey(input.productId, input.size, input.colour);
        const addQty = input.quantity ?? 1;

        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.key === key);
          if (existingIndex > -1) {
            const updated = [...state.items];
            const current = updated[existingIndex];
            const nextQuantity = Math.min(
              current.quantity + addQty,
              current.maxStock
            );
            updated[existingIndex] = {
              ...current,
              quantity: nextQuantity,
            };
            return { items: updated, isOpen: true };
          }

          const newItem: CartItem = {
            key,
            productId: input.productId,
            slug: input.slug,
            name: input.name,
            subtitle: input.subtitle,
            price: input.price,
            size: input.size,
            ukSize: input.ukSize,
            colour: input.colour,
            colourHex: input.colourHex,
            image: input.image,
            quantity: Math.min(addQty, input.maxStock),
            maxStock: input.maxStock,
          };

          return {
            items: [...state.items, newItem],
            isOpen: true,
          };
        });
      },

      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter((item) => item.key !== key),
        })),

      updateQuantity: (key, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.key !== key),
            };
          }
          return {
            items: state.items.map((item) =>
              item.key === key
                ? { ...item, quantity: Math.min(quantity, item.maxStock) }
                : item
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
    }),
    {
      name: "dams-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
