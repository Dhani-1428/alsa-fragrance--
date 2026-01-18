import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mysql'
import Product from '@/lib/models-mysql/Product'
import { handleDatabaseError } from '@/lib/db-error-handler'
import { getTranslatedProduct } from '@/lib/i18n/product-translations'

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    try {
      await connectDB()
    } catch (dbError: any) {
      return handleDatabaseError(dbError)
    }
    
    // Handle both async and sync params (Next.js 15+ uses Promise)
    const resolvedParams = params instanceof Promise ? await params : params
    const productIdStr = String(resolvedParams.id || '').trim()
    
    if (!productIdStr) {
      console.error("Empty product ID in API request")
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }
    
    const productId = parseInt(productIdStr, 10)
    if (isNaN(productId) || productId <= 0) {
      console.error("Invalid product ID in API request:", resolvedParams.id, "Parsed as:", productId)
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }
    
    console.log("API: Looking for product with ID:", productId)
    const { findProductById } = await import('@/lib/models-mysql/Product')
    const product = await findProductById(productId)
    
    console.log("API: Product lookup result:", product ? `Found: ${product.name}` : "Not found")

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Get language from query parameter (default to 'en')
    const { searchParams } = new URL(request.url)
        const languageParam = searchParams.get('lang') as "en" | "pt" | "hi" | "ar" | "ur" | "fr" | "es" | null
    const language = languageParam || "en"

    // Get translated name and description
    const translated = getTranslatedProduct(
      product.id!,
      product.name,
      product.description,
      language
    )

    // Transform product to match frontend format
    const transformedProduct = {
      id: product.id?.toString() || '',
      name: translated.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      salePrice: product.salePrice || undefined,
      salePercent: product.salePercent || undefined,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image,
      images: product.images || [],
      description: translated.description,
      notes: {
        top: product.notesTop || [],
        middle: product.notesMiddle || [],
        base: product.notesBase || [],
      },
      size: product.size || [],
      inStock: product.inStock,
      isNew: product.isNew,
      isSale: product.isSale,
      badge: product.badge,
    }

    return NextResponse.json(transformedProduct)
  } catch (error: any) {
    console.error('Error fetching product:', error)
    
    // Handle MySQL connection errors
    if (error.message && (error.message.includes('ECONNREFUSED') || error.message.includes('MySQL'))) {
      return NextResponse.json(
        { 
          error: 'MySQL connection failed. Please check your database configuration.',
          details: error.message
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json({ error: error.message || 'Failed to fetch product' }, { status: 500 })
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    try {
      await connectDB()
    } catch (dbError: any) {
      return handleDatabaseError(dbError)
    }
    
    // Handle both async and sync params (Next.js 15+ uses Promise)
    const resolvedParams = params instanceof Promise ? await params : params
    const body = await request.json()
    const {
      name,
      category,
      price,
      originalPrice,
      salePrice,
      salePercent,
      rating,
      reviews,
      image,
      images,
      description,
      notes,
      size,
      inStock,
      isNew,
      isSale,
      badge,
    } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (category !== undefined) updateData.category = category
    if (price !== undefined) updateData.price = parseFloat(price)
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? parseFloat(originalPrice) : null
    if (salePrice !== undefined) updateData.salePrice = salePrice ? parseFloat(salePrice) : null
    if (salePercent !== undefined) updateData.salePercent = salePercent ? parseFloat(salePercent) : null
    if (rating !== undefined) updateData.rating = parseFloat(rating)
    if (reviews !== undefined) updateData.reviews = reviews
    if (image !== undefined) updateData.image = image
    if (images !== undefined) updateData.images = images || []
    if (description !== undefined) updateData.description = description
    if (notes?.top !== undefined) updateData.notesTop = notes.top || []
    if (notes?.middle !== undefined) updateData.notesMiddle = notes.middle || []
    if (notes?.base !== undefined) updateData.notesBase = notes.base || []
    if (size !== undefined) updateData.size = size || []
    if (inStock !== undefined) updateData.inStock = inStock
    if (isNew !== undefined) updateData.isNew = isNew
    if (isSale !== undefined) updateData.isSale = isSale
    if (badge !== undefined) updateData.badge = badge || null

    const productIdStr = String(resolvedParams.id || '').trim()
    if (!productIdStr) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }
    
    const productId = parseInt(productIdStr, 10)
    if (isNaN(productId) || productId <= 0) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }
    
    console.log(`📝 API: Updating product ${productId}`)
    console.log(`📝 API: Update data received:`, JSON.stringify(updateData, null, 2))
    
    const { updateProduct } = await import('@/lib/models-mysql/Product')
    const product = await updateProduct(productId, updateData)

    if (!product) {
      console.error(`❌ API: Product ${productId} not found after update`)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    console.log(`✅ API: Product ${productId} updated successfully`)
    return NextResponse.json({
      id: product.id?.toString() || '',
      ...product,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error: any) {
    console.error('Error updating product:', error)
    
    // Handle MySQL connection errors
    if (error.message && (error.message.includes('ECONNREFUSED') || error.message.includes('MySQL'))) {
      return NextResponse.json(
        { 
          error: 'MySQL connection failed. Please check your database configuration.',
          details: error.message
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 })
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    try {
      await connectDB()
    } catch (dbError: any) {
      return handleDatabaseError(dbError)
    }
    
    // Handle both async and sync params (Next.js 15+ uses Promise)
    const resolvedParams = params instanceof Promise ? await params : params

    const productIdStr = resolvedParams.id
    const productId = parseInt(productIdStr)
    
    console.log('DELETE request - Product ID string:', productIdStr, 'Parsed ID:', productId)
    
    // Validate product ID
    if (isNaN(productId) || productId <= 0) {
      console.error('Invalid product ID:', productIdStr, 'Parsed as:', productId)
      return NextResponse.json({ error: `Invalid product ID: ${productIdStr}` }, { status: 400 })
    }

    const { deleteProduct, findProductById } = await import('@/lib/models-mysql/Product')
    
    // Check if product exists before deleting
    console.log('Looking for product with ID:', productId)
    const existingProduct = await findProductById(productId)
    console.log('Product lookup result:', existingProduct ? `Found: ${existingProduct.name}` : 'Not found')
    
    if (!existingProduct) {
      console.error('Product not found with ID:', productId, 'Type:', typeof productId)
      // Try to find all products to debug
      const { findAllProducts } = await import('@/lib/models-mysql/Product')
      const allProducts = await findAllProducts()
      console.log('Total products in database:', allProducts.length)
      console.log('Product IDs in database:', allProducts.map(p => ({ id: p.id, type: typeof p.id })))
      return NextResponse.json({ error: `Product not found with ID: ${productId}` }, { status: 404 })
    }

    console.log('Deleting product:', existingProduct.id, existingProduct.name)
    const deleted = await deleteProduct(productId)
    if (!deleted) {
      console.error('Failed to delete product with ID:', productId)
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }

    console.log('Product deleted successfully:', productId)
    return NextResponse.json({ 
      message: 'Product deleted successfully', 
      id: existingProduct.id?.toString() || '' 
    })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    
    // Handle MySQL connection errors
    if (error.message && (error.message.includes('ECONNREFUSED') || error.message.includes('MySQL'))) {
      return NextResponse.json(
        { 
          error: 'MySQL connection failed. Please check your database configuration.',
          details: error.message
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    )
  }
}

