export function formatMoney(value: number): string {
  return `EGP ${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function discountPercent(current: number, compareAt: number | null): number | null {
  if (compareAt == null || compareAt <= current || compareAt <= 0) return null
  return Math.round(((compareAt - current) / compareAt) * 100)
}
