import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    isOpen: false,
    setIsOpen: (open) => set({ isOpen: open }),
}));

export interface CartItem {
    id: string;
    name: string;
    price: string;
    image: string | null;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((i) => i.id === item.id);

                if (existingItem) {
                    set({
                        items: currentItems.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                        ),
                    });
                } else {
                    set({ items: [...currentItems, { ...item, quantity: 1 }] });
                }
            },
            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
            },
            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }
                set({
                    items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
                });
            },
            clearCart: () => set({ items: [] }),
            getTotal: () => {
                return get().items.reduce((total, item) => {
                    const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
                    return total + price * item.quantity;
                }, 0);
            },
        }),
        {
            name: "aloma-cart-storage",
        }
    )
);
