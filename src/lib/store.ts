import { create } from "zustand";

interface AuthStore {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    mode: "signin" | "signup";
    setMode: (mode: "signin" | "signup") => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    isOpen: false,
    setIsOpen: (open) => set({ isOpen: open }),
    mode: "signin",
    setMode: (mode) => set({ mode }),
}));
