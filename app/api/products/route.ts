import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const onSale = searchParams.get('onSale')
    const isNew = searchParams.get('isNew')

    const where: any = {}
    if (category) where.category = category
    if (onSale === 'true') where.isSale = true
    if (isNew === 'true') where.isNew = true

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Transform products to match frontend format
    const transformedProducts = products.map((product) => {
      let images: string[] = []
      let notesTop: string[] = []
      let notesMiddle: string[] = []
      let notesBase: string[] = []
      let size: string[] = []

      try {
        if (product.images) images = JSON.parse(product.images)
      } catch (e) {
        console.error('Error parsing images:', e)
      }

      try {
        if (product.notesTop) notesTop = JSON.parse(product.notesTop)
      } catch (e) {
        console.error('Error parsing notesTop:', e)
      }

      try {
        if (product.notesMiddle) notesMiddle = JSON.parse(product.notesMiddle)
      } catch (e) {
        console.error('Error parsing notesMiddle:', e)
      }

      try {
        if (product.notesBase) notesBase = JSON.parse(product.notesBase)
      } catch (e) {
        console.error('Error parsing notesBase:', e)
      }

      try {
        if (product.size) size = JSON.parse(product.size)
      } catch (e) {
        console.error('Error parsing size:', e)
      }

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.isSale && product.salePrice ? product.salePrice : product.price,
        originalPrice: product.originalPrice || product.price,
        rating: product.rating,
        reviews: product.reviews,
        image: product.image,
        images,
        description: product.description,
        notes: {
          top: notesTop,
          middle: notesMiddle,
          base: notesBase,
        },
        size,
        inStock: product.inStock,
        isNew: product.isNew,
        isSale: product.isSale,
        badge: product.badge,
      }
    })

    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
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

    const product = await prisma.product.create({
      data: {
        name,
        category,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        salePrice: salePrice ? parseFloat(salePrice) : null,
        salePercent: salePercent ? parseFloat(salePercent) : null,
        rating: rating ? parseFloat(rating) : 0,
        reviews: reviews || 0,
        image,
        images: images ? JSON.stringify(images) : null,
        description,
        notesTop: notes?.top ? JSON.stringify(notes.top) : null,
        notesMiddle: notes?.middle ? JSON.stringify(notes.middle) : null,
        notesBase: notes?.base ? JSON.stringify(notes.base) : null,
        size: size ? JSON.stringify(size) : null,
        inStock: inStock !== undefined ? inStock : true,
        isNew: isNew || false,
        isSale: isSale || false,
        badge: badge || null,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

