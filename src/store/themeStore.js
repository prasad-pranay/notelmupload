import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () => set((state) => {
        const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(nextTheme);
        return { theme: nextTheme };
      }),
      initTheme: () => {
        const storedTheme = JSON.parse(localStorage.getItem('theme-storage'))?.state?.theme || 'dark';
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(storedTheme);
      }
    }),
    {
      name: 'theme-storage',
    }
  )
);
