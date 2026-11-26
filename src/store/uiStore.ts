import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface UiState {
  toast: string | null
  showToast: (message: string) => void
  clearToast: () => void
}

export const useUiStore = create<UiState>()(
  immer((set) => ({
    toast: null,
    showToast: (message) =>
      set((state) => {
        state.toast = message
      }),
    clearToast: () =>
      set((state) => {
        state.toast = null
      }),
  })),
)
