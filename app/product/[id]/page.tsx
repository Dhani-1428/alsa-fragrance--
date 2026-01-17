"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { ProductGallery } from "@/components/product-gallery"
import { ProductReviews } from "@/components/product-reviews"
import { RelatedProducts } from "@/components/related-products"
import { AddToCartForm } from "@/components/add-to-cart-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
        console.log("Loading product with params.id:", params.id, "Type:", typeof params.id)
        
        // Parse ID - handle both string and number
        const productIdStr = String(params.id || '').trim()
        if (!productIdStr) {
          console.error("Empty product ID")
          setLoading(false)
          return
        }
        
        const productId = parseInt(productIdStr, 10)
        if (isNaN(productId) || productId <= 0) {
          console.error("Invalid product ID:", params.id, "Parsed as:", productId)
          setLoading(false)
          return
        }
        
        console.log("Fetching product with ID:", productId)
        const prod = await getProductById(productId)
        console.log("Product fetch result:", prod ? "Found" : "Not found", prod)
        
        if (!prod) {
          console.error("Product not found with ID:", productId)
          setLoading(false)
          return
        }
        setProduct(prod)
      } catch (error) {
        console.error("Error loading product:", error)
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
          <p>{t.pages.loadingProduct}</p>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4 font-[family-name:var(--font-playfair)]">Product Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/shop">Browse All Products</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </main>
    )
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
                  {t.pages.new}
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="secondary" className="bg-gray-500 text-white">
                  {t.product.outOfStock}
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
                    {product.rating} ({product.reviews} {t.pages.reviews})
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
                  {t.pages.save} €{(product.originalPrice - product.price).toFixed(2)}
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
                <p className="text-xs text-muted-foreground">{t.pages.freeShipping}</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">{t.pages.authentic}</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">{t.pages.dayReturn}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Fragrance Notes */}
          <Card>
            <CardHeader>
              <CardTitle>{t.pages.fragranceNotes}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">{t.pages.topNotes}</h4>
                <p className="text-sm text-muted-foreground">{product.notes.top.join(", ")}</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium text-sm mb-2">{t.pages.middleNotes}</h4>
                <p className="text-sm text-muted-foreground">{product.notes.middle.join(", ")}</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium text-sm mb-2">{t.pages.baseNotes}</h4>
                <p className="text-sm text-muted-foreground">{product.notes.base.join(", ")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>{t.pages.productDetails}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t.pages.category}</span>
                <span className="text-sm capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t.pages.availableSizes}</span>
                <span className="text-sm">{product.size.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t.pages.stockStatus}</span>
                <span className={`text-sm ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                  {product.inStock ? t.product.inStock : t.product.outOfStock}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t.pages.sku}</span>
                <span className="text-sm">AF-{product.id.toString().padStart(4, "0")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Care Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>{t.pages.careInstructions}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• {t.pages.careInstruction1}</p>
              <p>• {t.pages.careInstruction2}</p>
              <p>• {t.pages.careInstruction3}</p>
              <p>• {t.pages.careInstruction4}</p>
              <p>• {t.pages.careInstruction5}</p>
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
