import { create } from "zustand";

import { persist } from "zustand/middleware";

interface AuthState {
    token: string | null
    setToken: (token: string) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            setToken: (token) => set({ token }),
            logout: () => {
                document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 2026 00:00:01 GMT"
                set({ token: null })
            },
        }),
        {
            name: "auth-storage"
        }
    )
);
