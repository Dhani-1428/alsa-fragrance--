// Product translations mapping
// Maps product names and descriptions by language
// Format: product_id: { en: { name, description }, pt: { name, description }, ... }
// Add translations by matching product IDs from the database

export const productTranslations: Record<
  string,
  Partial<Record<"en" | "pt" | "hi" | "ar" | "ur", { name?: string; description?: string }>>
> = {
  // Add product translations here
  // Example:
  // "1": {
  //   en: { name: "Product Name", description: "Product description in English" },
  //   pt: { name: "Nome do Produto", description: "Descrição do produto em português" },
  //   hi: { name: "उत्पाद का नाम", description: "हिंदी में उत्पाद विवरण" },
  //   ar: { name: "اسم المنتج", description: "وصف المنتج بالعربية" },
  //   ur: { name: "مصنوعات کا نام", description: "اردو میں مصنوعات کی تفصیل" },
  // },
}

/**
 * Get translated product name and description
 * Falls back to original if translation not available
 */
export function getTranslatedProduct(
  productId: string | number,
  originalName: string,
  originalDescription: string,
  language: "en" | "pt" | "hi" | "ar" | "ur"
): { name: string; description: string } {
  const id = String(productId)
  const translations = productTranslations[id]
  
  if (!translations || !translations[language]) {
    return {
      name: originalName,
      description: originalDescription,
    }
  }
  
  const langTranslations = translations[language]
  return {
    name: langTranslations?.name || originalName,
    description: langTranslations?.description || originalDescription,
  }
}
