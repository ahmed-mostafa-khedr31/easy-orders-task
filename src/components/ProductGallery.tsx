import { useEffect, useState, type ReactNode } from "react";
import { ChevronIcon, CloseIcon, HeartIcon, ShareIcon } from "./Icons";

interface ProductGalleryProps {
  images: string[];
  name: string;
  wished: boolean;
  onWish: () => void;
}

export function ProductGallery({
  images,
  name,
  wished,
  onWish,
}: ProductGalleryProps) {
  const galleryKey = images.join("|");
  const [index, setIndex] = useState(0);
  const [trackedGallery, setTrackedGallery] = useState(galleryKey);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [zooming, setZooming] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  let displayIndex = index;
  if (trackedGallery !== galleryKey) {
    setTrackedGallery(galleryKey);
    setIndex(0);
    displayIndex = 0;
  }
  const safeIndex = images.length === 0 ? 0 : displayIndex % images.length;
  const src = images[safeIndex];

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowRight") setIndex((current) => current + 1);
      if (event.key === "ArrowLeft") setIndex((current) => current - 1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  function step(delta: number) {
    if (images.length === 0) return;
    setIndex((current) => (current + delta + images.length) % images.length);
  }

  const finePointer =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <>
      <div className="relative h-full">
        <div className="absolute z-10 right-0 top-0 flex flex-col gap-4">
          <div className="relative">
            <RoundButton
              label="Share"
              onClick={() => setShareOpen((open) => !open)}
            >
              <ShareIcon />
            </RoundButton>
            {shareOpen ? (
              <ShareMenu
                url={typeof window === "undefined" ? "" : window.location.href}
                title={name}
                onClose={() => setShareOpen(false)}
              />
            ) : null}
          </div>
          <RoundButton
            label={wished ? "Remove from wishlist" : "Save to wishlist"}
            pressed={wished}
            onClick={onWish}
          >
            <HeartIcon filled={wished} />
          </RoundButton>
        </div>
        <div className="absolute z-10 right-0 bottom-0 flex  flex-col gap-4">
          <RoundButton label="Previous image" onClick={() => step(-1)}>
            <ChevronIcon direction="left" />
          </RoundButton>
          <RoundButton label="Next image" onClick={() => step(1)}>
            <ChevronIcon direction="right" />
          </RoundButton>
        </div>
        <div
          className="relative outline-none mr-20"
          tabIndex={0}
          role="region"
          aria-label="Product images"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") step(1);
            if (event.key === "ArrowLeft") step(-1);
          }}
        >
          <button
            type="button"
            className="block cursor-pointer aspect-[4/3] w-[100%] overflow-hidden rounded-lg  bg-[#F2F2F2] sm:aspect-[5/4]"
            onClick={() => setLightbox(true)}
            onMouseEnter={() => finePointer && setZooming(true)}
            onMouseLeave={() => setZooming(false)}
            onMouseMove={(event) => {
              if (!finePointer) return;
              const rect = event.currentTarget.getBoundingClientRect();
              setOrigin({
                x: ((event.clientX - rect.left) / rect.width) * 100,
                y: ((event.clientY - rect.top) / rect.height) * 100,
              });
            }}
            aria-label={`Zoom ${name}`}
          >
            {src ? (
              <img
                key={src}
                src={src}
                alt={name}
                className="fade-in h-[full] w-full object-cover"
                style={
                  zooming
                    ? {
                        transform: "scale(1.8)",
                        transformOrigin: `${origin.x}% ${origin.y}%`,
                      }
                    : undefined
                }
              />
            ) : (
              <span className="grid h-full place-items-center text-sm text-neutral-500">
                No image
              </span>
            )}
          </button>
        </div>

        {lightbox && src ? (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Expanded product image"
          >
            <button
              type="button"
              className="absolute right-4 top-4 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white"
              aria-label="Close image"
              onClick={() => setLightbox(false)}
            >
              <CloseIcon />
            </button>
            <button
              type="button"
              className="absolute left-4 top-1/2 grid h-10 w-10 cursor-pointer -translate-y-1/2 place-items-center rounded-full bg-white"
              aria-label="Previous image"
              onClick={() => step(-1)}
            >
              <ChevronIcon direction="left" />
            </button>
            <img
              src={src}
              alt={name}
              className="max-h-[86vh] max-w-[92vw] object-contain"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 grid h-10 w-10 cursor-pointer -translate-y-1/2 place-items-center rounded-full bg-white"
              aria-label="Next image"
              onClick={() => step(1)}
            >
              <ChevronIcon direction="right" />
            </button>
          </div>
        ) : null}
      </div>
      <ul className="mt-4  flex gap-2 overflow-x-auto pb-1">
        {images.map((image, imageIndex) => {
          const selected = imageIndex === safeIndex;
          return (
            <li key={image}>
              <button
                type="button"
                aria-label={`Show image ${imageIndex + 1}`}
                aria-current={selected ? "true" : undefined}
                onClick={() => setIndex(imageIndex)}
                className={`h-16 w-16  cursor-pointer overflow-hidden rounded-lg border bg-canvas sm:h-[72px] sm:w-[72px] ${selected ? "border-neutral-900" : "border-transparent"}`}
              >
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function RoundButton({
  label,
  onClick,
  pressed,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="grid h-10 w-10 place-items-center cursor-pointer rounded-lg bg-[#F2F2F2] text-ink shadow-sm hover:bg-neutral-50"
    >
      {children}
    </button>
  );
}

function ShareMenu({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) {
  const links = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
  ];
  return (
    <div className="absolute right-12 top-0 z-10 w-40 rounded-xl border border-neutral-200 bg-white p-2 text-sm shadow-lg">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="block cursor-pointer rounded-lg px-3 py-2 hover:bg-neutral-50"
          onClick={onClose}
        >
          {link.label}
        </a>
      ))}
      <button
        type="button"
        className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left hover:bg-neutral-50"
        onClick={() => {
          void navigator.clipboard?.writeText(url);
          onClose();
        }}
      >
        Copy link
      </button>
    </div>
  );
}
