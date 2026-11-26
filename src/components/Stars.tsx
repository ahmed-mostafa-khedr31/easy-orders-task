import { StarIcon } from './Icons'

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const rounded = Math.round(value)
  return (
    <span className="inline-flex text-star" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon key={index} size={size} filled={index < rounded} />
      ))}
    </span>
  )
}
