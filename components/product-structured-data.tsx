"use client"

import Script from 'next/script'
import type { Product } from '@/lib/products-api'

interface ProductStructuredDataProps {
  product: Product
}

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const baseUrl = 'https://www.alsafragrance.com'
  const productUrl = `${baseUrl}/product/${product.id}`
  const productImage = product.image || `${baseUrl}/luxury-alsa-fragrance-branded-perfume-bottles-eleg.jpg`
  const price = product.originalPrice || product.price
  const currency = 'EUR'
  const inStock = product.stock > 0

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || `${product.name} - Premium luxury perfume by Alsa Fragrance.`,
    "image": product.images && product.images.length > 0 
      ? [productImage, ...product.images]
      : [productImage],
    "sku": `AF-${String(product.id).padStart(4, "0")}`,
    "brand": {
      "@type": "Brand",
      "name": "Alsa Fragrance",
      "alternateName": "AlsaFragrance"
    },
    "category": product.category || "Fragrance",
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": currency,
      "price": price.toString(),
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      "itemCondition": "https://schema.org/NewCondition",
      "availability": inStock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Alsa Fragrance",
        "url": baseUrl
      }
    },
    "aggregateRating": product.rating && product.reviews 
      ? {
          "@type": "AggregateRating",
          "ratingValue": product.rating.toString(),
          "reviewCount": product.reviews.toString(),
          "bestRating": "5",
          "worstRating": "1"
        }
      : undefined,
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Category",
        "value": product.category || "Fragrance"
      },
      ...(product.notes?.top && product.notes.top.length > 0 
        ? [{
            "@type": "PropertyValue",
            "name": "Top Notes",
            "value": product.notes.top.join(", ")
          }]
        : []),
      ...(product.notes?.middle && product.notes.middle.length > 0
        ? [{
            "@type": "PropertyValue",
            "name": "Middle Notes",
            "value": product.notes.middle.join(", ")
          }]
        : []),
      ...(product.notes?.base && product.notes.base.length > 0
        ? [{
            "@type": "PropertyValue",
            "name": "Base Notes",
            "value": product.notes.base.join(", ")
          }]
        : []),
    ].filter(prop => prop !== undefined)
  }

  // Remove undefined aggregateRating if not available
  if (!productSchema.aggregateRating) {
    delete productSchema.aggregateRating
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Shop",
        "item": `${baseUrl}/shop`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.category || "Fragrance",
        "item": `${baseUrl}/${product.category || "shop"}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": product.name,
        "item": productUrl
      }
    ]
  }

  return (
    <>
      <Script
        id="product-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id="product-breadcrumb-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
