"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Product } from "@/lib/products-main"

export interface CartItem {
  product: Product
  quantity: number
  size: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; size: string; quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: number; size: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: number; size: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }

const initialState: CartState = {
  items: [],
  isOpen: false,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, size, quantity = 1 } = action.payload
      const existingItemIndex = state.items.findIndex((item) => item.product.id === product.id && item.size === size)

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += quantity
        return { ...state, items: updatedItems }
      }

      return {
        ...state,
        items: [...state.items, { product, size, quantity }],
      }
    }

    case "REMOVE_ITEM": {
      const { productId, size } = action.payload
      return {
        ...state,
        items: state.items.filter((item) => !(item.product.id === productId && item.size === size)),
      }
    }

    case "UPDATE_QUANTITY": {
      const { productId, size, quantity } = action.payload
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => !(item.product.id === productId && item.size === size)),
        }
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === productId && item.size === size ? { ...item, quantity } : item,
        ),
      }
    }

    case "CLEAR_CART":
      return { ...state, items: [] }

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen }

    case "OPEN_CART":
      return { ...state, isOpen: true }

    case "CLOSE_CART":
      return { ...state, isOpen: false }

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (product: Product, size: string, quantity?: number) => void
  removeItem: (productId: number, size: string) => void
  updateQuantity: (productId: number, size: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const addItem = (product: Product, size: string, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { product, size, quantity } })
  }

  const removeItem = (productId: number, size: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId, size } })
  }

  const updateQuantity = (productId: number, size: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, size, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" })
  }

  const openCart = () => {
    dispatch({ type: "OPEN_CART" })
  }

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" })
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
