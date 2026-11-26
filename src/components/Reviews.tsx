import { useMemo, useState } from "react";
import type { NormalizedReview } from "../types/product";
import { Stars } from "./Stars";
import { ChevronIcon, ThumbIcon } from "./Icons";

const topics = [
  "Product Quality",
  "Seller Services",
  "Product Price",
  "Shipment",
  "Match with Description",
];
const pageSize = 3;

export function Reviews({ reviews }: { reviews: NormalizedReview[] }) {
  const [ratings, setRatings] = useState<number[]>([]);
  const [topic, setTopic] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [likes, setLikes] = useState<Record<string, number>>({});

  const summary = useMemo(() => {
    const buckets = [5, 4, 3, 2, 1].map((score) => ({
      score,
      count: reviews.filter((review) => Math.round(review.rating) === score)
        .length,
    }));
    const total = reviews.length;
    const average =
      total === 0
        ? 0
        : reviews.reduce((sum, review) => sum + review.rating, 0) / total;
    return {
      buckets,
      total,
      average,
      max: Math.max(1, ...buckets.map((bucket) => bucket.count)),
    };
  }, [reviews]);

  const filtered = reviews.filter((review) => {
    const ratingOk =
      ratings.length === 0 || ratings.includes(Math.round(review.rating));
    const topicOk =
      topic.length === 0 ||
      topic.some((item) =>
        `${review.title} ${review.body}`
          .toLowerCase()
          .includes(item.toLowerCase()),
      );
    return ratingOk && topicOk;
  });
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize);

  function toggleRating(score: number) {
    setPage(1);
    setRatings((currentRatings) =>
      currentRatings.includes(score)
        ? currentRatings.filter((item) => item !== score)
        : [...currentRatings, score],
    );
  }

  return (
    <section
      className="mx-auto mt-14 max-w-[1200px] px-4 lg:px-0"
      aria-labelledby="reviews-heading"
    >
      <h2 id="reviews-heading" className="text-[22px] font-bold">
        Product Reviews
      </h2>
      <div className="mt-5 grid gap-6 rounded-2xl border border-dashed border-neutral-200 p-4 sm:p-6 lg:grid-cols-[220px_1fr] lg:items-center">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border-[3px] border-star text-lg font-semibold">
            {summary.total === 0 ? "–" : summary.average.toFixed(1)}
          </div>
          <div className="mt-2 flex justify-center">
            <Stars value={summary.average} />
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            from {summary.total.toLocaleString()} reviews
          </p>
        </div>
        <ul className="space-y-2">
          {summary.buckets.map((bucket) => (
            <li
              key={bucket.score}
              className="grid grid-cols-[36px_1fr_40px] items-center gap-3 text-sm"
            >
              <span className="inline-flex items-center gap-1 text-star">
                {bucket.score.toFixed(1)}
              </span>
              <span className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                <span
                  className="block h-full rounded-full bg-neutral-900"
                  style={{ width: `${(bucket.count / summary.max) * 100}%` }}
                />
              </span>
              <span className="text-right text-xs text-neutral-500">
                {bucket.count}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-dashed border-neutral-200 p-4">
          <h3 className="text-sm font-semibold">Reviews Filter</h3>
          <fieldset className="mt-4">
            <legend className="text-sm text-neutral-600">Rating</legend>
            <div className="mt-2 space-y-2">
              {[5, 4, 3, 2, 1].map((score) => (
                <label key={score} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={ratings.includes(score)}
                    onChange={() => toggleRating(score)}
                  />
                  <span className="sr-only">{score} stars</span>
                  <Stars value={score} size={12} />
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-5">
            <legend className="text-sm text-neutral-600">Review Topics</legend>
            <div className="mt-2 space-y-2">
              {topics.map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={topic.includes(item)}
                    onChange={() => {
                      setPage(1);
                      setTopic((currentTopics) =>
                        currentTopics.includes(item)
                          ? currentTopics.filter((entry) => entry !== item)
                          : [...currentTopics, item],
                      );
                    }}
                  />
                  {item}
                </label>
              ))}
            </div>
          </fieldset>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold">Review Lists</h3>
            <p className="rounded-full bg-neutral-100 px-3 py-1 text-xs">
              All Reviews
            </p>
          </div>
          {visible.length === 0 ? (
            <p className="mt-8 text-sm text-neutral-500">
              No reviews yet. Be the first to review this product.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-dashed divide-neutral-200">
              {visible.map((review) => (
                <li key={review.id} className="py-4">
                  <Stars value={review.rating} size={14} />
                  <p className="mt-2 text-sm font-semibold">{review.title}</p>
                  {review.body && review.body !== review.title ? (
                    <p className="mt-1 text-sm text-neutral-600">
                      {review.body}
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs text-neutral-400">
                    {formatDate(review.createdAt)}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm">{review.author}</p>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs text-neutral-500"
                      onClick={() =>
                        setLikes((currentLikes) => ({
                          ...currentLikes,
                          [review.id]:
                            (currentLikes[review.id] ?? review.likes) + 1,
                        }))
                      }
                    >
                      <ThumbIcon size={14} />
                      {likes[review.id] ?? review.likes}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {pages > 1 ? (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              {Array.from({ length: pages }, (_, index) => index + 1).map(
                (number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setPage(number)}
                    className={`h-8 min-w-8 rounded-md border px-2 ${number === current ? "border-neutral-900" : "border-transparent text-neutral-500"}`}
                  >
                    {number}
                  </button>
                ),
              )}
              <button
                type="button"
                aria-label="Next reviews page"
                className="grid h-8 w-8 place-items-center"
                onClick={() => setPage((value) => Math.min(pages, value + 1))}
              >
                <ChevronIcon direction="right" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
