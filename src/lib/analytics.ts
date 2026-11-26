export type AnalyticsPayload = Record<string, string | number | boolean | null>

export function track(event: string, payload: AnalyticsPayload = {}): void {
  const entry = { event, payload, at: new Date().toISOString() }
  const target = window as Window & { dataLayer?: unknown[] }
  target.dataLayer = target.dataLayer ?? []
  target.dataLayer.push(entry)
}
