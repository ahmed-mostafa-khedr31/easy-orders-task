import { useEffect, useState } from 'react'

function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function PromoBar({ hours = 1 }: { hours?: number }) {
  const [label, setLabel] = useState('00:00')

  useEffect(() => {
    const key = 'easy-orders-promo-end'
    const stored = sessionStorage.getItem(key)
    const end = stored ? Number(stored) : Date.now() + Math.max(hours, 0) * 60 * 60 * 1000
    if (!stored) sessionStorage.setItem(key, String(end))

    const tick = () => setLabel(formatRemaining(end - Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [hours])

  return (
    <div className="bg-black text-white">
      <div className="mx-auto flex max-w-[1200px] items-center justify-center gap-3 px-4 py-2 text-center text-[12px] sm:text-[13px]">
        <p>
          New season coming! Discount 10% for all product!{' '}
          <a href="#buy-box" className="underline underline-offset-2">
            Checkout Now!
          </a>
        </p>
        <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[11px] tabular-nums tracking-wide" aria-label={`Offer ends in ${label}`}>
          {label}
        </span>
      </div>
    </div>
  )
}
