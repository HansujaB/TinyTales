import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: true,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null, token: null, loading: false }),
}));

export default useAuthStore;
