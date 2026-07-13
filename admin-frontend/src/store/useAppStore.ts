import { create } from 'zustand';

export type UserRole = 'SUPER_ADMIN' | 'MANAGER' | 'DEV';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

interface AppState {
  role: UserRole;
  user: UserProfile | null;
  isSidebarOpen: boolean;
  setRole: (role: UserRole) => void;
  setUser: (user: UserProfile | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: 'SUPER_ADMIN', // Default to SUPER_ADMIN for demo purposes
  user: null,
  isSidebarOpen: true,
  setRole: (role) => set({ role }),
  setUser: (user) => set({ user, role: user ? user.role : 'SUPER_ADMIN' }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
}));
