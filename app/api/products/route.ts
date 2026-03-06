import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mysql'
import { handleDatabaseError } from '@/lib/db-error-handler'
import { getTranslatedProduct } from '@/lib/i18n/product-translations'

// GET all products
export async function GET(request: NextRequest) {
  try {
    try {
      await connectDB()
    } catch (dbError: any) {
      return handleDatabaseError(dbError)
    }
    
    // Ensure we're using the correct database
    const { query } = await import('@/lib/mysql')
    try {
      const dbResult: any = await query('SELECT DATABASE() as currentDb')
      const currentDb = dbResult[0]?.currentDb
      const expectedDb = process.env.MYSQL_DATABASE
      
      console.log(`📊 Current database: ${currentDb}, Expected: ${expectedDb}`)
      
      if (currentDb !== expectedDb && expectedDb) {
        console.log(`🔄 Switching to database: ${expectedDb}`)
        await query(`USE \`${expectedDb}\``)
        console.log(`✅ Switched to database: ${expectedDb}`)
      }
    } catch (dbSwitchError: any) {
      console.error('⚠️  Database switch error:', dbSwitchError.message)
      // Continue anyway - might still work
    }
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const onSale = searchParams.get('onSale')
    const isNew = searchParams.get('isNew')

    // Use the MySQL model function instead of Product.find()
    console.log('📋 Fetching products from database...')
    console.log('📋 Filter - category:', category || 'none')
    
    const { findAllProducts } = await import('@/lib/models-mysql/Product')
    let allProducts: any[] = []
    
    try {
      allProducts = await findAllProducts({ category: category || undefined })
      console.log(`✅ Successfully fetched ${allProducts.length} products from database`)
    } catch (dbError: any) {
      console.error('❌ Error fetching products from database:', dbError)
      console.error('Database error details:', {
        message: dbError?.message,
        code: dbError?.code,
        errno: dbError?.errno,
        sqlState: dbError?.sqlState,
      })
      
      // If table doesn't exist, provide helpful error
      if (dbError.code === 'ER_NO_SUCH_TABLE' || dbError.message?.includes("doesn't exist")) {
        const dbCheck: any = await query('SELECT DATABASE() as currentDb')
        const currentDb = dbCheck[0]?.currentDb
        throw new Error(
          `Database table 'products' not found in database '${currentDb}'. ` +
          `Expected database: '${process.env.MYSQL_DATABASE}'. ` +
          `Please run: npm run db:setup`
        )
      }
      
      throw dbError // Re-throw to be caught by outer catch block
    }
    
    // Apply additional filters
    let filteredProducts = allProducts
    if (onSale === 'true') {
      filteredProducts = filteredProducts.filter(p => p.isSale === true)
    }
    if (isNew === 'true') {
      filteredProducts = filteredProducts.filter(p => p.isNew === true)
    }

    // Get language from query parameter (default to 'en')
    const languageParam = searchParams.get('lang') as "en" | "pt" | "hi" | "ar" | "ur" | "fr" | "es" | null
    const language = languageParam || "en"

    // Transform products to match frontend format - filter out products without valid IDs
    const transformedProducts = filteredProducts
      .filter((product) => {
        // Ensure product has valid ID and required fields
        const hasValidId = product.id != null && product.id !== undefined && product.id > 0
        const hasName = product.name && product.name.trim().length > 0
        const hasImage = product.image && product.image.trim().length > 0
        return hasValidId && hasName && hasImage
      })
      .map((product) => {
        try {
          // Get translated name and description
          const translated = getTranslatedProduct(
            product.id!,
            product.name,
            product.description,
            language
          )
          
          return {
            id: product.id!.toString(), // Safe to use ! here since we filtered
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
        } catch (translationError: any) {
          console.error(`⚠️  Error translating product ${product.id}:`, translationError)
          // Return product without translation on error
          return {
            id: product.id!.toString(),
            name: product.name,
            category: product.category,
            price: product.price,
            originalPrice: product.originalPrice || product.price,
            salePrice: product.salePrice || undefined,
            salePercent: product.salePercent || undefined,
            rating: product.rating,
            reviews: product.reviews,
            image: product.image,
            images: product.images || [],
            description: product.description,
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
        }
      })

    // Return with no-cache headers to ensure fresh data
    return NextResponse.json(transformedProducts, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error: any) {
    console.error('❌ Error fetching products:', error)
    console.error('Error name:', error?.name)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    console.error('Error code:', error?.code)
    
    // Handle MySQL connection errors
    if (error.message && (error.message.includes('ECONNREFUSED') || error.message.includes('MySQL') || error.message.includes('ER_') || error.code === 'ECONNREFUSED')) {
      return NextResponse.json(
        { 
          error: 'MySQL connection failed. Please check your database configuration.',
          details: error.message,
          code: error.code
        },
        { status: 503 }
      )
    }
    
    // Handle database query errors
    if (error.code && error.code.startsWith('ER_')) {
      let errorMessage = 'Database query error.'
      let errorDetails = error.message
      
      if (error.code === 'ER_NO_SUCH_TABLE') {
        errorMessage = 'Database table not found'
        errorDetails = `The products table does not exist in the current database. Please run: npm run db:setup to create all required tables (users, products, orders).`
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorDetails,
          code: error.code
        },
        { status: 500 }
      )
    }
    
    // Handle MongoDB connection errors (for backward compatibility)
    if (error.message && error.message.includes('IP')) {
      return NextResponse.json(
        { 
          error: 'MongoDB connection failed: Your IP address is not whitelisted. Please add your IP to MongoDB Atlas IP whitelist.',
          details: 'Visit https://www.mongodb.com/docs/atlas/security-whitelist/ for instructions.'
        },
        { status: 503 }
      )
    }
    
    if (error.name === 'MongoServerError' || error.message?.includes('MongoDB') || error.message?.includes('Atlas')) {
      return NextResponse.json(
        { 
          error: 'Database connection error. Please check your MongoDB Atlas configuration and IP whitelist settings.',
          details: error.message
        },
        { status: 503 }
      )
    }
    
    // Return detailed error in development, generic in production
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch products',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        code: error.code
      },
      { status: 500 }
    )
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    try {
      await connectDB()
    } catch (dbError: any) {
      return handleDatabaseError(dbError)
    }
    
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

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 })
    }
    if (!category || !category.trim()) {
      return NextResponse.json({ error: 'Product category is required' }, { status: 400 })
    }
    if (!price || isNaN(parseFloat(price))) {
      return NextResponse.json({ error: 'Valid product price is required' }, { status: 400 })
    }
    if (!image || !image.trim()) {
      return NextResponse.json({ error: 'Product image is required' }, { status: 400 })
    }
    if (!description || !description.trim()) {
      return NextResponse.json({ error: 'Product description is required' }, { status: 400 })
    }

    const { createProduct } = await import('@/lib/models-mysql/Product')
    const product = await createProduct({
      name: name.trim(),
      category: category.trim(),
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      salePrice: salePrice ? parseFloat(salePrice) : undefined,
      salePercent: salePercent ? parseFloat(salePercent) : undefined,
      rating: rating ? parseFloat(rating) : 0,
      reviews: reviews || 0,
      image: image.trim(),
      images: images && Array.isArray(images) ? images : undefined,
      description: description.trim(),
      notesTop: notes?.top && Array.isArray(notes.top) ? notes.top : undefined,
      notesMiddle: notes?.middle && Array.isArray(notes.middle) ? notes.middle : undefined,
      notesBase: notes?.base && Array.isArray(notes.base) ? notes.base : undefined,
      size: size && Array.isArray(size) ? size : undefined,
      inStock: inStock !== undefined ? inStock : true,
      isNew: isNew || false,
      isSale: isSale || false,
      badge: badge ? badge.trim() : undefined,
    })

    return NextResponse.json({
      id: product.id?.toString() || '',
      ...product,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    
    // Handle MongoDB connection errors
    if (error.message && error.message.includes('IP')) {
      return NextResponse.json(
        { 
          error: 'MongoDB connection failed: Your IP address is not whitelisted. Please add your IP to MongoDB Atlas IP whitelist.',
          details: 'Visit https://www.mongodb.com/docs/atlas/security-whitelist/ for instructions.'
        },
        { status: 503 }
      )
    }
    
    if (error.name === 'MongoServerError' || error.message?.includes('MongoDB') || error.message?.includes('Atlas')) {
      return NextResponse.json(
        { 
          error: 'Database connection error. Please check your MongoDB Atlas configuration and IP whitelist settings.',
          details: error.message
        },
        { status: 503 }
      )
    }
    
    // Handle duplicate key errors
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'A product with this name already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    )
  }
}

