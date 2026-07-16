import { create } from 'zustand';

interface Admin {
    id: number;
    fullName: string;
    email: string;
}

interface AuthStore {
    admin: Admin | null;
    isLoggedIn: boolean;
    setAdmin: (admin: Admin | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    admin: null,
    isLoggedIn: false,
    setAdmin: (admin) =>
        set({
            admin,
            isLoggedIn: !!admin
        }),
    logout: () =>
        set({
            admin: null,
            isLoggedIn: false
        })
}));
