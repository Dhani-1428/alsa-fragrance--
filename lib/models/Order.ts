import mongoose, { Schema, Model } from 'mongoose'

export interface IOrder {
  _id?: string
  orderNumber: string
  billingInfo: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    country: string
    additionalNotes?: string
  }
  cartItems: Array<{
    product: {
      id: string | number // Support both string (MongoDB ObjectId) and number
      name: string
      price: number
      image?: string
    }
    size: string
    quantity: number
  }>
  subtotal: number
  shipping: number
  tax: number
  grandTotal: number
  paymentMethod: "Card" | "MBWay"
  status: "pending" | "confirmed" | "cancelled"
  createdAt?: Date
  confirmedAt?: Date
  updatedAt?: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    billingInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      additionalNotes: { type: String },
    },
    cartItems: [
      {
        product: {
          id: { type: String, required: true }, // Changed to String to support MongoDB ObjectId
          name: { type: String, required: true },
          price: { type: Number, required: true },
          image: { type: String },
        },
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    shipping: {
      type: Number,
      required: true,
      default: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Card", "MBWay"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      required: true,
      default: "pending",
    },
    confirmedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Delete existing model if it exists to ensure schema changes take effect
if (mongoose.models.Order) {
  delete mongoose.models.Order
}

const Order: Model<IOrder> = mongoose.model<IOrder>('Order', OrderSchema)

export default Order

