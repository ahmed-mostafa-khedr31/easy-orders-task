import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cartCount, useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import type { Category } from "../types/product";
import { BagIcon, ChevronIcon, HeartIcon, SearchIcon, UserIcon } from "./Icons";
interface HeaderProps {
  categories: Category[];
  query: string;
  onQuery: (value: string) => void;
}

export function Header({ categories, query, onQuery }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const menuId = useId();
  const count = useCartStore((state) => cartCount(state.items));
  const openCart = useCartStore((state) => state.openCart);
  const closeWishlist = useWishlistStore((state) => state.close);
  const openWishlist = useWishlistStore((state) => state.open);
  const wishCount = useWishlistStore((state) => state.items.length);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-30  bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1200px]   dashed-bottom-border items-center gap-4 px-4 lg:px-0">
        <a href="#top" className="shrink-0 leading-none text-ink">
          <img src="/logo.png" alt="John Lewis" className="h-8 max-w-44" />
        </a>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {searchOpen ? (
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => onQuery(event.target.value)}
              placeholder="Search categories"
              aria-label="Search categories"
              className="h-10 w-36 rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:outline-none active:outline-none focus:border-none sm:w-56"
            />
          ) : null}
          <IconButton
            label="Search"
            onClick={() => setSearchOpen((open) => !open)}
          >
            <SearchIcon />
          </IconButton>

          <div className="relative hidden sm:block">
            <button
              type="button"
              className="inline-flex h-10 cursor-pointer items-center gap-1 rounded-lg px-2 text-sm hover:bg-neutral-50"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => {
                setMenuOpen((open) => !open);
                setAccountOpen(false);
              }}
            >
              Categories
              <ChevronIcon size={14} />
            </button>
            {menuOpen ? (
              <div
                id={menuId}
                className="absolute right-0 top-11 z-20 w-56 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg"
              >
                {categories.length === 0 ? (
                  <p className="px-2 py-2 text-sm text-neutral-500">
                    No categories
                  </p>
                ) : (
                  categories.map((category) => (
                    <a
                      key={category.id}
                      href="#popular"
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-neutral-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      {category.name}
                    </a>
                  ))
                )}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              className="inline-flex cursor-pointer h-10 items-center gap-1.5 rounded-lg px-2 text-sm hover:bg-neutral-50"
              aria-expanded={accountOpen}
              onClick={() => {
                setAccountOpen((open) => !open);
                setMenuOpen(false);
              }}
            >
              <UserIcon />
              <span className="hidden md:inline">Sign in</span>
            </button>
            {accountOpen ? (
              <div className="absolute right-0 top-11 z-20 w-44 rounded-xl border border-neutral-200 bg-white p-2 text-sm shadow-lg">
                <button
                  type="button"
                  className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left hover:bg-neutral-50"
                  onClick={() => {
                    setAccountOpen(false);
                    closeCartSafe();
                    openWishlist();
                  }}
                >
                  Wishlist{wishCount > 0 ? ` (${wishCount})` : ""}
                </button>
                <button
                  type="button"
                  className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left hover:bg-neutral-50"
                  onClick={() => {
                    setAccountOpen(false);
                    closeWishlist();
                    openCart();
                  }}
                >
                  Cart
                </button>
              </div>
            ) : null}
          </div>

          <IconButton
            label={`Wishlist${wishCount ? `, ${wishCount} saved` : ""}`}
            onClick={() => {
              closeCartSafe();
              openWishlist();
            }}
          >
            <HeartIcon filled={wishCount > 0} />
          </IconButton>

          <IconButton
            label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
            onClick={() => {
              closeWishlist();
              openCart();
            }}
          >
            <BagIcon />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-star px-1 text-[10px] font-semibold leading-4 text-white">
                {count}
              </span>
            ) : null}
          </IconButton>
        </div>
      </div>
    </header>
  );
}

function closeCartSafe() {
  useCartStore.getState().closeCart();
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-ink hover:bg-neutral-50"
    >
      {children}
    </button>
  );
}
