import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;         // variantId
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image?: string;
  brand: string;
  variantName?: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (variantId: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (variantId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const exists = state.items.find((i) => i.variantId === newItem.variantId);
          if (exists) return state;
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        }));
      },

      toggleItem: (item) => {
        const exists = get().items.find((i) => i.variantId === item.variantId);
        if (exists) {
          get().removeItem(item.variantId);
        } else {
          get().addItem(item);
        }
      },

      isInWishlist: (variantId) => {
        return get().items.some((i) => i.variantId === variantId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'typec-wishlist-storage',
    }
  )
);
