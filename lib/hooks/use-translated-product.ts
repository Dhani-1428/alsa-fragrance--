import { useMemo } from "react"
import { useLanguage } from "@/contexts/language-provider"
import { getTranslatedProduct } from "@/lib/i18n/product-translations"
import type { Product } from "@/lib/products-api"

/**
 * Hook to get translated product name and description
 * Falls back to original if translation not available
 */
export function useTranslatedProduct(product: Product) {
  const { language } = useLanguage()
  
  const translated = useMemo(() => {
    return getTranslatedProduct(
      product.id,
      product.name,
      product.description,
      language as "en" | "pt" | "hi" | "ar" | "ur"
    )
  }, [product.id, product.name, product.description, language])
  
  return {
    ...product,
    name: translated.name,
    description: translated.description,
  }
}
