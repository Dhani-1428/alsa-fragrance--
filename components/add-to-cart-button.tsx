"use client"

import type React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/contexts/auth-provider"
import { useLanguage } from "@/contexts/language-provider"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Product } from "@/lib/products-api"
import { AddToCartAlert } from "@/components/add-to-cart-alert"

interface AddToCartButtonProps {
  product: Product
  size: string
  quantity?: number
  className?: string
  children?: React.ReactNode
}

export function AddToCartButton({ product, size, quantity = 1, className, children }: AddToCartButtonProps) {
  const [showAlert, setShowAlert] = useState(false)
  const { addItem, openCart } = useCart()
  const { user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const handleAddToCart = () => {
    // Check if user is authenticated
    if (!user) {
      toast.error(t.common.loginRequired || "Please login to add items to cart")
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    // Normalize product ID to number for cart context compatibility
    const normalizedProduct = {
      ...product,
      id: typeof product.id === 'string' ? parseInt(product.id, 10) : product.id
    }
    // Type assertion needed because cart context expects products-main Product type
    // but the structure is compatible
    addItem(normalizedProduct as any, size, quantity)
    setShowAlert(true)
    // Don't open cart automatically, just show the alert
  }

  return (
    <>
      <AddToCartAlert open={showAlert} onClose={() => setShowAlert(false)} />
      <Button
        size="icon"
        variant="secondary"
        className={`bg-white/90 hover:bg-white text-black ${className}`}
        disabled={!product.inStock}
        onClick={handleAddToCart}
      >
        {children || <ShoppingCart className="h-4 w-4" />}
      </Button>
    </>
  )
}
