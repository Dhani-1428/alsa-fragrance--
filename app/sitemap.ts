import { MetadataRoute } from 'next'
import connectDB from '@/lib/mysql'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.alsafragrance.com'
  const now = new Date()
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          en: baseUrl,
          pt: `${baseUrl}?lang=pt`,
          hi: `${baseUrl}?lang=hi`,
          ar: `${baseUrl}?lang=ar`,
          ur: `${baseUrl}?lang=ur`,
          fr: `${baseUrl}?lang=fr`,
          es: `${baseUrl}?lang=es`,
        },
      },
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/men`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/women`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/attars`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/testers`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/limited-edition`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/new-arrivals`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = []
  
  try {
    await connectDB()
    const { findAllProducts } = await import('@/lib/models-mysql/Product')
    const products = await findAllProducts()
    
    productPages = products
      .filter((product) => product.id && product.id > 0)
      .map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    
    console.log(`✅ Added ${productPages.length} product pages to sitemap`)
  } catch (error) {
    console.error('❌ Error fetching products for sitemap:', error)
    // Continue without product pages if database fails
  }

  return [...staticPages, ...productPages]
}
