import type { Product } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ProductOnCart extends Product {
  quantity: number;
}

type State = {
  cart: ProductOnCart[];
};

type Actions = {
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: string) => void;
  clearCart: () => void;
};

export const useCartContext = create(
  persist<State & Actions>(
    (set, get) => ({
      cart: [],
      addToCart: async (product) => {
        set({ cart: [...get().cart, { ...product, quantity: 1 }] });
      },
      removeFromCart: async (productId) => {
        set({ cart: get().cart.filter((p) => p.id !== productId) });
      },
      updateQuantity: async (productId, quantity) => {
        set({
          cart: get().cart.map((oldData) =>
            oldData.id === productId ? { ...oldData, quantity: Number.parseInt(quantity) } : oldData
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
