import { create } from 'zustand';

const useAppStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
  location: null,
  setLocation: (location) => set({ location }),
  selectedCategory: null,
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
}));

export default useAppStore;