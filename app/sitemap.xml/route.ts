import { NextResponse } from 'next/server'
import connectDB from '@/lib/mysql'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.alsafragrance.com'
  const now = new Date()
  const today = now.toISOString().split('T')[0] // YYYY-MM-DD format
  
  // Static pages
  const staticPages = [
    { url: baseUrl, changefreq: 'daily', priority: '1.0' },
    { url: `${baseUrl}/shop`, changefreq: 'weekly', priority: '0.8' },
    { url: `${baseUrl}/men`, changefreq: 'weekly', priority: '0.8' },
    { url: `${baseUrl}/women`, changefreq: 'weekly', priority: '0.8' },
    { url: `${baseUrl}/attars`, changefreq: 'weekly', priority: '0.8' },
    { url: `${baseUrl}/testers`, changefreq: 'weekly', priority: '0.8' },
    { url: `${baseUrl}/limited-edition`, changefreq: 'weekly', priority: '0.8' },
    { url: `${baseUrl}/new-arrivals`, changefreq: 'weekly', priority: '0.8' },
    { url: `${baseUrl}/about`, changefreq: 'monthly', priority: '0.6' },
    { url: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.6' },
  ]

  // Dynamic product pages
  let productPages: Array<{ url: string }> = []
  
  try {
    await connectDB()
    const { findAllProducts } = await import('@/lib/models-mysql/Product')
    const products = await findAllProducts()
    
    productPages = products
      .filter((product) => product.id && product.id > 0)
      .map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
      }))
  } catch (error) {
    console.error('❌ Error fetching products for sitemap:', error)
  }

  // Generate XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  // Add static pages
  for (const page of staticPages) {
    xml += `  <url>\n`
    xml += `    <loc>${page.url}</loc>\n`
    xml += `    <lastmod>${today}</lastmod>\n`
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`
    xml += `    <priority>${page.priority}</priority>\n`
    xml += `  </url>\n`
  }

  // Add product pages
  for (const product of productPages) {
    xml += `  <url>\n`
    xml += `    <loc>${product.url}</loc>\n`
    xml += `    <lastmod>${today}</lastmod>\n`
    xml += `    <changefreq>weekly</changefreq>\n`
    xml += `    <priority>0.7</priority>\n`
    xml += `  </url>\n`
  }

  xml += '</urlset>'

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
