import { useEffect, useRef } from "react";
import { formatMoney } from "../lib/money";
import { useWishlistStore } from "../store/wishlistStore";
import { CloseIcon } from "./Icons";

export function WishlistDrawer() {
  const items = useWishlistStore((state) => state.items);
  const isOpen = useWishlistStore((state) => state.isOpen);
  const close = useWishlistStore((state) => state.close);
  const remove = useWishlistStore((state) => state.remove);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-black/40"
        aria-label="Close wishlist"
        onClick={close}
      />
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Wishlist"
      >
        <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="text-lg font-semibold">Wishlist</h2>
          <button
            type="button"
            className="cursor-pointer"
            ref={closeRef}
            aria-label="Close wishlist"
            onClick={close}
          >
            <CloseIcon />
          </button>
        </header>
        {items.length === 0 ? (
          <div className="grid flex-1 place-items-center px-6 text-center">
            <div>
              <p className="text-lg font-semibold">Nothing saved yet</p>
              <p className="mt-2 text-sm text-neutral-500">
                Tap the heart on a product to keep it here.
              </p>
              <button
                type="button"
                className="mt-5 h-11 cursor-pointer rounded-lg bg-black px-5 text-sm text-white"
                onClick={close}
              >
                Continue shopping
              </button>
            </div>
          </div>
        ) : (
          <ul className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-3">
                <img
                  src={item.image}
                  alt=""
                  className="h-24 w-20 rounded-lg bg-canvas object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="mt-1 text-sm">{formatMoney(item.price)}</p>
                  <button
                    type="button"
                    className="mt-2 text-xs cursor-pointer text-neutral-500 underline"
                    onClick={() => remove(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
