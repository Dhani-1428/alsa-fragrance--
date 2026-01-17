"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { Product } from "@/lib/products-api"

interface WishlistState {
  items: Product[]
  isOpen: boolean
}

type WishlistAction =
  | { type: "ADD_ITEM"; payload: { product: Product } }
  | { type: "REMOVE_ITEM"; payload: { productId: number | string } }
  | { type: "LOAD_FROM_STORAGE"; payload: { products: Product[] } }
  | { type: "TOGGLE_WISHLIST" }
  | { type: "OPEN_WISHLIST" }
  | { type: "CLOSE_WISHLIST" }
  | { type: "CLEAR_WISHLIST" }

const initialState: WishlistState = {
  items: [],
  isOpen: false,
}

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product } = action.payload
      const productId = typeof product.id === 'string' ? parseInt(product.id, 10) : product.id
      
      // Check if already in wishlist
      if (state.items.some((item) => {
        const itemId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id
        return itemId === productId
      })) {
        return state
      }

      return {
        ...state,
        items: [...state.items, product],
      }
    }

    case "REMOVE_ITEM": {
      const { productId } = action.payload
      const idToRemove = typeof productId === 'string' ? parseInt(productId, 10) : productId
      
      return {
        ...state,
        items: state.items.filter((item) => {
          const itemId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id
          return itemId !== idToRemove
        }),
      }
    }

    case "LOAD_FROM_STORAGE": {
      return {
        ...state,
        items: action.payload.products,
      }
    }

    case "CLEAR_WISHLIST":
      return { ...state, items: [] }

    case "TOGGLE_WISHLIST":
      return { ...state, isOpen: !state.isOpen }

    case "OPEN_WISHLIST":
      return { ...state, isOpen: true }

    case "CLOSE_WISHLIST":
      return { ...state, isOpen: false }

    default:
      return state
  }
}

interface WishlistContextType {
  state: WishlistState
  addItem: (product: Product) => void
  removeItem: (productId: number | string) => void
  toggleWishlist: () => void
  openWishlist: () => void
  closeWishlist: () => void
  clearWishlist: () => void
  isFavorite: (productId: number | string) => boolean
  getTotalItems: () => number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
        // Fetch product details for each favorite ID
        if (favorites.length > 0) {
          import("@/lib/products-api").then(({ getProducts }) => {
            getProducts().then((allProducts) => {
              const favoriteProducts = allProducts.filter((product) => {
                const productId = typeof product.id === 'string' ? parseInt(product.id, 10) : product.id
                return favorites.includes(productId)
              })
              dispatch({ type: "LOAD_FROM_STORAGE", payload: { products: favoriteProducts } })
            }).catch(console.error)
          })
        }
      } catch (error) {
        console.error("Error loading wishlist from localStorage:", error)
      }
    }
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined' && state.items.length >= 0) {
      try {
        const favoriteIds = state.items.map((item) => {
          return typeof item.id === 'string' ? parseInt(item.id, 10) : item.id
        })
        localStorage.setItem("favorites", JSON.stringify(favoriteIds))
      } catch (error) {
        console.error("Error saving wishlist to localStorage:", error)
      }
    }
  }, [state.items])

  const addItem = (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: { product } })
  }

  const removeItem = (productId: number | string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } })
  }

  const toggleWishlist = () => {
    dispatch({ type: "TOGGLE_WISHLIST" })
  }

  const openWishlist = () => {
    dispatch({ type: "OPEN_WISHLIST" })
  }

  const closeWishlist = () => {
    dispatch({ type: "CLOSE_WISHLIST" })
  }

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" })
  }

  const isFavorite = (productId: number | string) => {
    const idToCheck = typeof productId === 'string' ? parseInt(productId, 10) : productId
    return state.items.some((item) => {
      const itemId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id
      return itemId === idToCheck
    })
  }

  const getTotalItems = () => {
    return state.items.length
  }

  return (
    <WishlistContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        toggleWishlist,
        openWishlist,
        closeWishlist,
        clearWishlist,
        isFavorite,
        getTotalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
