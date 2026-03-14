import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, Outlet } from '../types';

interface AuthState {
    user: AuthUser | null;
    outlet: Outlet | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    setUser: (user: AuthUser) => void;
    setOutlet: (outlet: Outlet) => void;
    setLoading: (v: boolean) => void;
    setError: (msg: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            outlet: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            setUser: (user) => set({ user, isAuthenticated: true }),
            setOutlet: (outlet) => set({ outlet }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            logout: () => set({
                user: null,
                outlet: null,
                isAuthenticated: false,
                error: null
            }),
        }),
        {
            name: 'mediflow-auth',
            skipHydration: true,
            partialize: (state) => ({
                user: state.user,
                outlet: state.outlet,
                isAuthenticated: state.isAuthenticated
            }), // Only persist these fields
        }
    )
);
