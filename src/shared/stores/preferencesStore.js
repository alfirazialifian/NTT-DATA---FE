import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePreferencesStore = create(
  persist(
    (set) => ({
      locale: 'en',
      theme: 'light',
      setLocale: (locale) => set({ locale }),
      toggleLocale: () =>
        set((state) => ({ locale: state.locale === 'en' ? 'id' : 'en' })),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'catalog-admin-preferences',
      partialize: ({ locale, theme }) => ({ locale, theme }),
    },
  ),
)
