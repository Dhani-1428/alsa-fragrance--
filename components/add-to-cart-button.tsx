"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/products-main"

interface AddToCartButtonProps {
  product: Product
  size: string
  quantity?: number
  className?: string
  children?: React.ReactNode
}

export function AddToCartButton({ product, size, quantity = 1, className, children }: AddToCartButtonProps) {
  const { addItem, openCart } = useCart()

  const handleAddToCart = () => {
    addItem(product, size, quantity)
    openCart()
  }

  return (
    <Button
      size="icon"
      variant="secondary"
      className={`bg-white/90 hover:bg-white text-black ${className}`}
      disabled={!product.inStock}
      onClick={handleAddToCart}
    >
      {children || <ShoppingCart className="h-4 w-4" />}
    </Button>
  )
}
