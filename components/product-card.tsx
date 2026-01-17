"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Eye } from "lucide-react"
import type { Product } from "@/lib/products-api"
import { useLanguage } from "@/contexts/language-provider"
import { AddToCartButton } from "@/components/add-to-cart-button"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage()
  // Ensure ID is converted to string for the URL
  const productId = typeof product.id === 'string' ? product.id : product.id?.toString() || ''
  
  return (
    <Card className="group overflow-hidden border-0 bg-card hover:shadow-xl transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative overflow-hidden aspect-square">
          <Link href={`/product/${productId}`}>
            <img
              src={product.image || "/premium-perfume-bottle-elegant-design.jpg"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </Link>

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.badge && (
              <Badge variant={product.badge === "Sale" ? "destructive" : "default"} className="text-xs">
                {product.badge}
              </Badge>
            )}
            {product.isNew && (
              <Badge variant="secondary" className="text-xs bg-primary text-primary-foreground">
                {t.home.newArrivals}
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary" className="text-xs bg-gray-500 text-white">
                {t.product.outOfStock}
              </Badge>
            )}
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <AddToCartButton product={product} size={product.size && product.size.length > 0 ? product.size[0] : ''} />
            <Link href={`/product/${productId}`}>
              <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white text-black">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>

          <p className="text-xs text-muted-foreground mb-1 capitalize">{product.category}</p>
          <Link href={`/product/${productId}`}>
            <h3 className="font-semibold mb-2 text-sm hover:text-primary transition-colors">{product.name}</h3>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">€{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">€{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
