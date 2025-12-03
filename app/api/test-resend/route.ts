import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function GET() {
  try {
    const resendApiKey = process.env.RESEND_API_KEY
    
    // Check if API key exists
    if (!resendApiKey) {
      return NextResponse.json({
        status: "not_configured",
        message: "RESEND_API_KEY is not set in environment variables",
        configured: false,
        apiKeyPresent: false,
        apiKeyLength: 0,
      }, { status: 200 })
    }

    // Check API key format (Resend keys start with "re_")
    const isValidFormat = resendApiKey.startsWith("re_")
    
    if (!isValidFormat) {
      return NextResponse.json({
        status: "invalid_format",
        message: "RESEND_API_KEY format appears invalid (should start with 're_')",
        configured: true,
        apiKeyPresent: true,
        apiKeyLength: resendApiKey.length,
        isValidFormat: false,
      }, { status: 200 })
    }

    // Try to initialize Resend
    const resend = new Resend(resendApiKey)

    // Test API connection by checking domains (this is a lightweight API call)
    try {
      const domainsResponse = await resend.domains.list()
      
      return NextResponse.json({
        status: "working",
        message: "Resend API is configured and working!",
        configured: true,
        apiKeyPresent: true,
        apiKeyLength: resendApiKey.length,
        isValidFormat: true,
        domainsCount: domainsResponse?.data?.length || 0,
        testSuccessful: true,
      }, { status: 200 })
    } catch (apiError: any) {
      // If domains.list fails, try a simple email send test
      return NextResponse.json({
        status: "api_error",
        message: "Resend API key is configured but API call failed",
        configured: true,
        apiKeyPresent: true,
        apiKeyLength: resendApiKey.length,
        isValidFormat: true,
        error: apiError?.message || "Unknown error",
        errorDetails: apiError?.response?.data || null,
      }, { status: 200 })
    }
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: "Error checking Resend configuration",
      error: error?.message || "Unknown error",
    }, { status: 500 })
  }
}

// POST endpoint to test sending an email
export async function POST() {
  try {
    const resendApiKey = process.env.RESEND_API_KEY
    
    if (!resendApiKey) {
      return NextResponse.json({
        success: false,
        message: "RESEND_API_KEY is not configured",
      }, { status: 503 })
    }

    const resend = new Resend(resendApiKey)

    // Try to send a test email
    const { data, error } = await resend.emails.send({
      from: "Alsa Fragrance Test <onboarding@resend.dev>",
      to: ["fragrancealsa@gmail.com"],
      subject: "Resend API Test - Alsa Fragrance",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">Resend API Test</h2>
          <p>This is a test email to verify that Resend API is working correctly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p>If you received this email, Resend is configured and working!</p>
        </div>
      `,
    })

    if (error) {
      return NextResponse.json({
        success: false,
        message: "Failed to send test email",
        error: error,
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
      emailId: data?.id,
      data: data,
    }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Error sending test email",
      error: error?.message || "Unknown error",
    }, { status: 500 })
  }
}

