import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios.js';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      setAccessToken: (accessToken) => set({ accessToken }),

      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),

      updateProfileData: async (formData) => {
        try {
          const res = await api.put('/auth/profile', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          if (res.data.success) {
            set((state) => ({ user: res.data.data.user }));
            return { success: true, user: res.data.data.user };
          }
        } catch (error) {
          console.error('Error updating profile:', error);
          throw error;
        }
      },

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    { name: 'notelm-auth' }
  )
);
