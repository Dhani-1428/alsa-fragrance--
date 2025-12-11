import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'

const limitedEditionProducts = [
  {
    name: "Alsa Fragrance - Diamond Collection",
    category: "women",
    price: 199.99,
    rating: 5.0,
    reviews: 45,
    image: "/crystal-clear-perfume-bottle-with-silver-alsa-frag.jpg",
    images: ["/crystal-clear-perfume-bottle-with-silver-alsa-frag.jpg"],
    description: "An exclusive limited edition fragrance with diamond-like brilliance and luxury.",
    notesTop: ["Diamond Accord", "Champagne", "Sparkling Notes"],
    notesMiddle: ["White Flowers", "Peony", "Lotus"],
    notesBase: ["Platinum Musk", "Crystal Amber", "Cashmere"],
    size: ["50ml", "100ml"],
    inStock: true,
    isNew: false,
    isSale: false,
    badge: "Limited Edition",
  },
  {
    name: "Alsa Fragrance - Royal Crown Limited",
    category: "men",
    price: 219.99,
    rating: 5.0,
    reviews: 38,
    image: "/royal-gold-cologne-bottle-with-crown-alsa-fragranc.jpg",
    images: ["/royal-gold-cologne-bottle-with-crown-alsa-fragranc.jpg"],
    description: "A limited edition royal fragrance with exclusive packaging and premium ingredients.",
    notesTop: ["Royal Saffron", "Bergamot", "Pink Pepper"],
    notesMiddle: ["Royal Rose", "Oud", "Cinnamon"],
    notesBase: ["Royal Amber", "Sandalwood", "Musk"],
    size: ["50ml", "100ml"],
    inStock: true,
    isNew: false,
    isSale: false,
    badge: "Limited Edition",
  },
  {
    name: "Alsa Fragrance - Black Diamond Oud Limited",
    category: "attars",
    price: 299.99,
    rating: 5.0,
    reviews: 28,
    image: "/royal-oud-perfume-bottles-luxury-gold.jpg",
    images: ["/royal-oud-perfume-bottles-luxury-gold.jpg"],
    description: "An ultra-exclusive limited edition oud attar with rare black diamond oud.",
    notesTop: ["Cambodian Oud"],
    notesMiddle: ["Black Diamond Oud", "Rose"],
    notesBase: ["Oud Absolute", "Amber", "Musk"],
    size: ["6ml", "12ml"],
    inStock: true,
    isNew: false,
    isSale: false,
    badge: "Limited Edition",
  },
  {
    name: "Alsa Fragrance - Platinum Collection",
    category: "women",
    price: 189.99,
    rating: 4.9,
    reviews: 52,
    image: "/platinum-silver-cologne-bottle-with-alsa-fragrance.jpg",
    images: ["/platinum-silver-cologne-bottle-with-alsa-fragrance.jpg"],
    description: "A limited edition platinum collection fragrance with exclusive design.",
    notesTop: ["Platinum Accord", "Pear", "Bergamot"],
    notesMiddle: ["White Flowers", "Magnolia", "Jasmine"],
    notesBase: ["Platinum Musk", "Amber", "Cashmere"],
    size: ["50ml", "100ml"],
    inStock: true,
    isNew: false,
    isSale: false,
    badge: "Limited Edition",
  },
  {
    name: "Alsa Fragrance - Titanium Elite Limited",
    category: "men",
    price: 209.99,
    rating: 4.9,
    reviews: 41,
    image: "/powerful-titanium-cologne-bottle-with-alsa-fragran.jpg",
    images: ["/powerful-titanium-cologne-bottle-with-alsa-fragran.jpg"],
    description: "An exclusive limited edition titanium fragrance with premium packaging.",
    notesTop: ["Titanium Accord", "Grapefruit", "Black Pepper"],
    notesMiddle: ["Cedar", "Vetiver", "Spice"],
    notesBase: ["Leather", "Amber", "Musk"],
    size: ["50ml", "100ml"],
    inStock: true,
    isNew: false,
    isSale: false,
    badge: "Limited Edition",
  },
  {
    name: "Alsa Fragrance - Emerald Collection",
    category: "women",
    price: 179.99,
    rating: 4.8,
    reviews: 67,
    image: "/emerald-green-perfume-bottle-with-gold-alsa-fragra.jpg",
    images: ["/emerald-green-perfume-bottle-with-gold-alsa-fragra.jpg"],
    description: "A limited edition emerald collection with exclusive green floral notes.",
    notesTop: ["Green Mandarin", "Basil", "Mint"],
    notesMiddle: ["Green Tea", "Bamboo", "Lily of the Valley"],
    notesBase: ["Vetiver", "White Cedar", "Green Musk"],
    size: ["50ml", "100ml"],
    inStock: true,
    isNew: false,
    isSale: false,
    badge: "Limited Edition",
  },
  {
    name: "Alsa Fragrance - Sapphire Collection",
    category: "men",
    price: 194.99,
    rating: 4.9,
    reviews: 55,
    image: "/luxury-blue-sapphire-perfume-bottle-with-alsa-frag.jpg",
    images: ["/luxury-blue-sapphire-perfume-bottle-with-alsa-frag.jpg"],
    description: "A limited edition sapphire collection with deep aquatic luxury.",
    notesTop: ["Sapphire Accord", "Sea Salt", "Bergamot"],
    notesMiddle: ["Marine Notes", "Sage", "Geranium"],
    notesBase: ["Driftwood", "Ambergris", "White Musk"],
    size: ["50ml", "100ml"],
    inStock: true,
    isNew: false,
    isSale: false,
    badge: "Limited Edition",
  },
  {
    name: "Alsa Fragrance - Ruby Collection",
    category: "women",
    price: 184.99,
    rating: 4.8,
    reviews: 59,
    image: "/red-ruby-perfume-bottle-with-alsa-fragrance-logo-e.jpg",
    images: ["/red-ruby-perfume-bottle-with-alsa-fragrance-logo-e.jpg"],
    description: "A limited edition ruby collection with passionate red floral notes.",
    notesTop: ["Ruby Accord", "Red Berry", "Pink Pepper"],
    notesMiddle: ["Red Rose", "Peony", "Violet"],
    notesBase: ["Amber", "Musk", "Patchouli"],
    size: ["50ml", "100ml"],
    inStock: true,
    isNew: false,
    isSale: false,
    badge: "Limited Edition",
  },
  {
    name: "Alsa Fragrance - Golden Hour Limited",
    category: "women",
    price: 174.99,
    rating: 4.9,
    reviews: 73,
    image: "/golden-amber-perfume-bottle-with-alsa-fragrance-lo.jpg",
    images: ["/golden-amber-perfume-bottle-with-alsa-fragrance-lo.jpg"],
    description: "A limited edition golden hour fragrance capturing the magic of sunset.",
    notesTop: ["Golden Accord", "Orange Blossom", "Peach"],
    notesMiddle: ["Tuberose", "Ylang-Ylang", "Coconut"],
    notesBase: ["Amber", "Sandalwood", "Tonka Bean"],
    size: ["50ml", "100ml"],
    inStock: true,
    isNew: false,
    isSale: false,
    badge: "Limited Edition",
  },
  {
    name: "Alsa Fragrance - Midnight Storm Limited",
    category: "men",
    price: 204.99,
    rating: 5.0,
    reviews: 48,
    image: "/dark-storm-cologne-bottle-with-lightning-alsa-frag.jpg",
    images: ["/dark-storm-cologne-bottle-with-lightning-alsa-frag.jpg"],
    description: "An exclusive limited edition storm fragrance with intense power.",
    notesTop: ["Storm Accord", "Black Pepper", "Grapefruit"],
    notesMiddle: ["Cypress", "Juniper", "Spice"],
    notesBase: ["Dark Woods", "Leather", "Smoky Amber"],
    size: ["50ml", "100ml"],
    inStock: true,
    isNew: false,
    isSale: false,
    badge: "Limited Edition",
  },
]

const newArrivalsProducts = [
  {
    name: "Alsa Fragrance - Fresh Bloom",
    category: "women",
    price: 89.99,
    rating: 4.7,
    reviews: 123,
    image: "/pink-rose-gold-perfume-bottle-with-alsa-fragrance-.jpg",
    images: ["/pink-rose-gold-perfume-bottle-with-alsa-fragrance-.jpg"],
    description: "A fresh new arrival with blooming floral notes and modern elegance.",
    notesTop: ["Peony", "Raspberry", "Bergamot"],
    notesMiddle: ["Garden Rose", "Jasmine", "Lilac"],
    notesBase: ["Musk", "Vanilla", "Cedarwood"],
    size: ["30ml", "50ml", "100ml"],
    inStock: true,
    isNew: true,
    isSale: false,
    badge: "New",
  },
  {
    name: "Alsa Fragrance - Modern Edge",
    category: "men",
    price: 92.99,
    rating: 4.8,
    reviews: 156,
    image: "/modern-black-cologne-bottle-with-silver-alsa-fragr.jpg",
    images: ["/modern-black-cologne-bottle-with-silver-alsa-fragr.jpg"],
    description: "A cutting-edge new arrival for the modern gentleman.",
    notesTop: ["Lemon", "Grapefruit", "Mint"],
    notesMiddle: ["Lavender", "Geranium", "Cardamom"],
    notesBase: ["Cedarwood", "Vetiver", "Ambergris"],
    size: ["50ml", "100ml"],
    inStock: true,
    isNew: true,
    isSale: false,
    badge: "New",
  },
  {
    name: "Alsa Fragrance - Pure Essence",
    category: "attars",
    price: 124.99,
    rating: 4.6,
    reviews: 98,
    image: "/crystal-clear-perfume-bottle-with-silver-alsa-frag.jpg",
    images: ["/crystal-clear-perfume-bottle-with-silver-alsa-frag.jpg"],
    description: "A new arrival attar with pure, clean notes of spiritual harmony.",
    notesTop: ["White Musk"],
    notesMiddle: ["Clean Musk", "Soft Florals"],
    notesBase: ["Musk Absolute", "White Amber", "Soft Woods"],
    size: ["6ml", "12ml"],
    inStock: true,
    isNew: true,
    isSale: false,
    badge: "New",
  },
  {
    name: "Alsa Fragrance - Sunset Dreams",
    category: "women",
    price: 87.99,
    rating: 4.7,
    reviews: 134,
    image: "/golden-amber-perfume-bottle-with-alsa-fragrance-lo.jpg",
    images: ["/golden-amber-perfume-bottle-with-alsa-fragrance-lo.jpg"],
    description: "A dreamy new arrival that captures the warmth of sunset.",
    notesTop: ["Orange Blossom", "Peach", "Ginger"],
    notesMiddle: ["Tuberose", "Ylang-Ylang", "Coconut"],
    notesBase: ["Amber", "Sandalwood", "Tonka Bean"],
    size: ["30ml", "50ml", "100ml"],
    inStock: true,
    isNew: true,
    isSale: false,
    badge: "New",
  },
  {
    name: "Alsa Fragrance - Urban Fresh",
    category: "men",
    price: 90.99,
    rating: 4.8,
    reviews: 167,
    image: "/blue-ocean-cologne-bottle-with-white-alsa-fragranc.jpg",
    images: ["/blue-ocean-cologne-bottle-with-white-alsa-fragranc.jpg"],
    description: "A fresh new arrival with urban sophistication and coastal freshness.",
    notesTop: ["Sea Salt", "Bergamot", "Aquatic Notes"],
    notesMiddle: ["Marine Accord", "Sage", "Geranium"],
    notesBase: ["Driftwood", "Ambergris", "White Musk"],
    size: ["50ml", "100ml"],
    inStock: true,
    isNew: true,
    isSale: false,
    badge: "New",
  },
  {
    name: "Alsa Fragrance - Velvet Touch",
    category: "women",
    price: 96.99,
    rating: 4.9,
    reviews: 189,
    image: "/elegant-black-perfume-bottle-with-gold-alsa-fragra.jpg",
    images: ["/elegant-black-perfume-bottle-with-gold-alsa-fragra.jpg"],
    description: "A luxurious new arrival with velvety softness and rich depth.",
    notesTop: ["Black Currant", "Pink Pepper", "Mandarin"],
    notesMiddle: ["Velvet Rose", "Peony", "Violet"],
    notesBase: ["Patchouli", "Amber", "Musk"],
    size: ["30ml", "50ml", "100ml"],
    inStock: true,
    isNew: true,
    isSale: false,
    badge: "New",
  },
  {
    name: "Alsa Fragrance - Forest Fresh",
    category: "men",
    price: 94.99,
    rating: 4.7,
    reviews: 145,
    image: "/forest-green-cologne-bottle-with-tree-alsa-fragran.jpg",
    images: ["/forest-green-cologne-bottle-with-tree-alsa-fragran.jpg"],
    description: "A new arrival with fresh forest notes and natural masculinity.",
    notesTop: ["Pine", "Eucalyptus", "Lemon"],
    notesMiddle: ["Cedar", "Fir", "Sage"],
    notesBase: ["Oakmoss", "Patchouli", "Amber"],
    size: ["50ml", "100ml"],
    inStock: true,
    isNew: true,
    isSale: false,
    badge: "New",
  },
  {
    name: "Alsa Fragrance - Rose Absolute",
    category: "attars",
    price: 129.99,
    rating: 4.8,
    reviews: 112,
    image: "/rose-jasmine-flowers-perfume-heart-notes-floral-bo.jpg",
    images: ["/rose-jasmine-flowers-perfume-heart-notes-floral-bo.jpg"],
    description: "A new arrival attar with the pure essence of absolute rose.",
    notesTop: ["Bulgarian Rose", "Turkish Rose"],
    notesMiddle: ["Damask Rose", "Rose Otto"],
    notesBase: ["Rose Absolute", "Sandalwood", "Musk"],
    size: ["6ml", "12ml"],
    inStock: true,
    isNew: true,
    isSale: false,
    badge: "New",
  },
  {
    name: "Alsa Fragrance - Moonlight Serenade",
    category: "women",
    price: 93.99,
    rating: 4.8,
    reviews: 178,
    image: "/silver-moonlight-perfume-bottle-with-alsa-fragranc.jpg",
    images: ["/silver-moonlight-perfume-bottle-with-alsa-fragranc.jpg"],
    description: "A new arrival that serenades with moonlit romance and dreamy notes.",
    notesTop: ["Night Jasmine", "Silver Berry", "Dewdrops"],
    notesMiddle: ["Moonflower", "White Rose", "Iris"],
    notesBase: ["White Musk", "Cashmere Wood", "Soft Vanilla"],
    size: ["30ml", "50ml", "100ml"],
    inStock: true,
    isNew: true,
    isSale: false,
    badge: "New",
  },
  {
    name: "Alsa Fragrance - Desert King",
    category: "men",
    price: 97.99,
    rating: 4.9,
    reviews: 201,
    image: "/bronze-desert-cologne-bottle-with-gold-alsa-fragra.jpg",
    images: ["/bronze-desert-cologne-bottle-with-gold-alsa-fragra.jpg"],
    description: "A new arrival with exotic desert notes fit for a king.",
    notesTop: ["Cardamom", "Orange", "Cinnamon"],
    notesMiddle: ["Frankincense", "Myrrh", "Rose"],
    notesBase: ["Oud", "Sandalwood", "Vanilla"],
    size: ["50ml", "100ml"],
    inStock: true,
    isNew: true,
    isSale: false,
    badge: "New",
  },
]

async function main() {
  console.log('Starting to add Limited Edition and New Arrivals products...\n')

  await connectDB()
  console.log('✅ Connected to MongoDB Atlas\n')

  let totalImported = 0
  let totalFailed = 0

  // Add Limited Edition products
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Adding ${limitedEditionProducts.length} Limited Edition products`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  for (const product of limitedEditionProducts) {
    try {
      await Product.create(product)
      totalImported++
      console.log(`✅ Imported: ${product.name}`)
    } catch (error: any) {
      totalFailed++
      console.error(`❌ Error importing ${product.name}:`, error.message)
    }
  }

  // Add New Arrivals products
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Adding ${newArrivalsProducts.length} New Arrivals products`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  for (const product of newArrivalsProducts) {
    try {
      await Product.create(product)
      totalImported++
      console.log(`✅ Imported: ${product.name}`)
    } catch (error: any) {
      totalFailed++
      console.error(`❌ Error importing ${product.name}:`, error.message)
    }
  }

  const limitedEditionCount = await Product.countDocuments({ badge: "Limited Edition" })
  const newArrivalsCount = await Product.countDocuments({ isNew: true })

  console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✨ Import completed!`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Total Summary:`)
  console.log(`  - Successfully imported: ${totalImported}`)
  console.log(`  - Failed: ${totalFailed}`)
  console.log(`\nProducts by Type:`)
  console.log(`  - Limited Edition: ${limitedEditionCount}`)
  console.log(`  - New Arrivals: ${newArrivalsCount}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
}

main()
  .catch((e) => {
    console.error('Fatal error:', e)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })

