import mongoose, { Schema, Model } from 'mongoose'

export interface IProduct {
  _id?: string
  name: string
  category: string
  price: number
  originalPrice?: number
  salePrice?: number
  salePercent?: number
  rating: number
  reviews: number
  image: string
  images?: string[]
  description: string
  notesTop?: string[]
  notesMiddle?: string[]
  notesBase?: string[]
  size?: string[]
  inStock: boolean
  isNew: boolean
  isSale: boolean
  badge?: string
  createdAt?: Date
  updatedAt?: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    salePrice: {
      type: Number,
      default: null,
    },
    salePercent: {
      type: Number,
      default: null,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    notesTop: {
      type: [String],
      default: [],
    },
    notesMiddle: {
      type: [String],
      default: [],
    },
    notesBase: {
      type: [String],
      default: [],
    },
    size: {
      type: [String],
      default: [],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isSale: {
      type: Boolean,
      default: false,
    },
    badge: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true, // Suppress warning for 'isNew' field
  }
)

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)

export default Product

