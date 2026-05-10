"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./sanity.types";
import { buildCartKey, getStockForSize, getTotalStock } from "./lib/product";
import { urlFor } from "./sanity/lib/image";

export interface CartItem {
  product: Product;
  quantity: number;
  /** Selected size for size-aware products. Undefined for legacy/sizeless products. */
  size?: string;
}

/** Snapshot saved before PhonePe redirect so success page can persist the order */
export interface PendingOrder {
  orderNumber: string;
  clerkUserId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: {
    fullName: string;
    phone: string;
    line1: string;
  };
  totalPrice: number;
  items: Array<{
    productId: string;
    name: string;
    slug?: string;
    image?: string;
    size?: string;
    quantity: number;
    price: number;
    discount: number;
  }>;
}

interface CartState {
  items: CartItem[];
  pendingOrder: PendingOrder | null;

  addItem: (product: Product, size?: string) => void;
  removeItem: (productId: string, size?: string) => void;
  deleteCartProduct: (productId: string, size?: string) => void;
  resetCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (productId: string, size?: string) => number;
  getGroupedItems: () => CartItem[];

  /** Call before navigating to PhonePe. Snapshot survives cart reset. */
  setPendingOrder: (order: PendingOrder) => void;
  clearPendingOrder: () => void;
  /** Build a PendingOrder snapshot from current cart + metadata */
  buildPendingOrder: (meta: {
    orderNumber: string;
    clerkUserId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    address?: string;
  }) => PendingOrder;
}

const sameLine = (item: CartItem, productId: string, size?: string) =>
  item.product._id === productId && (item.size ?? undefined) === (size ?? undefined);

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      pendingOrder: null,

      addItem: (product, size) =>
        set((state) => {
          const stockCap = size
            ? getStockForSize(product, size)
            : getTotalStock(product);

          const existing = state.items.find((it) =>
            sameLine(it, product._id, size)
          );

          if (existing) {
            const nextQty = Math.min(existing.quantity + 1, stockCap || existing.quantity + 1);
            return {
              items: state.items.map((it) =>
                sameLine(it, product._id, size)
                  ? { ...it, quantity: nextQty }
                  : it
              ),
            };
          }

          return { items: [...state.items, { product, quantity: 1, size }] };
        }),

      removeItem: (productId, size) =>
        set((state) => ({
          items: state.items.reduce<CartItem[]>((acc, item) => {
            if (sameLine(item, productId, size)) {
              if (item.quantity > 1) acc.push({ ...item, quantity: item.quantity - 1 });
            } else {
              acc.push(item);
            }
            return acc;
          }, []),
        })),

      deleteCartProduct: (productId, size) =>
        set((state) => ({
          items: state.items.filter((it) => !sameLine(it, productId, size)),
        })),

      resetCart: () => set({ items: [] }),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + (item.product.price ?? 0) * item.quantity,
          0
        ),

      getSubTotalPrice: () =>
        get().items.reduce((total, item) => {
          const price = item.product.price ?? 0;
          const discountPct = item.product.discount ?? 0;
          const original = price / (1 - discountPct / 100 || 1);
          return total + original * item.quantity;
        }, 0),

      getItemCount: (productId, size) => {
        const item = get().items.find((it) => sameLine(it, productId, size));
        return item ? item.quantity : 0;
      },

      getGroupedItems: () => get().items,

      setPendingOrder: (order) => set({ pendingOrder: order }),
      clearPendingOrder: () => set({ pendingOrder: null }),

      buildPendingOrder: (meta) => {
        const items = get().items;
        return {
          orderNumber: meta.orderNumber,
          clerkUserId: meta.clerkUserId,
          customerName: meta.customerName,
          customerEmail: meta.customerEmail,
          customerPhone: meta.customerPhone,
          shippingAddress: meta.address
            ? { fullName: meta.customerName, phone: meta.customerPhone ?? "", line1: meta.address }
            : undefined,
          totalPrice: get().getTotalPrice(),
          items: items.map(({ product, quantity, size }) => {
            let image: string | undefined;
            try {
              image = product.images?.[0] ? urlFor(product.images[0]).width(300).url() : undefined;
            } catch {
              image = undefined;
            }
            return {
              productId: product._id,
              name: product.name ?? "",
              slug: product.slug?.current ?? undefined,
              image,
              size,
              quantity,
              price: product.price ?? 0,
              discount: product.discount ?? 0,
            };
          }),
        };
      },
    }),
    {
      name: "cart-store",
      version: 2,
      migrate: (state, version) => {
        if (version < 2) return { items: [], pendingOrder: null } as Partial<CartState>;
        return state as Partial<CartState>;
      },
    }
  )
);

export const cartLineKey = buildCartKey;
export default useCartStore;
