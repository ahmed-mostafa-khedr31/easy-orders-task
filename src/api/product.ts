import type { Product } from '../types/product'

export const PRODUCT_ENDPOINT =
  import.meta.env.VITE_PRODUCT_API ??
  'https://api.easy-orders.net/api/v1/products/slug/clear-theme/Sneakers12?join=reviews'

export async function fetchProduct(signal?: AbortSignal): Promise<Product> {
  const response = await fetch(PRODUCT_ENDPOINT, { signal })
  if (!response.ok) {
    throw new Error(`Product request failed (${response.status})`)
  }
  const data: unknown = await response.json()
  if (!data || typeof data !== 'object' || !('id' in data) || !('name' in data)) {
    throw new Error('Product response was not in the expected shape')
  }
  return data as Product
}
