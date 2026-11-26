import { useEffect, useRef } from "react";
import { formatMoney } from "../lib/money";
import { labelize } from "../lib/product";
import { cartCount, cartTotal, useCartStore } from "../store/cartStore";
import { CloseIcon } from "./Icons";

export function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const clear = useCartStore((state) => state.clear);
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = cartCount(items);
  const total = cartTotal(items);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-black/40"
        aria-label="Close cart"
        onClick={closeCart}
      />
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
      >
        <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="text-lg font-semibold">
            Cart {count > 0 ? `(${count})` : ""}
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="cursor-pointer"
            aria-label="Close cart"
            onClick={closeCart}
          >
            <CloseIcon />
          </button>
        </header>
        {items.length === 0 ? (
          <div className="grid flex-1 place-items-center px-6 text-center">
            <div>
              <p className="text-lg font-semibold">Your cart is empty</p>
              <p className="mt-2 text-sm text-neutral-500">
                Choose a color and size, then add the pair you want.
              </p>
              <button
                type="button"
                className="mt-5 h-11 cursor-pointer rounded-lg bg-black px-5 text-sm text-white"
                onClick={closeCart}
              >
                Continue shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 border-b border-neutral-100 pb-4"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="h-24 w-20 rounded-lg bg-canvas object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-5">
                        {item.name}
                      </p>
                      <button
                        type="button"
                        className="text-xs cursor-pointer text-neutral-500 underline"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">
                      {Object.entries(item.selections)
                        .map(
                          ([key, value]) =>
                            `${labelize(key)} ${labelize(value)}`,
                        )
                        .join(" · ")}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-lg border border-neutral-200">
                        <button
                          type="button"
                          className="h-8 w-8"
                          aria-label={`Decrease ${item.name}`}
                          onClick={() =>
                            setQuantity(item.id, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="h-8 w-8"
                          aria-label={`Increase ${item.name}`}
                          onClick={() =>
                            setQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.maxQuantity}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-semibold">
                        {formatMoney(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="border-t border-neutral-200 px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span className="text-lg font-bold">{formatMoney(total)}</span>
              </div>
              <button
                type="button"
                className="mt-4 h-12 w-full cursor-pointer rounded-lg bg-black text-sm font-medium text-white"
              >
                Checkout Now
              </button>
              <button
                type="button"
                className="mt-2 h-10 w-full cursor-pointer text-sm text-neutral-500 underline"
                onClick={clear}
              >
                Clear cart
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
