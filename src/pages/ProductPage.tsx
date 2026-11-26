import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "../api/product";
import { CartDrawer } from "../components/CartDrawer";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ProductGallery } from "../components/ProductGallery";
import { ProductInfo } from "../components/ProductInfo";
import { ProductRail, type RailItem } from "../components/ProductRail";
import { PromoBar } from "../components/PromoBar";
import { Reviews } from "../components/Reviews";
import { Toast } from "../components/Toast";
import { WishlistDrawer } from "../components/WishlistDrawer";
import { track } from "../lib/analytics";
import {
  defaultSelections,
  findVariant,
  galleryImages,
  isOptionAvailable,
  isVariantPurchasable,
  labelize,
  maxQuantity,
  missingSelections,
  normalizeReviews,
  quotePrice,
} from "../lib/product";
import { useCartStore } from "../store/cartStore";
import { useUiStore } from "../store/uiStore";
import { useWishlistStore } from "../store/wishlistStore";
import type { Product, SelectionMap } from "../types/product";

export function ProductPage() {
  const query = useQuery({
    queryKey: ["product"],
    queryFn: ({ signal }) => fetchProduct(signal),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div id="top" className="min-h-screen bg-white text-ink">
      <a
        href="#buy-box"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to product
      </a>
      {query.isPending ? <LoadingState /> : null}
      {query.isError ? (
        <ErrorState onRetry={() => void query.refetch()} />
      ) : null}
      {query.data ? <ProductView product={query.data} /> : null}
      <CartDrawer />
      <WishlistDrawer />
      <Toast />
    </div>
  );
}

function ProductView({ product }: { product: Product }) {
  const [selections, setSelections] = useState<SelectionMap>(() =>
    defaultSelections(product),
  );
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [search, setSearch] = useState("");
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useUiStore((state) => state.showToast);
  const toggleWish = useWishlistStore((state) => state.toggle);
  const wished = useWishlistStore((state) =>
    state.items.some((item) => item.productId === product.id),
  );

  const variant = useMemo(
    () => findVariant(product, selections),
    [product, selections],
  );
  const quote = useMemo(() => quotePrice(product, variant), [product, variant]);
  const images = useMemo(
    () => galleryImages(product, selections.color),
    [product, selections.color],
  );
  const limit = maxQuantity(product, variant);
  if (limit > 0 && quantity > limit) {
    setQuantity(limit);
  }
  const inStock = variant
    ? isVariantPurchasable(product, variant)
    : isVariantPurchasable(product, null);
  const reviews = useMemo(
    () => normalizeReviews(product.reviews),
    [product.reviews],
  );

  useEffect(() => {
    document.title = product.name;
    track("view_item", { productId: product.id, name: product.name });
  }, [product]);

  function onSelect(variation: string, value: string) {
    setSelections((current) => {
      const next: SelectionMap = { ...current, [variation]: value };
      for (const other of product.variations) {
        if (other.name === variation || !next[other.name]) continue;
        const base: SelectionMap = { ...next };
        delete base[other.name];
        if (isOptionAvailable(product, base, other.name, next[other.name]))
          continue;
        const replacement = other.props.find((prop) =>
          isOptionAvailable(product, base, other.name, prop.name),
        );
        if (replacement) next[other.name] = replacement.name;
        else delete next[other.name];
      }
      return next;
    });
    setError(null);
    setQuantity(1);
  }

  function addToCart() {
    const missing = missingSelections(product, selections);
    if (missing.length > 0) {
      setError(`Please choose ${missing.map(labelize).join(" and ")}`);
      return;
    }
    if (product.variations.length > 0 && !variant) {
      setError("That combination is unavailable");
      return;
    }
    if (!isVariantPurchasable(product, variant)) {
      setError("This option is out of stock");
      return;
    }
    const cap = maxQuantity(product, variant);
    addItem({
      id: variant?.id ?? product.id,
      productId: product.id,
      variantId: variant?.id ?? product.id,
      name: product.name,
      image: images[0] || product.thumb,
      unitPrice: quote.current,
      quantity: Math.min(quantity, cap),
      maxQuantity: cap,
      selections: { ...selections },
    });
    setAdded(true);
    showToast("Added to cart");
    track("add_to_cart", {
      productId: product.id,
      variantId: variant?.id ?? product.id,
      quantity,
    });
    window.setTimeout(() => setAdded(false), 1600);
  }

  function onWish() {
    toggleWish({
      productId: product.id,
      name: product.name,
      image: images[0] || product.thumb,
      price: quote.current,
    });
    showToast(wished ? "Removed from wishlist" : "Saved to wishlist");
  }

  const needle = search.trim().toLowerCase();
  const colorways = colorwayItems(product, quote.current).filter((item) =>
    matches(item, needle),
  );
  const categories = categoryItems(product).filter((item) =>
    matches(item, needle),
  );

  return (
    <>
      <PromoBar hours={product.fake_timer_hours || 1} />
      <Header
        categories={product.categories}
        query={search}
        onQuery={setSearch}
      />
      <main>
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 lg:px-0 lg:py-8 ">
          <div>
            <Breadcrumb product={product} />
            <div className="mt-4">
              <ProductGallery
                images={images}
                name={product.name}
                wished={wished}
                onWish={onWish}
              />
            </div>
          </div>
          <ProductInfo
            product={product}
            selections={selections}
            quantity={quantity}
            quote={quote}
            limit={Math.max(limit, 1)}
            inStock={inStock}
            error={error}
            added={added}
            onSelect={onSelect}
            onQuantity={(next) =>
              setQuantity(Math.min(Math.max(1, next), Math.max(limit, 1)))
            }
            onAdd={addToCart}
            onBuyNow={addToCart}
          />
        </div>
        <hr className="mx-auto mt-10 max-w-[1200px] dashed-bottom-border h-1 border-0 " />
        {needle && colorways.length === 0 && categories.length === 0 ? (
          <p className="mx-auto mt-10 mb-2 max-w-[1200px] px-4 text-sm text-neutral-500">
            No matches for “{search.trim()}”.
          </p>
        ) : null}
        <ProductRail title="Related Product" items={colorways} />
        <hr className="mx-auto mt-14   max-w-[1200px] dashed-bottom-border h-1 border-0 " />
        <Reviews reviews={reviews} />
        <hr className="mx-auto mt-14   max-w-[1200px] dashed-bottom-border h-1 border-0 " />
        <ProductRail
          id="popular"
          title="Popular this week"
          items={categories}
        />
      </main>
      <Footer />
    </>
  );
}

function Breadcrumb({ product }: { product: Product }) {
  const crumbs = [
    "Homepage",
    ...product.categories.slice(0, 2).map((category) => category.name),
    product.name,
  ];
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
        {crumbs.map((crumb, index) => (
          <li
            key={`${crumb}-${index}`}
            className={
              index === crumbs.length - 1 ? "font-medium text-ink" : undefined
            }
          >
            {index > 0 ? (
              <span className="mr-2 text-neutral-300">›</span>
            ) : null}
            {index === 0 ? <a href="#top">{crumb}</a> : crumb}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function colorwayItems(product: Product, price: number): RailItem[] {
  const colors = product.variations.find(
    (variation) => variation.type === "image",
  );
  return (colors?.props ?? [])
    .filter((prop) => prop.value)
    .map((prop) => ({
      id: prop.id,
      image: prop.value as string,
      brand: product.categories[0]?.name ?? "Achilles",
      name: `${product.name} · ${labelize(prop.name)}`,
      price,
    }));
}

function categoryItems(product: Product): RailItem[] {
  return product.categories
    .filter((category) => category.thumb)
    .map((category) => ({
      id: category.id,
      image: category.thumb as string,
      brand: "Shop",
      name: category.name,
    }));
}

function matches(item: RailItem, needle: string): boolean {
  if (!needle) return true;
  return `${item.brand} ${item.name}`.toLowerCase().includes(needle);
}

function LoadingState() {
  return (
    <div className="mx-auto grid max-w-[1200px] animate-pulse gap-8 px-4 py-10 lg:grid-cols-2 lg:px-0">
      <div className="aspect-[4/5] rounded-2xl bg-neutral-100 sm:aspect-[5/4]" />
      <div className="space-y-4">
        <div className="h-4 w-24 rounded bg-neutral-100" />
        <div className="h-8 w-4/5 rounded bg-neutral-100" />
        <div className="h-8 w-40 rounded bg-neutral-100" />
        <div className="h-24 rounded bg-neutral-100" />
        <div className="h-12 rounded bg-neutral-100" />
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center" role="alert">
      <h1 className="text-2xl font-semibold">We couldn’t load this product</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Check the connection and try the product request again.
      </p>
      <button
        type="button"
        className="mt-6 h-11 rounded-lg bg-black px-5 text-sm text-white"
        onClick={onRetry}
      >
        Try again
      </button>
    </div>
  );
}
