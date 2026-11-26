import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  productId: string
  name: string
  image: string
  price: number
}

interface WishlistState {
  items: WishlistItem[]
  isOpen: boolean
  toggle: (item: WishlistItem) => void
  remove: (productId: string) => void
  open: () => void
  close: () => void
  has: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    immer((set, get) => ({
      items: [],
      isOpen: false,
      has: (productId) => get().items.some((item) => item.productId === productId),
      toggle: (item) =>
        set((state) => {
          const index = state.items.findIndex((entry) => entry.productId === item.productId)
          if (index >= 0) state.items.splice(index, 1)
          else state.items.push(item)
        }),
      remove: (productId) =>
        set((state) => {
          state.items = state.items.filter((item) => item.productId !== productId)
        }),
      open: () =>
        set((state) => {
          state.isOpen = true
        }),
      close: () =>
        set((state) => {
          state.isOpen = false
        }),
    })),
    {
      name: 'easy-orders-wishlist',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
