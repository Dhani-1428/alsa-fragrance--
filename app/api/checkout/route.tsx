import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { createOrder } from "@/lib/orders"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { billingInfo, cartItems, subtotal, shipping, tax, grandTotal, totalPrice, paymentMethod } = await request.json()

    const computedSubtotal = cartItems.reduce(
      (total: number, item: any) => total + item.product.price * item.quantity,
      0,
    )
    const effectiveSubtotal = typeof subtotal === "number" ? subtotal : computedSubtotal
    const effectiveShipping = 0
    const effectiveTax = 0
    const effectiveGrandTotal = effectiveSubtotal

    // Create and store order
    const order = createOrder({
      billingInfo,
      cartItems,
      subtotal: effectiveSubtotal,
      shipping: effectiveShipping,
      tax: effectiveTax,
      grandTotal: effectiveGrandTotal,
      paymentMethod: paymentMethod === "MBWay" ? "MBWay" : "Card",
    })

    // Generate order details HTML
    const orderItemsHtml = cartItems
      .map(
        (item: any) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.size}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">€${item.product.price.toFixed(2)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">€${(item.product.price * item.quantity).toFixed(2)}</td>
        </tr>
      `,
      )
      .join("")

    // Customer confirmation email
    const isMBWayPending = paymentMethod === "MBWay"
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${isMBWayPending ? "Order Pending Payment" : "Order Confirmation"}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: ${isMBWayPending ? "#ffc107" : "#f8f9fa"}; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: ${isMBWayPending ? "#856404" : "#2c3e50"}; margin: 0;">${isMBWayPending ? "Order Pending Payment ⏳" : "Order Confirmed! 🎉"}</h1>
          </div>
          
          <p style="font-size: 16px;">Dear ${billingInfo.fullName},</p>
          
          ${isMBWayPending 
            ? `<p style="font-size: 16px;">Your order has been received and is <strong>pending payment confirmation</strong>. Once payment is confirmed, your order will be processed and delivered in <strong>5-7 days</strong>.</p>
               <p style="font-size: 16px;"><strong>Order Number:</strong> ${order.orderNumber}</p>`
            : `<p style="font-size: 16px;">Your order is confirmed and it will be delivered in <strong>5-7 days</strong>.</p>
               <p style="font-size: 16px;"><strong>Order Number:</strong> ${order.orderNumber}</p>`
          }
          
          <div style="background-color: #fff; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #2c3e50; margin-top: 0;">Order Details</h2>
            
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
                  <td style="padding: 10px; border-top: 2px solid #dee2e6;">€${effectiveSubtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="4" style="padding: 10px; text-align: right;">Shipping:</td>
                  <td style="padding: 10px;">€${effectiveShipping.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="4" style="padding: 10px; text-align: right;">Tax:</td>
                  <td style="padding: 10px;">€${effectiveTax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="4" style="padding: 10px; text-align: right; font-weight: bold;">Total Amount:</td>
                  <td style="padding: 10px; font-weight: bold;">€${effectiveGrandTotal.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style="background-color: #fff; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">Delivery Address</h3>
            <p style="margin: 5px 0;">${billingInfo.fullName}</p>
            <p style="margin: 5px 0;">${billingInfo.address}</p>
            <p style="margin: 5px 0;">${billingInfo.city}, ${billingInfo.postalCode}</p>
            <p style="margin: 5px 0;">${billingInfo.country}</p>
            <p style="margin: 5px 0;">Phone: ${billingInfo.phone}</p>
            ${billingInfo.additionalNotes ? `<p style="margin: 10px 0 5px 0;"><strong>Notes:</strong> ${billingInfo.additionalNotes}</p>` : ""}
          </div>

          <div style="background-color: ${isMBWayPending ? "#fff3cd" : "#e7f3ff"}; border-left: 4px solid ${isMBWayPending ? "#ffc107" : "#2196F3"}; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Payment Method:</strong> ${paymentMethod || "Card"}</p>
            ${isMBWayPending 
              ? `<p style="margin: 10px 0 0 0; font-size: 14px;"><strong>Action Required:</strong> Please send payment of <strong>€${effectiveGrandTotal.toFixed(2)}</strong> to <strong>+351 920306889</strong> via MBWay.</p>
                 <p style="margin: 10px 0 0 0; font-size: 14px;">Once payment is received and confirmed, you will receive a confirmation email and your order will be processed.</p>`
              : `<p style="margin: 10px 0 0 0; font-size: 14px;">Payment processed successfully.</p>`
            }
          </div>

          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Thank you for your order! If you have any questions, please don't hesitate to contact us.
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #666; font-size: 12px;">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </body>
      </html>
    `

    // Admin notification email
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Order Received</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #28a745; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="margin: 0;">New Order Received! 🛍️</h1>
          </div>
          
          <div style="background-color: #fff; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #2c3e50; margin-top: 0;">Customer Information</h2>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px; font-weight: bold;">Name:</td>
                <td style="padding: 8px;">${billingInfo.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Email:</td>
                <td style="padding: 8px;">${billingInfo.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Phone:</td>
                <td style="padding: 8px;">${billingInfo.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Address:</td>
                <td style="padding: 8px;">${billingInfo.address}, ${billingInfo.city}, ${billingInfo.postalCode}, ${billingInfo.country}</td>
              </tr>
              ${billingInfo.additionalNotes ? `<tr><td style="padding: 8px; font-weight: bold;">Notes:</td><td style="padding: 8px;">${billingInfo.additionalNotes}</td></tr>` : ""}
            </table>
          </div>

          <div style="background-color: #fff; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #2c3e50; margin-top: 0;">Order Details</h2>
            
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
                  <td style="padding: 10px; border-top: 2px solid #dee2e6;">€${effectiveSubtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="4" style="padding: 10px; text-align: right;">Shipping:</td>
                  <td style="padding: 10px;">€${effectiveShipping.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="4" style="padding: 10px; text-align: right;">Tax:</td>
                  <td style="padding: 10px;">€${effectiveTax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="4" style="padding: 10px; text-align: right; font-weight: bold;">Total Amount:</td>
                  <td style="padding: 10px; font-weight: bold;">€${effectiveGrandTotal.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Payment Method:</strong> ${paymentMethod || "Card"}</p>
            ${isMBWayPending 
              ? `<p style="margin: 10px 0 0 0; font-size: 14px;"><strong>Status:</strong> Payment Pending - Customer should send payment of <strong>€${effectiveGrandTotal.toFixed(2)}</strong> to <strong>+351 920306889</strong></p>
                 <p style="margin: 10px 0 0 0; font-size: 14px;"><strong>Order Number:</strong> ${order.orderNumber}</p>
                 <p style="margin: 10px 0 0 0; font-size: 14px;">Once payment is received, verify it via the admin panel or API endpoint to confirm the order.</p>`
              : `<p style="margin: 10px 0 0 0; font-size: 14px;">Payment processed via card.</p>`
            }
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #666; font-size: 12px;">
            <p>Order received at ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `

    // Configure SMTP transporter (Gmail)
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

    // Send email to customer only if payment is confirmed (Card) or pending (MBWay)
    await transporter.sendMail({
      from: `Alsa Fragrance <${smtpUser}>`,
      to: billingInfo.email,
      subject: isMBWayPending 
        ? `Order Received - Payment Pending (Order ${order.orderNumber})`
        : "Order Confirmation - Your order will be delivered in 5-7 days",
      html: customerEmailHtml,
    })

    // Send email to admin
    await transporter.sendMail({
      from: `Alsa Fragrance <${smtpUser}>`,
      to: "fragrancealsa@gmail.com",
      subject: `New Order from ${billingInfo.fullName} - €${effectiveGrandTotal.toFixed(2)}`,
      html: adminEmailHtml,
    })

    return NextResponse.json({ 
      success: true, 
      message: isMBWayPending ? "Order received, pending payment confirmation" : "Order placed successfully",
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      isMBWayPending
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ success: false, error: "Failed to process order" }, { status: 500 })
  }
}
