import React, { createContext, useContext, useEffect, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Product } from "./types";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
  stock: number;
  quantity: number;
};

type State = { items: CartItem[]; hydrated: boolean };

type Action =
  | { type: "ADD"; product: Product; qty: number }
  | { type: "REMOVE"; id: string }
  | { type: "SET_QTY"; id: string; qty: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

const STORAGE_KEY = "autoparts_cart";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.product.id
              ? { ...i, quantity: Math.min(i.quantity + action.qty, i.stock) }
              : i
          ),
        };
      }
      const p = action.product;
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            brand: p.brand,
            stock: p.stock,
            quantity: Math.min(action.qty, p.stock),
          },
        ],
      };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "SET_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id
            ? { ...i, quantity: Math.max(1, Math.min(action.qty, i.stock)) }
            : i
        ),
      };
    case "CLEAR":
      return { ...state, items: [] };
    case "HYDRATE":
      return { items: action.items, hydrated: true };
    default:
      return state;
  }
}

type CartValue = {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], hydrated: false });

  // Load saved cart once
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => dispatch({ type: "HYDRATE", items: raw ? JSON.parse(raw) : [] }))
      .catch(() => dispatch({ type: "HYDRATE", items: [] }));
  }, []);

  // Persist on change (after hydration)
  useEffect(() => {
    if (state.hydrated) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)).catch(() => {});
    }
  }, [state.items, state.hydrated]);

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem: (product, qty = 1) => dispatch({ type: "ADD", product, qty }),
        removeItem: (id) => dispatch({ type: "REMOVE", id }),
        setQuantity: (id, qty) => dispatch({ type: "SET_QTY", id, qty }),
        clear: () => dispatch({ type: "CLEAR" }),
        totalItems,
        totalPrice,
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
