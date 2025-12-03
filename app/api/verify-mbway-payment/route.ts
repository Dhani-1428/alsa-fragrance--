import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { getPendingMBWayOrders, confirmOrder, getOrderByEmailAndStatus } from "@/lib/orders"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, orderNumber, email, amount, phoneNumber, paymentReference } = body

    let orderToConfirm

    // Find order by ID, order number, email, phone number, or amount
    if (orderId) {
      orderToConfirm = confirmOrder(orderId)
    } else if (orderNumber) {
      const orders = getPendingMBWayOrders()
      const order = orders.find((o) => o.orderNumber === orderNumber)
      if (order) {
        orderToConfirm = confirmOrder(order.id)
      }
    } else if (email) {
      const order = getOrderByEmailAndStatus(email, "pending")
      if (order) {
        orderToConfirm = confirmOrder(order.id)
      }
    } else if (phoneNumber) {
      // Find by phone number
      const orders = getPendingMBWayOrders()
      const order = orders.find((o) => o.billingInfo.phone === phoneNumber)
      if (order) {
        orderToConfirm = confirmOrder(order.id)
      }
    } else if (amount) {
      // Find by matching amount (most recent pending order with matching amount)
      const orders = getPendingMBWayOrders()
      const matchingOrders = orders.filter((o) => Math.abs(o.grandTotal - parseFloat(amount)) < 0.01)
      if (matchingOrders.length > 0) {
        // Get the most recent order
        const mostRecent = matchingOrders.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]
        orderToConfirm = confirmOrder(mostRecent.id)
      }
    } else if (paymentReference) {
      // Find by payment reference (if MBWay provides transaction ID)
      const orders = getPendingMBWayOrders()
      // This would need to be stored with order if MBWay provides ref numbers
      // For now, we'll use order number as reference
      const order = orders.find((o) => o.orderNumber.includes(paymentReference))
      if (order) {
        orderToConfirm = confirmOrder(order.id)
      }
    }

    if (!orderToConfirm) {
      return NextResponse.json(
        { success: false, error: "No pending MBWay order found" },
        { status: 404 }
      )
    }

    // Configure SMTP transporter
    const smtpUser = process.env.SMTP_USER || "fragrancealsa@gmail.com"
    const smtpPass = process.env.SMTP_PASS || "klfb nega dvyi ywqx"

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    // Generate order details HTML
    const orderItemsHtml = orderToConfirm.cartItems
      .map(
        (item: any) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.size}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">€${item.product.price.toFixed(2)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">€${(item.product.price * item.quantity).toFixed(2)}</td>
        </tr>
      `
      )
      .join("")

    // Send confirmation email to customer
    const confirmationEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Payment Confirmed - Order Confirmed!</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #28a745; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="margin: 0;">Payment Confirmed! 🎉</h1>
          </div>
          
          <p style="font-size: 16px;">Dear ${orderToConfirm.billingInfo.fullName},</p>
          
          <p style="font-size: 16px;">Your MBWay payment has been confirmed! Your order is now confirmed and will be delivered in <strong>5-7 days</strong>.</p>
          
          <div style="background-color: #fff; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #2c3e50; margin-top: 0;">Order Details</h2>
            <p><strong>Order Number:</strong> ${orderToConfirm.orderNumber}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Product</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Size</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Qty</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Price</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4" style="padding: 10px; text-align: right; border-top: 2px solid #dee2e6;">Subtotal:</td>
                  <td style="padding: 10px; border-top: 2px solid #dee2e6;">€${orderToConfirm.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="4" style="padding: 10px; text-align: right;">Shipping:</td>
                  <td style="padding: 10px;">€${orderToConfirm.shipping.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="4" style="padding: 10px; text-align: right;">Tax:</td>
                  <td style="padding: 10px;">€${orderToConfirm.tax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="4" style="padding: 10px; text-align: right; font-weight: bold;">Total Amount:</td>
                  <td style="padding: 10px; font-weight: bold;">€${orderToConfirm.grandTotal.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style="background-color: #fff; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">Delivery Address</h3>
            <p style="margin: 5px 0;">${orderToConfirm.billingInfo.fullName}</p>
            <p style="margin: 5px 0;">${orderToConfirm.billingInfo.address}</p>
            <p style="margin: 5px 0;">${orderToConfirm.billingInfo.city}, ${orderToConfirm.billingInfo.postalCode}</p>
            <p style="margin: 5px 0;">${orderToConfirm.billingInfo.country}</p>
            <p style="margin: 5px 0;">Phone: ${orderToConfirm.billingInfo.phone}</p>
          </div>

          <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Payment Method:</strong> MBWay</p>
            <p style="margin: 10px 0 0 0; font-size: 14px;">Payment confirmed and received.</p>
          </div>

          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Thank you for your order! If you have any questions, please don't hesitate to contact us.
          </p>
        </body>
      </html>
    `

    // Send confirmation email to customer
    await transporter.sendMail({
      from: `Alsa Fragrance <${smtpUser}>`,
      to: orderToConfirm.billingInfo.email,
      subject: `Payment Confirmed - Order ${orderToConfirm.orderNumber} is confirmed!`,
      html: confirmationEmailHtml,
    })

    // Send notification to admin
    await transporter.sendMail({
      from: `Alsa Fragrance <${smtpUser}>`,
      to: "fragrancealsa@gmail.com",
      subject: `MBWay Payment Confirmed - Order ${orderToConfirm.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>MBWay Payment Confirmed</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #28a745; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h1 style="margin: 0;">MBWay Payment Confirmed ✅</h1>
            </div>
            
            <p><strong>Order Number:</strong> ${orderToConfirm.orderNumber}</p>
            <p><strong>Customer:</strong> ${orderToConfirm.billingInfo.fullName}</p>
            <p><strong>Email:</strong> ${orderToConfirm.billingInfo.email}</p>
            <p><strong>Amount:</strong> €${orderToConfirm.grandTotal.toFixed(2)}</p>
            <p><strong>Confirmed at:</strong> ${new Date().toLocaleString()}</p>
            
            <p style="margin-top: 30px; color: #28a745; font-weight: bold;">
              This order is now confirmed and ready for processing.
            </p>
          </body>
        </html>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "MBWay payment confirmed and order confirmed",
      order: orderToConfirm,
    })
  } catch (error) {
    console.error("MBWay verification error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to verify payment" },
      { status: 500 }
    )
  }
}

// GET endpoint to check pending orders (for admin use)
export async function GET(request: NextRequest) {
  try {
    const pendingOrders = getPendingMBWayOrders()
    return NextResponse.json({
      success: true,
      pendingOrders: pendingOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.billingInfo.fullName,
        email: order.billingInfo.email,
        amount: order.grandTotal,
        createdAt: order.createdAt,
      })),
    })
  } catch (error) {
    console.error("Error fetching pending orders:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch pending orders" },
      { status: 500 }
    )
  }
}

