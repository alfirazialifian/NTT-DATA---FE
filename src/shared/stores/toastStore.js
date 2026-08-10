import { create } from 'zustand'

export const useToastStore = create((set) => ({
  toasts: [],

  showToast: ({ title, message, type = 'success' }) => {
    const id = `${Date.now()}-${Math.random()}`
    set((state) => ({
      toasts: [...state.toasts, { id, title, message, type }],
    }))

    window.setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }))
    }, 4500)
  },

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}))
