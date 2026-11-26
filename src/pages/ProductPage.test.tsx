import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Product } from '../types/product'
import { useCartStore } from '../store/cartStore'
import { ProductPage } from './ProductPage'

const product: Product = {
  id: 'p1',
  name: 'Achilles Pro - Genuine Suede X Leather Sneakers',
  price: 190,
  sale_price: 160,
  description: '<p>Made with cowhide leather</p>',
  slug: 'Sneakers12',
  thumb: 'https://example.com/thumb.webp',
  images: ['https://example.com/gallery.webp'],
  quantity: 0,
  track_stock: false,
  disable_orders_for_no_stock: false,
  buy_now_text: 'Go To Checkout',
  fake_timer_hours: 1,
  variations: [
    {
      id: 'color',
      name: 'color',
      product_id: 'p1',
      type: 'image',
      props: [
        { id: 'c1', name: 'brown', variation_id: 'color', value: 'https://example.com/brown.webp' },
        { id: 'c2', name: 'black', variation_id: 'color', value: 'https://example.com/black.webp' },
      ],
    },
    {
      id: 'size',
      name: 'size',
      product_id: 'p1',
      type: 'button',
      props: [
        { id: 's1', name: '38', variation_id: 'size' },
        { id: 's2', name: '40', variation_id: 'size' },
      ],
    },
  ],
  variants: [
    {
      id: 'v1',
      product_id: 'p1',
      price: 190,
      sale_price: 0,
      quantity: 0,
      variation_props: [
        { id: 'a', variation: 'color', variation_prop: 'brown', product_variant_id: 'v1' },
        { id: 'b', variation: 'size', variation_prop: '38', product_variant_id: 'v1' },
      ],
    },
    {
      id: 'v2',
      product_id: 'p1',
      price: 190,
      sale_price: 0,
      quantity: 0,
      variation_props: [
        { id: 'c', variation: 'color', variation_prop: 'black', product_variant_id: 'v2' },
        { id: 'd', variation: 'size', variation_prop: '38', product_variant_id: 'v2' },
      ],
    },
    {
      id: 'v3',
      product_id: 'p1',
      price: 190,
      sale_price: 0,
      quantity: 0,
      variation_props: [
        { id: 'e', variation: 'color', variation_prop: 'brown', product_variant_id: 'v3' },
        { id: 'f', variation: 'size', variation_prop: '40', product_variant_id: 'v3' },
      ],
    },
    {
      id: 'v4',
      product_id: 'p1',
      price: 190,
      sale_price: 0,
      quantity: 0,
      variation_props: [
        { id: 'g', variation: 'color', variation_prop: 'black', product_variant_id: 'v4' },
        { id: 'h', variation: 'size', variation_prop: '40', product_variant_id: 'v4' },
      ],
    },
  ],
  categories: [{ id: 'cat', name: 'Mules', slug: 'sneakers', thumb: 'https://example.com/cat.webp' }],
  reviews: [],
}

function renderPage() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <ProductPage />
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
  useCartStore.persist.clearStorage()
  useCartStore.setState({ items: [], isOpen: false })
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => product,
    }),
  )
})

describe('product page cart flow', () => {
  it('loads the product, changes the size, and adds it to the cart', async () => {
    const user = userEvent.setup()
    renderPage()

    expect(await screen.findByRole('heading', { name: product.name })).toBeInTheDocument()
    expect(screen.getAllByText('EGP 160.00').length).toBeGreaterThan(0)
    expect(screen.getByText('EGP 190.00')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '40' }))
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
    await user.click(screen.getByRole('button', { name: 'Add To Cart' }))

    expect(await screen.findByRole('dialog', { name: 'Cart' })).toBeInTheDocument()
    expect(screen.getAllByText('EGP 320.00').length).toBeGreaterThan(0)
    const state = useCartStore.getState()
    expect(state.items[0]?.quantity).toBe(2)
    expect(state.items[0]?.selections.size).toBe('40')
    expect(state.items[0]?.unitPrice).toBe(160)
  })

  it('removes the line from the drawer', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByRole('heading', { name: product.name })
    await user.click(screen.getByRole('button', { name: 'Add To Cart' }))
    await user.click(await screen.findByRole('button', { name: 'Remove' }))
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    expect(useCartStore.getState().items).toHaveLength(0)
  })
})
