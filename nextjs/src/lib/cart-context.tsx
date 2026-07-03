"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { getShipping, getShippingCartEstimate, SHIPPING_INCL_OTHER } from "@/lib/shipping";
import { reconcileFunnelDiscounts } from "@/lib/funnel";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  sku: string | null;
  funnel?: import("@/lib/funnel").CartItemFunnelMeta;
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

export { getShipping, getShippingCartEstimate, SHIPPING_INCL_OTHER as SHIPPING_FEE };

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ items: CartItem[]; isHydrated: boolean }>({
    items: [],
    isHydrated: false,
  });
  const { items, isHydrated } = state;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerOpenReason, setDrawerOpenReason] = useState<"manual" | "add">("manual");

  useEffect(() => {
    let hydratedItems: CartItem[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) hydratedItems = JSON.parse(stored) as CartItem[];
    } catch {
      // corrupted storage — start fresh
    }
    setState((prev) => {
      const safeItems = reconcileFunnelDiscounts(prev.items.length > 0 ? prev.items : hydratedItems);
      return { items: safeItems, isHydrated: true };
    });
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setState((prev) => {
      const existing = prev.items.find((i) => i.id === item.id);
      const nextItems = existing
        ? prev.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prev.items, { ...item, quantity: 1 }];
      return { ...prev, items: nextItems };
    });
    setDrawerOpenReason("add");
    setIsDrawerOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      items: reconcileFunnelDiscounts(prev.items.filter((i) => i.id !== id)),
    }));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty < 1) return;
    setState((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    }));
  }, []);

  const clearCart = useCallback(() => {
    setState((prev) => ({ ...prev, items: [] }));
  }, []);

  const openDrawer = useCallback((reason: "manual" | "add" = "manual") => {
    setDrawerOpenReason(reason);
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
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

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
