"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Heart, Share2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useLanguage } from "@/contexts/language-provider"
import { toast } from "sonner"
import type { Product } from "@/lib/products-api"

interface AddToCartFormProps {
  product: Product
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const [selectedSize, setSelectedSize] = useState(
    product.size && product.size.length > 0 ? product.size[0] : ""
  )
  const [isFavorite, setIsFavorite] = useState(false)
  const { addItem, openCart } = useCart()
  const { t } = useLanguage()

  // Load favorite state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
        const productId = typeof product.id === 'string' ? parseInt(product.id, 10) : product.id
        setIsFavorite(favorites.includes(productId))
      } catch (error) {
        console.error("Error loading favorites:", error)
      }
    }
  }, [product.id])

  const handleAddToCart = () => {
    addItem(product, selectedSize, 1)
    openCart()
  }

  const handleWishlist = () => {
    setIsFavorite(!isFavorite)
    if (!isFavorite) {
      toast.success("Product added to wishlist!")
      // Store in localStorage
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
      const productId = typeof product.id === 'string' ? parseInt(product.id, 10) : product.id
      if (!favorites.includes(productId)) {
        favorites.push(productId)
        localStorage.setItem("favorites", JSON.stringify(favorites))
      }
    } else {
      toast.info("Product removed from wishlist")
      // Remove from localStorage
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
      const productId = typeof product.id === 'string' ? parseInt(product.id, 10) : product.id
      const updatedFavorites = favorites.filter((id: number) => id !== productId)
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
    }
  }

  const handleShare = async () => {
    const productId = typeof product.id === 'string' ? product.id : String(product.id)
    const url = `${window.location.origin}/product/${productId}`
    const shareData = {
      title: product.name,
      text: product.description,
      url: url,
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        toast.success("Product shared successfully!")
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(url)
        toast.success("Product link copied to clipboard!")
      }
    } catch (error: any) {
      // User cancelled or error occurred
      if (error.name !== "AbortError") {
        // Fallback: Copy to clipboard
        try {
          await navigator.clipboard.writeText(url)
          toast.success("Product link copied to clipboard!")
        } catch (clipboardError) {
          toast.error("Failed to share product")
        }
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Size Selection - only show if sizes are available */}
      {product.size && product.size.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">{t.product.size}</label>
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {product.size.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Add to Cart */}
      <div className="flex gap-3">
        <Button size="lg" className="flex-1" disabled={!product.inStock} onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? t.common.addToCart : t.product.outOfStock}
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handleWishlist}
          className={isFavorite ? "text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-950" : ""}
          title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500" : ""}`} />
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          onClick={handleShare}
          title="Share product"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
