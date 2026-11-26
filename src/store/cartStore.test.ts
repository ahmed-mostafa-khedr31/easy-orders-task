import { beforeEach, describe, expect, it } from 'vitest'
import { cartCount, cartTotal, useCartStore, type CartItem } from './cartStore'

function item(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: 'variant-1',
    productId: 'product-1',
    variantId: 'variant-1',
    name: 'Achilles Pro',
    image: 'https://example.com/shoe.webp',
    unitPrice: 160,
    quantity: 1,
    maxQuantity: 4,
    selections: { color: 'brown', size: '38' },
    ...overrides,
  }
}

beforeEach(() => {
  localStorage.clear()
  useCartStore.persist.clearStorage()
  useCartStore.setState({ items: [], isOpen: false })
})

describe('cart store', () => {
  it('adds a line and opens the cart', () => {
    useCartStore.getState().addItem(item())
    const state = useCartStore.getState()
    expect(state.items).toHaveLength(1)
    expect(state.isOpen).toBe(true)
    expect(cartCount(state.items)).toBe(1)
    expect(cartTotal(state.items)).toBe(160)
  })

  it('merges quantity for the same variant and clamps to the maximum', () => {
    const { addItem } = useCartStore.getState()
    addItem(item({ quantity: 3 }))
    addItem(item({ quantity: 3 }))
    const [line] = useCartStore.getState().items
    expect(line.quantity).toBe(4)
    expect(cartTotal(useCartStore.getState().items)).toBe(640)
  })

  it('removes a line and updates the quantity', () => {
    useCartStore.getState().addItem(item())
    useCartStore.getState().setQuantity('variant-1', 3)
    expect(cartCount(useCartStore.getState().items)).toBe(3)
    useCartStore.getState().setQuantity('variant-1', 0)
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('keeps separate lines for different variants', () => {
    useCartStore.getState().addItem(item())
    useCartStore.getState().addItem(item({ id: 'variant-2', variantId: 'variant-2', unitPrice: 190, selections: { color: 'black', size: '40' } }))
    expect(cartCount(useCartStore.getState().items)).toBe(2)
    expect(cartTotal(useCartStore.getState().items)).toBe(350)
    useCartStore.getState().removeItem('variant-1')
    expect(useCartStore.getState().items.map((entry) => entry.id)).toEqual(['variant-2'])
  })
})
