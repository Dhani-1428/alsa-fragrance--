"use client"

import { useState, useEffect, use } from "react"
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
import { useTranslatedProduct } from "@/lib/hooks/use-translated-product"
import { Footer } from "@/components/footer"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { t, language } = useLanguage()
  
  // Unwrap params Promise using React.use() (Next.js 16+)
  // NOTE: params is a Promise in Next.js 16, must use React.use() before accessing properties
  const resolvedParams = use(params)
  
  // Import translation utility
  const { getTranslatedProduct } = require('@/lib/i18n/product-translations')

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        
        // Get product ID from resolved params
        const productIdStr = String(resolvedParams?.id || '').trim()
        if (!productIdStr) {
          console.error("Empty product ID")
          setLoading(false)
          return
        }
        
        // Parse ID
        const productId = parseInt(productIdStr, 10)
        if (isNaN(productId) || productId <= 0) {
          console.error("Invalid product ID:", productIdStr)
          setLoading(false)
          return
        }
        
        // Fetch product from API
        const prod = await getProductById(productId)
        
        if (!prod) {
          console.error("Product not found with ID:", productId, "- This might mean:")
          console.error("1. Product doesn't exist in database")
          console.error("2. API returned 404")
          console.error("3. Product ID mismatch")
          setLoading(false)
          return
        }
        
        console.log("Product loaded successfully:", prod.name, "ID:", prod.id)
        setProduct(prod)
      } catch (error) {
        console.error("Error loading product:", error)
      } finally {
        setLoading(false)
      }
    }
    
    if (resolvedParams?.id) {
      loadProduct()
    } else {
      setLoading(false)
    }
  }, [resolvedParams?.id])

  // Get translated product when product is loaded
  const translatedProduct = product ? getTranslatedProduct(
    product.id,
    product.name,
    product.description,
    language as "en" | "pt" | "hi" | "ar" | "ur"
  ) : { name: '', description: '' }

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

  // Use product images for gallery - main image plus additional images
  const galleryImages = product.images && product.images.length > 0 
    ? [product.image, ...product.images].filter(img => img && img.trim())
    : [product.image]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            {t.nav.home}
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground transition-colors">
            {t.nav.shop}
          </Link>
          <span>/</span>
          <Link href={`/${product.category}`} className="hover:text-foreground capitalize transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{translatedProduct.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-20">
          {/* Product Gallery */}
          <div className="flex items-center justify-center">
            <ProductGallery images={galleryImages} productName={translatedProduct.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6 lg:space-y-8">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.badge && (
                <Badge variant={product.badge === "Sale" ? "destructive" : "default"} className="text-sm px-3 py-1">
                  {product.badge}
                </Badge>
              )}
              {product.isNew && (
                <Badge variant="secondary" className="bg-primary text-primary-foreground text-sm px-3 py-1">
                  {t.pages.new}
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="secondary" className="bg-gray-500 text-white text-sm px-3 py-1">
                  {t.product.outOfStock}
                </Badge>
              )}
            </div>

            {/* Title and Rating */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-playfair)] text-foreground">
                {translatedProduct.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-base text-muted-foreground">
                    <span className="font-semibold">{product.rating}</span> ({product.reviews} {t.pages.reviews})
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <span className="text-4xl lg:text-5xl font-bold text-primary">€{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-2xl text-muted-foreground line-through">€{product.originalPrice.toFixed(2)}</span>
                  <Badge variant="destructive" className="text-sm px-3 py-1">
                    {t.pages.save} €{(product.originalPrice - product.price).toFixed(2)}
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            <div className="py-4">
              <p className="text-base text-muted-foreground leading-relaxed">{translatedProduct.description}</p>
            </div>

            {/* Size Selection and Add to Cart */}
            <div className="pt-4">
              <AddToCartForm product={product} />
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
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
        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {/* Fragrance Notes */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">{t.pages.fragranceNotes}</CardTitle>
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
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">{t.pages.productDetails}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t.pages.category}</span>
                <span className="text-sm capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t.pages.availableSizes}</span>
                <span className="text-sm">{product.size && product.size.length > 0 ? product.size.join(", ") : "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t.pages.stockStatus}</span>
                <span className={`text-sm ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                  {product.inStock ? t.product.inStock : t.product.outOfStock}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t.pages.sku}</span>
                <span className="text-sm">AF-{String(product.id || "").padStart(4, "0")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Care Instructions */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">{t.pages.careInstructions}</CardTitle>
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

      <Footer />
    </main>
  )
}
