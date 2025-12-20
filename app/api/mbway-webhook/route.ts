import { NextRequest, NextResponse } from "next/server"
import { getPendingMBWayOrders, confirmOrder } from "@/lib/orders-mysql"
import nodemailer from "nodemailer"

export const runtime = "nodejs"

/**
 * Webhook endpoint for MBWay payment notifications
 * This can be called by:
 * 1. Bank/MBWay API when payment is received
 * 2. Manual verification system
 * 3. Scheduled cron job that checks for payments
 * 
 * Expected payload examples:
 * - { "phone": "+351 920062535", "amount": 1.00, "reference": "order-ref" }
 * - { "amount": 1.00, "timestamp": "2024-01-01T12:00:00Z" }
 * - { "transactionId": "MBW123456", "orderNumber": "AF-1234567890" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, phone, reference, transactionId, orderNumber, timestamp } = body

    console.log("MBWay webhook received:", body)

    // Find matching pending order
    const pendingOrders = await getPendingMBWayOrders()
    let orderToConfirm

    // Try multiple matching strategies
    if (orderNumber) {
      const order = pendingOrders.find((o) => o.orderNumber === orderNumber)
      if (order && (!amount || Math.abs(order.grandTotal - parseFloat(amount)) < 0.01)) {
        orderToConfirm = await confirmOrder(order.id)
      }
    } else if (amount) {
      // Find by amount match (with timestamp if provided for better matching)
      const matchingOrders = pendingOrders.filter(
        (o) => Math.abs(o.grandTotal - parseFloat(amount)) < 0.01
      )
      
      if (matchingOrders.length === 1) {
        // Single match - confirm it
        orderToConfirm = await confirmOrder(matchingOrders[0].id)
      } else if (matchingOrders.length > 1 && timestamp) {
        // Multiple matches - use timestamp to find closest match
        const targetTime = new Date(timestamp).getTime()
        const closestOrder = matchingOrders.reduce((closest, current) => {
          const currentTime = new Date(current.createdAt).getTime()
          const closestTime = new Date(closest.createdAt).getTime()
          return Math.abs(currentTime - targetTime) < Math.abs(closestTime - targetTime)
            ? current
            : closest
        })
        orderToConfirm = await confirmOrder(closestOrder.id)
      } else if (matchingOrders.length > 0) {
        // Multiple matches but no timestamp - confirm most recent
        const mostRecent = matchingOrders.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]
        orderToConfirm = await confirmOrder(mostRecent.id)
      }
    } else if (reference) {
      // Find by reference/transaction ID
      const order = pendingOrders.find((o) => 
        o.orderNumber.includes(reference) || 
        (transactionId && o.orderNumber.includes(transactionId))
      )
      if (order) {
        orderToConfirm = await confirmOrder(order.id)
      }
    }

    if (!orderToConfirm) {
      console.warn("No matching pending MBWay order found for webhook payload:", body)
      return NextResponse.json(
        { 
          success: false, 
          error: "No matching pending order found",
          received: body 
        },
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

    // Generate order details HTML for confirmation email
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
          
          <p style="font-size: 16px;">Great news! Your MBWay payment has been <strong>confirmed</strong> and received. Your order is now confirmed and will be delivered in <strong>5-7 days</strong>.</p>
          
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

          <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Payment Method:</strong> MBWay</p>
            <p style="margin: 10px 0 0 0; font-size: 14px;">✅ Payment confirmed and received.</p>
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
              <h1 style="margin: 0;">MBWay Payment Automatically Confirmed ✅</h1>
            </div>
            
            <p><strong>Order Number:</strong> ${orderToConfirm.orderNumber}</p>
            <p><strong>Customer:</strong> ${orderToConfirm.billingInfo.fullName}</p>
            <p><strong>Email:</strong> ${orderToConfirm.billingInfo.email}</p>
            <p><strong>Amount:</strong> €${orderToConfirm.grandTotal.toFixed(2)}</p>
            <p><strong>Confirmed at:</strong> ${new Date().toLocaleString()}</p>
            
            ${transactionId ? `<p><strong>Transaction ID:</strong> ${transactionId}</p>` : ""}
            
            <p style="margin-top: 30px; color: #28a745; font-weight: bold;">
              This order has been automatically confirmed and is ready for processing.
            </p>
          </body>
        </html>
      `,
    })

    console.log(`Order ${orderToConfirm.orderNumber} confirmed via webhook`)

    return NextResponse.json({
      success: true,
      message: "MBWay payment confirmed and order confirmed",
      order: {
        id: orderToConfirm.id,
        orderNumber: orderToConfirm.orderNumber,
        status: orderToConfirm.status,
      },
    })
  } catch (error) {
    console.error("MBWay webhook error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process webhook" },
      { status: 500 }
    )
  }
}

