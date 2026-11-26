import { describe, expect, it } from 'vitest'
import { defaultSelections, findVariant, isOptionAvailable, missingSelections, quotePrice } from './product'
import type { Product } from '../types/product'

const product: Product = {
  id: 'p1',
  name: 'Achilles Pro',
  price: 190,
  sale_price: 160,
  description: '<p>Leather</p>',
  slug: 'Sneakers12',
  thumb: 'thumb.webp',
  images: ['gallery.webp'],
  quantity: 0,
  track_stock: false,
  disable_orders_for_no_stock: false,
  variations: [
    {
      id: 'color',
      name: 'color',
      product_id: 'p1',
      type: 'image',
      props: [
        { id: 'c1', name: 'brown', variation_id: 'color', value: 'brown.webp' },
        { id: 'c2', name: 'black', variation_id: 'color', value: 'black.webp' },
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
      id: 'v-brown-38',
      product_id: 'p1',
      price: 190,
      sale_price: 0,
      quantity: 0,
      variation_props: [
        { id: '1', variation: 'color', variation_prop: 'brown', product_variant_id: 'v-brown-38' },
        { id: '2', variation: 'size', variation_prop: '38', product_variant_id: 'v-brown-38' },
      ],
    },
    {
      id: 'v-black-40',
      product_id: 'p1',
      price: 210,
      sale_price: 180,
      quantity: 2,
      variation_props: [
        { id: '3', variation: 'color', variation_prop: 'black', product_variant_id: 'v-black-40' },
        { id: '4', variation: 'size', variation_prop: '40', product_variant_id: 'v-black-40' },
      ],
    },
  ],
  categories: [],
}

describe('product variations', () => {
  it('uses the product sale price when a variant does not override it', () => {
    const variant = findVariant(product, { color: 'brown', size: '38' })
    expect(quotePrice(product, variant)).toEqual({ current: 160, compareAt: 190 })
  })

  it('uses a variant sale price when one is set', () => {
    const variant = findVariant(product, { color: 'black', size: '40' })
    expect(quotePrice(product, variant)).toEqual({ current: 180, compareAt: 210 })
  })

  it('disables combinations that do not exist', () => {
    expect(isOptionAvailable(product, { color: 'black' }, 'size', '38')).toBe(false)
    expect(isOptionAvailable(product, { color: 'black' }, 'size', '40')).toBe(true)
    expect(isOptionAvailable(product, { size: '38' }, 'color', 'black')).toBe(false)
  })

  it('reports missing choices and picks a valid default', () => {
    expect(missingSelections(product, { color: 'brown' })).toEqual(['size'])
    expect(defaultSelections(product)).toEqual({ color: 'brown', size: '38' })
  })

  it('treats a tracked-out variant as unavailable', () => {
    const tracked: Product = {
      ...product,
      track_stock: true,
      variants: product.variants.map((variant) =>
        variant.id === 'v-black-40' ? { ...variant, quantity: 0 } : { ...variant, quantity: 3 },
      ),
    }
    expect(isOptionAvailable(tracked, {}, 'color', 'black')).toBe(false)
    expect(isOptionAvailable(tracked, {}, 'color', 'brown')).toBe(true)
  })
})
