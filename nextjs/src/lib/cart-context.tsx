"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  sku: string | null;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  isHydrated: boolean;
  isDrawerOpen: boolean;
  drawerOpenReason: "manual" | "add";
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  openDrawer: (reason?: "manual" | "add") => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "lava-sa-cart";
const FREE_SHIPPING_THRESHOLD = 2500;
export const SHIPPING_FEE = 150;

export function getShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ items: CartItem[]; isHydrated: boolean }>({
    items: [],
    isHydrated: false,
  });
  const { items, isHydrated } = state;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerOpenReason, setDrawerOpenReason] = useState<"manual" | "add">("manual");

  // Hydrate from localStorage after mount (prevents SSR mismatch)
  useEffect(() => {
    let hydratedItems: CartItem[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) hydratedItems = JSON.parse(stored) as CartItem[];
    } catch {
      // corrupted storage — start fresh
    }
    setState((prev) => {
      // If user added items before hydration finished, keep those runtime items.
      const safeItems = prev.items.length > 0 ? prev.items : hydratedItems;
      return { items: safeItems, isHydrated: true };
    });
  }, []);

  // Persist to localStorage only after initial hydration.
  // This prevents briefly writing an empty cart before stored data is restored.
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setState((prev) => {
      const currentItems = prev.items;
      const existing = currentItems.find((i) => i.id === item.id);
      const nextItems = existing
        ? currentItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...currentItems, { ...item, quantity: 1 }];
      return { ...prev, items: nextItems };
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty < 1) return;
    setState((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    }));
  }, []);

  const clearCart = useCallback(
    () => setState((prev) => ({ ...prev, items: [] })),
    []
  );
  const openDrawer = useCallback((reason: "manual" | "add" = "manual") => {
    setDrawerOpenReason(reason);
    setIsDrawerOpen(true);
  }, []);
  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setDrawerOpenReason("manual");
  }, []);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        total,
        isHydrated,
        isDrawerOpen,
        drawerOpenReason,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
