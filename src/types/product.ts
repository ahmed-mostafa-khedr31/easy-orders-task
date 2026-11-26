export interface VariationProp {
  id: string
  name: string
  variation_id: string
  value?: string
}

export interface Variation {
  id: string
  name: string
  product_id: string
  type: string
  props: VariationProp[]
}

export interface VariantPropLink {
  id: string
  variation: string
  variation_prop: string
  product_variant_id: string
}

export interface ProductVariant {
  id: string
  product_id: string
  price: number
  sale_price: number
  quantity: number
  variation_props: VariantPropLink[]
}

export interface Category {
  id: string
  name: string
  slug: string
  thumb?: string | null
}

export interface Review {
  id?: string
  name?: string
  author?: string
  user_name?: string
  rating?: number
  rate?: number
  comment?: string
  body?: string
  review?: string
  title?: string
  created_at?: string
  likes?: number
}

export interface Product {
  id: string
  name: string
  price: number
  sale_price: number
  description: string
  slug: string
  thumb: string
  images: string[]
  quantity: number
  track_stock: boolean
  disable_orders_for_no_stock: boolean
  buy_now_text?: string
  fake_timer_hours?: number
  variations: Variation[]
  variants: ProductVariant[]
  categories: Category[]
  reviews?: Review[] | null
}

export type SelectionMap = Record<string, string>

export interface PriceQuote {
  current: number
  compareAt: number | null
}

export interface NormalizedReview {
  id: string
  author: string
  rating: number
  title: string
  body: string
  createdAt: string
  likes: number
}
