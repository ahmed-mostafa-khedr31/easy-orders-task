import { formatMoney } from "../lib/money";

export interface RailItem {
  id: string;
  image: string;
  brand: string;
  name: string;
  price?: number;
}

export function ProductRail({
  id,
  title,
  items,
}: {
  id?: string;
  title: string;
  items: RailItem[];
}) {
  if (items.length === 0) return null;
  return (
    <section id={id} className="mx-auto mt-14 max-w-[1200px] px-4 lg:px-0">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[22px] font-bold">{title}</h2>
        <a
          href={`#${id ?? "top"}`}
          className="text-sm text-[#525252]! font-semibold! underline"
        >
          View All
        </a>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <li key={item.id}>
            <article>
              <div className="aspect-[3/4] overflow-hidden rounded-md bg-canvas">
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-3 text-xs text-neutral-500">{item.brand}</p>
              <h3 className="mt-1 line-clamp-2 text-sm font-semibold">
                {item.name}
              </h3>
              {item.price != null ? (
                <p className="mt-1 text-sm font-bold">
                  {formatMoney(item.price)}
                </p>
              ) : null}
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
