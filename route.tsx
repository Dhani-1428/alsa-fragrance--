import { NextResponse } from "next/server";
// @ts-ignore: TypeScript may complain if 'resend' types are missing
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    console.log("[v0] Contact form submission received:", {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    })

    const { data, error } = await resend.emails.send({
      from: "Alsa Fragrance Contact Form <onboarding@resend.dev>",
      to: ["fragrancealsa@gmail.com"],
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706; border-bottom: 2px solid #d97706; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>From:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #4b5563;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>This email was sent from the Alsa Fragrance contact form.</p>
            <p>Submitted on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("[v0] Error sending email:", error)
      return NextResponse.json(
        {
          success: false,
          message: "There was an error sending your message. Please try again or email us directly.",
        },
        { status: 500 },
      )
    }

    console.log("[v0] Email sent successfully:", data)

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully! We'll get back to you soon.",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error processing contact form:", error)
    return NextResponse.json(
      {
        success: false,
        message: "There was an error sending your message. Please try again.",
      },
      { status: 500 },
    )
  }
}
