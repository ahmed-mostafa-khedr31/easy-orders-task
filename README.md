# Easy Orders — Product Detail Page

product-detail frame in the Figma file (promo bar, masthead, gallery, buy box, related rail, reviews, popular rail, footer). Product content comes from the live Easy Orders API.

## Setup

Requirements: Node.js 20 or newer.

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173`.

API: `https://api.easy-orders.net/api/v1/products/slug/clear-theme/Sneakers12?join=reviews`

## Scripts

| Command           | What it does                                |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Vite dev server                             |
| `npm run build`   | Typecheck and production build              |
| `npm run preview` | Serve the production build                  |
| `npm test`        | Unit, component, and cart integration tests |
| `npm run lint`    | Oxlint                                      |

## Architecture

- `src/api/product.ts` loads the product with `fetch` and checks the payload shape.
- `src/pages/ProductPage.tsx` owns the React Query request, the selected variations, and the quantity.
- `src/lib/product.ts` is the pure layer: variant matching, unavailable combinations, sale price, stock, gallery order, and review normalization.
- `src/store/cartStore.ts` is a Zustand store wrapped with Immer. Adding, changing quantity, and removing items mutate a draft, then Immer commits the next state. `persist` writes the line items to `localStorage` under `easy-orders-cart`. The open/closed drawer flag is not persisted.
- `src/store/wishlistStore.ts` uses the same Immer + persist pattern.
- `src/store/uiStore.ts` holds the short confirmation toast, also updated with Immer.

Sale price rule: a variant `sale_price` of `0` means “no variant override”, so the product sale price is used. On this product that is EGP 160, down from EGP 190. Stock is treated as available when `track_stock` is false, which matches this payload (`quantity` is 0 but orders are still allowed).

The product endpoint does not return related products or reviews. Related cards are the real color photos from the payload. Popular cards are the real category thumbs. Reviews render the API list and show an empty state when `join=reviews` comes back empty.

## Components

| Component        | Role                                                                   |
| ---------------- | ---------------------------------------------------------------------- |
| `PromoBar`       | Offer strip and countdown seeded from `fake_timer_hours`               |
| `Header`         | Logo, category menu, search, account, wishlist, cart badge             |
| `ProductGallery` | Main image, thumbnails, hover zoom, lightbox, share, keyboard arrows   |
| `ProductInfo`    | Price, stock, tags, description, color and size, quantity, add to cart |
| `CartDrawer`     | Persistent cart: quantity, remove, subtotal, empty state               |
| `WishlistDrawer` | Saved products                                                         |
| `Reviews`        | Summary, rating filters, topics, list, paging                          |
| `ProductRail`    | Related colorways and category rail                                    |
| `Footer`         | Newsletter, link columns, social                                       |

## Deployment

```bash
npm run build
```

`dist/` is a static site. Set `VITE_PRODUCT_API` in the host’s environment before building.
