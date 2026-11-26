import type {
  NormalizedReview,
  PriceQuote,
  Product,
  ProductVariant,
  Review,
  SelectionMap,
} from '../types/product'

export function labelize(value: string): string {
  const known: Record<string, string> = { biege: 'Beige', beige: 'Beige' }
  const mapped = known[value.toLowerCase()]
  if (mapped) return mapped
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function isVariantPurchasable(product: Product, variant: ProductVariant | null): boolean {
  const quantity = variant ? variant.quantity : product.quantity
  if (!product.track_stock && !product.disable_orders_for_no_stock) return true
  if ((product.track_stock || product.disable_orders_for_no_stock) && quantity <= 0) return false
  return true
}

export function findVariant(product: Product, selections: SelectionMap): ProductVariant | null {
  const names = product.variations.map((variation) => variation.name)
  if (names.some((name) => !selections[name])) return null
  return (
    product.variants.find((variant) =>
      names.every((name) =>
        variant.variation_props.some(
          (prop) => prop.variation === name && prop.variation_prop === selections[name],
        ),
      ),
    ) ?? null
  )
}

export function isOptionAvailable(
  product: Product,
  selections: SelectionMap,
  variationName: string,
  optionName: string,
): boolean {
  const next: SelectionMap = { ...selections, [variationName]: optionName }
  const relevant = product.variants.filter((variant) =>
    Object.entries(next).every(
      ([key, value]) =>
        !value ||
        variant.variation_props.some((prop) => prop.variation === key && prop.variation_prop === value),
    ),
  )
  if (relevant.length === 0) return false
  return relevant.some((variant) => isVariantPurchasable(product, variant))
}

export function defaultSelections(product: Product): SelectionMap {
  const selections: SelectionMap = {}
  for (const variation of product.variations) {
    const match = variation.props.find((prop) =>
      isOptionAvailable(product, selections, variation.name, prop.name),
    )
    if (match) selections[variation.name] = match.name
  }
  return selections
}

export function missingSelections(product: Product, selections: SelectionMap): string[] {
  return product.variations.map((variation) => variation.name).filter((name) => !selections[name])
}

export function quotePrice(product: Product, variant: ProductVariant | null): PriceQuote {
  const productOnSale = product.sale_price > 0 && product.sale_price < product.price
  const fallback: PriceQuote = {
    current: productOnSale ? product.sale_price : product.price,
    compareAt: productOnSale ? product.price : null,
  }
  if (!variant) return fallback
  if (variant.sale_price > 0 && variant.sale_price < variant.price) {
    return { current: variant.sale_price, compareAt: variant.price }
  }
  if (variant.price > 0 && variant.price !== product.price) {
    return { current: variant.price, compareAt: null }
  }
  return fallback
}

export function maxQuantity(product: Product, variant: ProductVariant | null): number {
  if (!isVariantPurchasable(product, variant)) return 0
  if (!product.track_stock) return 10
  return Math.max(0, variant ? variant.quantity : product.quantity)
}

export function galleryImages(product: Product, color?: string): string[] {
  const urls: string[] = []
  const colorVariation = product.variations.find((variation) => variation.name === 'color')
  const selected = colorVariation?.props.find((prop) => prop.name === color)
  if (selected?.value) urls.push(selected.value)
  if (product.thumb) urls.push(product.thumb)
  for (const image of product.images ?? []) urls.push(image)
  for (const prop of colorVariation?.props ?? []) {
    if (prop.value) urls.push(prop.value)
  }
  return [...new Set(urls.filter(Boolean))]
}

export function normalizeReviews(reviews: Review[] | null | undefined): NormalizedReview[] {
  if (!reviews?.length) return []
  return reviews.map((review, index) => {
    const body = review.comment || review.body || review.review || ''
    return {
      id: review.id || `review-${index}`,
      author: review.author || review.name || review.user_name || 'Customer',
      rating: Math.max(0, Math.min(5, Number(review.rating ?? review.rate ?? 0))),
      title: review.title || body.slice(0, 80) || 'Review',
      body,
      createdAt: review.created_at || '',
      likes: review.likes ?? 0,
    }
  })
}

export function selectionSummary(selections: SelectionMap): string {
  return Object.entries(selections)
    .filter(([, value]) => value)
    .map(([key, value]) => `${labelize(key)}: ${labelize(value)}`)
    .join(' · ')
}
