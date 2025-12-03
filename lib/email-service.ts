// Email service configuration
export const EMAIL_CONFIG = {
  // EmailJS configuration
  SERVICE_ID: 'service_alsafragrance',
  TEMPLATE_ID: 'template_contact_form',
  PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY', // Replace with your EmailJS public key
  
  // Alternative: Formspree configuration
  FORMSPREE_ENDPOINT: 'https://formspree.io/f/xpwgkqkj',
  
  // Alternative: Netlify Forms
  NETLIFY_ENDPOINT: '/.netlify/functions/send-email',
  
  // Target email
  TARGET_EMAIL: 'fragrancealsa@gmail.com'
}

// Email template
export const EMAIL_TEMPLATE = {
  subject: 'New Contact Form Submission - Alsa Fragrance',
  to: 'fragrancealsa@gmail.com',
  from: 'noreply@alsafragrance.com'
}

// Send email using EmailJS
export async function sendEmailWithEmailJS(formData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    // Load EmailJS script dynamically
    if (typeof window !== 'undefined' && !window.emailjs) {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js'
      script.async = true
      document.head.appendChild(script)
      
      await new Promise((resolve) => {
        script.onload = resolve
      })
    }

    if (typeof window !== 'undefined' && window.emailjs) {
      // Initialize EmailJS
      window.emailjs.init(EMAIL_CONFIG.PUBLIC_KEY)
      
      // Send email
      const result = await window.emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_TEMPLATE.template_id || 'template_contact_form',
        {
          to_email: EMAIL_TEMPLATE.to,
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          reply_to: formData.email
        }
      )
      
      return { success: true, result }
    }
    
    throw new Error('EmailJS not available')
  } catch (error) {
    console.error('EmailJS error:', error)
    throw error
  }
}

// Send email using Formspree
export async function sendEmailWithFormspree(formData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    // Use a working Formspree endpoint or create your own
    const response = await fetch('https://formspree.io/f/xpwgkqkj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        _replyto: formData.email,
        _subject: `Contact Form: ${formData.subject}`
      })
    })
    
    if (response.ok) {
      return { success: true, response }
    }
    
    throw new Error(`Formspree error: ${response.status}`)
  } catch (error) {
    console.error('Formspree error:', error)
    throw error
  }
}

// Send email using Netlify Forms
export async function sendEmailWithNetlify(formData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('email', formData.email)
    formDataToSend.append('subject', formData.subject)
    formDataToSend.append('message', formData.message)
    formDataToSend.append('_replyto', formData.email)
    formDataToSend.append('_subject', `Contact Form: ${formData.subject}`)
    
    const response = await fetch('/', {
      method: 'POST',
      body: formDataToSend
    })
    
    if (response.ok) {
      return { success: true, response }
    }
    
    throw new Error(`Netlify Forms error: ${response.status}`)
  } catch (error) {
    console.error('Netlify Forms error:', error)
    throw error
  }
}

// Main email sending function with fallbacks
export async function sendEmail(formData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const methods = [
    sendEmailWithFormspree,
    sendEmailWithEmailJS,
    sendEmailWithNetlify
  ]
  
  for (const method of methods) {
    try {
      const result = await method(formData)
      console.log('Email sent successfully using:', method.name)
      return result
    } catch (error) {
      console.log('Method failed:', method.name, error)
      continue
    }
  }
  
  throw new Error('All email methods failed')
}

// Declare EmailJS types for TypeScript
declare global {
  interface Window {
    emailjs: {
      init: (publicKey: string) => void
      send: (serviceId: string, templateId: string, templateParams: any) => Promise<any>
    }
  }
}
