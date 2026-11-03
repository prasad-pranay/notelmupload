import { create } from 'zustand';

export const useAppStore = create((set) => ({
  sidebarOpen: false,
  darkMode: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
}));
