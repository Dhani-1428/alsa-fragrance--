"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { ProductGallery } from "@/components/product-gallery"
import { ProductReviews } from "@/components/product-reviews"
import { RelatedProducts } from "@/components/related-products"
import { AddToCartForm } from "@/components/add-to-cart-form"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star, Truck, Shield, RotateCcw } from "lucide-react"
import { getProductById, type Product } from "@/lib/products-api"
import { useLanguage } from "@/contexts/language-provider"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    async function loadProduct() {
      try {
        const prod = await getProductById(Number.parseInt(params.id))
        if (!prod) {
          router.push("/404")
          return
        }
        setProduct(prod)
      } catch (error) {
        console.error("Error loading product:", error)
        router.push("/404")
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [params.id, router])

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p>Loading product...</p>
        </div>
      </main>
    )
  }

  if (!product) {
    return null
  }

  // Create multiple images for gallery (using the same image for demo)
  const galleryImages = [product.image, product.image, product.image]

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <a href="/" className="hover:text-foreground">
            {t.nav.home}
          </a>
          <span>/</span>
          <a href="/shop" className="hover:text-foreground">
            {t.nav.shop}
          </a>
          <span>/</span>
          <a href={`/${product.category}`} className="hover:text-foreground capitalize">
            {product.category}
          </a>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Gallery */}
          <div>
            <ProductGallery images={galleryImages} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2">
              {product.badge && (
                <Badge variant={product.badge === "Sale" ? "destructive" : "default"}>{product.badge}</Badge>
              )}
              {product.isNew && (
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  New
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="secondary" className="bg-gray-500 text-white">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 font-[family-name:var(--font-playfair)]">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">€{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">€{product.originalPrice.toFixed(2)}</span>
              )}
              {product.originalPrice && (
                <Badge variant="destructive" className="text-xs">
                  Save €{(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">{t.product.size}</label>
              <AddToCartForm product={product} />
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">Authentic</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">30-Day Return</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Fragrance Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Fragrance Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Top Notes</h4>
                <p className="text-sm text-muted-foreground">{product.notes.top.join(", ")}</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium text-sm mb-2">Middle Notes</h4>
                <p className="text-sm text-muted-foreground">{product.notes.middle.join(", ")}</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium text-sm mb-2">Base Notes</h4>
                <p className="text-sm text-muted-foreground">{product.notes.base.join(", ")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <span className="text-sm capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Available Sizes</span>
                <span className="text-sm">{product.size.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Stock Status</span>
                <span className={`text-sm ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                  {product.inStock ? t.product.inStock : t.product.outOfStock}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">SKU</span>
                <span className="text-sm">AF-{product.id.toString().padStart(4, "0")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Care Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Care Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Store in a cool, dry place away from direct sunlight</p>
              <p>• Keep bottle tightly closed when not in use</p>
              <p>• Apply to pulse points for best longevity</p>
              <p>• Avoid contact with jewelry and light fabrics</p>
              <p>• For external use only</p>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section */}
        <ProductReviews rating={product.rating} totalReviews={product.reviews} reviews={[]} />
      </div>

      {/* Related Products */}
      <RelatedProducts currentProduct={product} />
    </main>
  )
}
