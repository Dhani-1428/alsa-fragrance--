import { NextResponse } from "next/server"
import Stripe from "stripe"

export const runtime = "nodejs"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20",
});


export async function POST(request: Request) {
  try {
    const { subtotal, shipping, tax, grandTotal, currency = "eur" } = await request.json()

    const amount = Math.round((typeof grandTotal === "number" ? grandTotal : 0) * 100)
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount. Minimum payment is €0.01" }, { status: 400 })
    }
    
    if (!stripeSecretKey || !stripeSecretKey.startsWith("sk_")) {
      console.error("Stripe secret key issue:", stripeSecretKey ? "Key format invalid" : "Missing key")
      return NextResponse.json({ error: "Payment system configuration error" }, { status: 500 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
    })

    if (!paymentIntent.client_secret) {
      return NextResponse.json({ error: "Failed to generate payment intent" }, { status: 500 })
    }

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    console.error("Create PI error:", error)
    return NextResponse.json({ 
      error: error?.message || "Failed to create payment intent. Please try again." 
    }, { status: 500 })
  }
}


