// ============================================================
// Cart Store — Zustand with Composite Hash IDs
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, SelectedModifier } from "@/types";

interface CartActions {
  addItem: (item: Omit<CartItem, "cart_item_id" | "quantity">) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

interface CartState {
  items: CartItem[];
}

/**
 * Generates a deterministic hash from product_id + sorted modifier IDs + quantities.
 * This ensures items with different configurations occupy separate cart lines.
 */
function generateCartItemId(
  productId: string,
  modifiers: SelectedModifier[]
): string {
  const sorted = [...modifiers].sort((a, b) =>
    a.option_id.localeCompare(b.option_id)
  );
  const key = `${productId}::${sorted
    .map((m) => `${m.option_id}:${m.quantity}`)
    .join("|")}`;
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `${productId}-${Math.abs(hash).toString(36)}`;
}

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((s) => {
          const cartItemId = generateCartItemId(item.product_id, item.modifiers);
          const existing = s.items.find((i) => i.cart_item_id === cartItemId);

          if (existing) {
            return {
              items: s.items.map((i) =>
                i.cart_item_id === cartItemId
                  ? { ...i, quantity: i.quantity + 1, total_price: i.total_price + item.total_price }
                  : i
              ),
            };
          }

          return {
            items: [
              ...s.items,
              { ...item, cart_item_id: cartItemId, quantity: 1 },
            ],
          };
        }),

      removeItem: (cartItemId) =>
        set((s) => ({
          items: s.items.filter((i) => i.cart_item_id !== cartItemId),
        })),

      updateQuantity: (cartItemId, quantity) =>
        set((s) => {
          if (quantity <= 0) {
            return { items: s.items.filter((i) => i.cart_item_id !== cartItemId) };
          }
          return {
            items: s.items.map((i) => {
              if (i.cart_item_id !== cartItemId) return i;
              const unitPrice = i.total_price / i.quantity;
              return { ...i, quantity, total_price: unitPrice * quantity };
            }),
          };
        }),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((s, i) => s + i.total_price, 0),
    }),
    {
      name: "acai-cart",
    }
  )
);
