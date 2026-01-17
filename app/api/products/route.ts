import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mysql'
import { handleDatabaseError } from '@/lib/db-error-handler'

// GET all products
export async function GET(request: NextRequest) {
  try {
    try {
      await connectDB()
    } catch (dbError: any) {
      return handleDatabaseError(dbError)
    }
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const onSale = searchParams.get('onSale')
    const isNew = searchParams.get('isNew')

    // Use the MySQL model function instead of Product.find()
    const { findAllProducts } = await import('@/lib/models-mysql/Product')
    const allProducts = await findAllProducts({ category: category || undefined })
    
    // Apply additional filters
    let filteredProducts = allProducts
    if (onSale === 'true') {
      filteredProducts = filteredProducts.filter(p => p.isSale === true)
    }
    if (isNew === 'true') {
      filteredProducts = filteredProducts.filter(p => p.isNew === true)
    }

    // Transform products to match frontend format - filter out products without valid IDs
    const transformedProducts = filteredProducts
      .filter((product) => product.id != null && product.id !== undefined && product.id > 0)
      .map((product) => {
        return {
          id: product.id!.toString(), // Safe to use ! here since we filtered
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
      })

    return NextResponse.json(transformedProducts)
  } catch (error: any) {
    console.error('Error fetching products:', error)
    
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
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
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

