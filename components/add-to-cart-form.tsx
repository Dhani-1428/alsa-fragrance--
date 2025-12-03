"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Heart, Share2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useLanguage } from "@/contexts/language-provider"
import type { Product } from "@/lib/products-main"

interface AddToCartFormProps {
  product: Product
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const [selectedSize, setSelectedSize] = useState(product.size[0])
  const { addItem, openCart } = useCart()
  const { t } = useLanguage()

  const handleAddToCart = () => {
    addItem(product, selectedSize, 1)
    openCart()
  }

  return (
    <div className="space-y-4">
      {/* Size Selection */}
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

      {/* Add to Cart */}
      <div className="flex gap-3">
        <Button size="lg" className="flex-1" disabled={!product.inStock} onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? t.common.addToCart : t.product.outOfStock}
        </Button>
        <Button variant="outline" size="lg">
          <Heart className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="lg">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
