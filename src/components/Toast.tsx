import { useEffect } from 'react'
import { useUiStore } from '../store/uiStore'

export function Toast() {
  const toast = useUiStore((state) => state.toast)
  const clearToast = useUiStore((state) => state.clearToast)

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(clearToast, 2200)
    return () => window.clearTimeout(id)
  }, [toast, clearToast])

  if (!toast) return null

  return (
    <div role="status" className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-black px-4 py-2 text-sm text-white shadow-lg">
      {toast}
    </div>
  )
}
