import { useState } from "react";
import DOMPurify from "dompurify";
import { discountPercent, formatMoney } from "../lib/money";
import { isOptionAvailable, labelize } from "../lib/product";
import type { PriceQuote, Product, SelectionMap } from "../types/product";
import { CloseIcon } from "./Icons";

interface ProductInfoProps {
  product: Product;
  selections: SelectionMap;
  quantity: number;
  quote: PriceQuote;
  limit: number;
  inStock: boolean;
  error: string | null;
  added: boolean;
  onSelect: (variation: string, value: string) => void;
  onQuantity: (quantity: number) => void;
  onAdd: () => void;
  onBuyNow: () => void;
}

export function ProductInfo({
  product,
  selections,
  quantity,
  quote,
  limit,
  inStock,
  error,
  added,
  onSelect,
  onQuantity,
  onAdd,
  onBuyNow,
}: ProductInfoProps) {
  const [expanded, setExpanded] = useState(false);
  const [sizeChart, setSizeChart] = useState(false);
  const eyebrow = product.categories[0]?.name ?? "Achilles";
  const soldLabel = inStock ? "In stock" : "Out of stock";
  const off = discountPercent(quote.current, quote.compareAt);
  const description = DOMPurify.sanitize(product.description || "");

  return (
    <div id="buy-box">
      <p className="text-xs tracking-wide text-neutral-500">{eyebrow}</p>
      <h1 className="mt-1 text-[26px] font-bold leading-tight tracking-tight sm:text-[26px]">
        {product.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <p className="flex items-baseline gap-2">
          {quote.compareAt != null ? (
            <span className="text-sm text-neutral-400 line-through">
              {formatMoney(quote.compareAt)}
            </span>
          ) : null}
          <span className="text-[18px] font-bold leading-none">
            {formatMoney(quote.current)}
          </span>
          {off != null ? (
            <span className="text-sm font-semibold text-star">{off}% off</span>
          ) : null}
        </p>
        <p className="flex items-center gap-2 text-sm text-neutral-500">
          <span
            className={`h-2 w-2 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`}
          />
          {soldLabel}
        </p>
      </div>

      {product.categories.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {product.categories.map((category) => (
            <li
              key={category.id}
              className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600"
            >
              {category.name}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 border-t border-dashed border-neutral-200 pt-4">
        <h2 className="text-sm font-semibold">Description:</h2>
        <div
          id="product-description"
          className={`product-copy mt-2 text-sm leading-5 text-neutral-600 ${expanded ? "" : "max-h-27 overflow-hidden"}`}
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <button
          type="button"
          className="mt-1 lg:text-[14px]! cursor-pointer font-bold! "
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "See less" : "See More...."}
        </button>
      </div>

      <div className="mt-6 space-y-5">
        {product.variations.map((variation) => (
          <fieldset key={variation.id}>
            <legend className="flex w-full items-center justify-between text-sm">
              <span>
                <span className="text-neutral-500">
                  {labelize(variation.name)}:{" "}
                </span>
                <span className="font-semibold">
                  {selections[variation.name]
                    ? labelize(selections[variation.name])
                    : "Choose"}
                </span>
              </span>
              {variation.name === "size" ? (
                <button
                  type="button"
                  className="text-xs cursor-pointer text-[#525252]! font-semibold! underline"
                  onClick={() => setSizeChart(true)}
                >
                  View Size Chart
                </button>
              ) : null}
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {variation.props.map((prop) => {
                const selected = selections[variation.name] === prop.name;
                const available = isOptionAvailable(
                  product,
                  selections,
                  variation.name,
                  prop.name,
                );
                if (variation.type === "image" && prop.value) {
                  return (
                    <button
                      key={prop.id}
                      type="button"
                      aria-label={labelize(prop.name)}
                      aria-pressed={selected}
                      disabled={!available}
                      onClick={() => onSelect(variation.name, prop.name)}
                      className={`h-12 w-16 overflow-hidden rounded-lg border bg-canvas disabled:cursor-not-allowed disabled:opacity-40 ${selected ? "border-neutral-900 ring-2 ring-neutral-900 ring-offset-2" : "border-neutral-200"}`}
                    >
                      <img
                        src={prop.value}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                }
                return (
                  <button
                    key={prop.id}
                    type="button"
                    aria-pressed={selected}
                    disabled={!available}
                    onClick={() => onSelect(variation.name, prop.name)}
                    className={`h-8 min-w-16 rounded-lg border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40 disabled:line-through ${selected ? "border-[#000] bg-[#EBEBEB] font-semibold!" : "border-neutral-200 bg-white hover:border-neutral-400"}`}
                  >
                    {labelize(prop.name)}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-5">
        <p className="text-sm text-neutral-500">
          Quantity: <span className="font-semibold text-ink">{quantity}</span>
        </p>
        <div className="mt-2 inline-flex items-center gap-2">
          <button
            type="button"
            className="h-11 w-11 cursor-pointer rounded-lg border border-neutral-200"
            aria-label="Decrease quantity"
            onClick={() => onQuantity(quantity - 1)}
            disabled={quantity <= 1}
          >
            −
          </button>
          <span className="grid h-11 w-12 place-items-center rounded-lg border border-neutral-200 text-sm font-semibold">
            {quantity}
          </span>
          <button
            type="button"
            className="h-11 w-11 cursor-pointer rounded-lg border border-neutral-200"
            aria-label="Increase quantity"
            onClick={() => onQuantity(quantity + 1)}
            disabled={!inStock || quantity >= limit}
          >
            +
          </button>
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onAdd}
          disabled={!inStock}
          className="h-12 cursor-pointer rounded-lg bg-black text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {added ? "Added" : "Add To Cart"}
        </button>
        <button
          type="button"
          onClick={onBuyNow}
          disabled={!inStock}
          className="h-12 cursor-pointer rounded-lg border border-neutral-300 bg-white text-sm font-medium hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {product.buy_now_text || "Checkout Now"}
        </button>
      </div>
      <button
        type="button"
        className="mt-3 lg:mt-6 text-xs cursor-pointer text-[#7A7A7A]!   underline"
        onClick={() => setExpanded(true)}
      >
        Delivery T&C
      </button>

      {sizeChart ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-chart-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 id="size-chart-title" className="text-lg font-semibold">
                Size chart
              </h2>
              <button
                type="button"
                aria-label="Close size chart"
                onClick={() => setSizeChart(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-neutral-500">
                <tr>
                  <th className="py-2 font-medium">EU</th>
                  <th className="py-2 font-medium">UK</th>
                  <th className="py-2 font-medium">Foot length</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["38", "5", "24.0 cm"],
                  ["40", "6.5", "25.4 cm"],
                  ["42", "8", "26.7 cm"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-neutral-100">
                    {row.map((cell) => (
                      <td key={cell} className="py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
