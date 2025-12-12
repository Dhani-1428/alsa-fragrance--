"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Send, CheckCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-provider"

export function ContactForm() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // First, try to send via API route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        setSubmitStatus('success')
        
        // Copy email content to clipboard as backup
        if (result.emailContent) {
          try {
            await navigator.clipboard.writeText(result.emailContent)
          } catch (clipboardError) {
            console.log('Clipboard not available')
          }
        }
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({ name: "", email: "", subject: "", message: "" })
          setSubmitStatus('idle')
        }, 3000)
      } else {
        // Parse error response to check if fallback should be used
        let errorData
        try {
          const errorText = await response.text()
          errorData = JSON.parse(errorText)
        } catch {
          // If response isn't JSON, treat as unexpected error
          console.error('Contact API request failed with status:', response.status)
          setSubmitStatus('error')
          return
        }

        // If API suggests fallback (e.g., service unavailable), use mailto automatically
        if (errorData.fallback || response.status === 503) {
          // Silently fall back to mailto method - this is expected behavior
          // Don't log as error since this is a graceful degradation
          await handleMailtoFallback()
        } else {
          // Unexpected error - show error message to user
          setSubmitStatus('error')
        }
        return
      }
    } catch (error) {
      // Network error or other exception - use fallback
      await handleMailtoFallback()
    } finally {
      setIsSubmitting(false)
    }
  }

  // Extract mailto fallback logic into a reusable function
  const handleMailtoFallback = async () => {
    try {
      const emailContent = `
New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}
Message: ${formData.message}

Submitted on: ${new Date().toLocaleString()}
      `.trim()

      // Create mailto link with pre-filled content
      const mailtoLink = `mailto:fragrancealsa@gmail.com?subject=Contact Form: ${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(emailContent)}`
      
      // Try to open email client
      const emailWindow = window.open(mailtoLink, '_blank')
      
      if (emailWindow) {
        setSubmitStatus('success')
        setTimeout(() => {
          setFormData({ name: "", email: "", subject: "", message: "" })
          setSubmitStatus('idle')
        }, 3000)
      } else {
        // Final fallback: copy to clipboard
        await navigator.clipboard.writeText(emailContent)
        setSubmitStatus('success')
        alert("Email content copied to clipboard! Please paste it into your email client and send to fragrancealsa@gmail.com")
        
        setTimeout(() => {
          setFormData({ name: "", email: "", subject: "", message: "" })
          setSubmitStatus('idle')
        }, 3000)
      }
    } catch (fallbackError) {
      console.error("Fallback method failed:", fallbackError)
      setSubmitStatus('error')
      
      // Show manual email instructions
      const emailContent = `
New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}
Message: ${formData.message}

Submitted on: ${new Date().toLocaleString()}
      `.trim()
      
      alert(`Please send an email to fragrancealsa@gmail.com with the following content:\n\n${emailContent}`)
      
      setTimeout(() => {
        setFormData({ name: "", email: "", subject: "", message: "" })
        setSubmitStatus('idle')
      }, 3000)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                {t.contact.fullName}
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={t.contact.yourFullName}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t.contact.emailAddress}
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder={t.contact.yourEmail}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              {t.contact.subject}
            </label>
            <Select value={formData.subject} onValueChange={(value) => handleChange("subject", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t.contact.selectSubject} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">{t.contact.generalInquiry}</SelectItem>
                <SelectItem value="product">{t.contact.productQuestion}</SelectItem>
                <SelectItem value="order">{t.contact.orderSupport}</SelectItem>
                <SelectItem value="return">{t.contact.returnsExchanges}</SelectItem>
                <SelectItem value="consultation">{t.contact.fragranceConsultation}</SelectItem>
                <SelectItem value="wholesale">{t.contact.wholesaleInquiry}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              {t.contact.message}
            </label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder={t.contact.tellUsHow}
              rows={6}
              required
            />
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t.contact.sending}
              </>
            ) : submitStatus === 'success' ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                {t.contact.messageSent}
              </>
            ) : submitStatus === 'error' ? (
              <>
                <AlertCircle className="h-4 w-4 mr-2" />
                {t.contact.tryAgain}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t.contact.sendMessage}
              </>
            )}
          </Button>
          
          {submitStatus === 'success' && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-green-800 text-sm">
                  {t.contact.thankYouMessage}
                </p>
              </div>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800 text-sm">
                  {t.contact.errorMessage}
                </p>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
