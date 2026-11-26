import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  variantId: string
  name: string
  image: string
  unitPrice: number
  quantity: number
  maxQuantity: number
  selections: Record<string, string>
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    immer((set) => ({
      items: [],
      isOpen: false,
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((entry) => entry.id === item.id)
          if (existing) {
            existing.quantity = Math.min(existing.maxQuantity, existing.quantity + item.quantity)
            existing.unitPrice = item.unitPrice
            existing.maxQuantity = item.maxQuantity
            existing.image = item.image
          } else {
            state.items.push({ ...item, selections: { ...item.selections } })
          }
          state.isOpen = true
        }),
      removeItem: (id) =>
        set((state) => {
          state.items = state.items.filter((entry) => entry.id !== id)
        }),
      setQuantity: (id, quantity) =>
        set((state) => {
          const item = state.items.find((entry) => entry.id === id)
          if (!item) return
          if (quantity <= 0) {
            state.items = state.items.filter((entry) => entry.id !== id)
            return
          }
          item.quantity = Math.min(item.maxQuantity, quantity)
        }),
      clear: () =>
        set((state) => {
          state.items = []
        }),
      openCart: () =>
        set((state) => {
          state.isOpen = true
        }),
      closeCart: () =>
        set((state) => {
          state.isOpen = false
        }),
    })),
    {
      name: 'easy-orders-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

export function cartCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0)
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity * item.unitPrice, 0)
}
